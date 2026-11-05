// src/lib/firestore.ts

import {
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  getDoc,
  DocumentReference,
  DocumentSnapshot,
  updateDoc,
  setDoc,
  deleteDoc,
  where,
  orderBy,
  writeBatch,
  getCountFromServer,
} from "firebase/firestore";

import { db } from "./firebase";
import { Candidate, Position } from "./type";

function purifyId(id: string) {
  const newId = id
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // remove accents
    .replace(/[^a-z\s]/g, "") // keep only letters and spaces
    .replace(/\s+/g, "-") // spaces -> hyphens
    .replace(/-+/g, "-"); // avoid duplicate hyphens
  return newId;
}

/* -------------------------------------------------------------------------- */
/*                               Snapshot mappers                              */
/* -------------------------------------------------------------------------- */

function toPosition(snap: DocumentSnapshot): Position {
  return { id: snap.id, ...(snap.data() as Omit<Position, "id">) };
}

function toCandidate(
  snap: DocumentSnapshot,
  position: Position | null,
): Candidate {
  return {
    id: snap.id,
    ...(snap.data() as Omit<Candidate, "id" | "position">),
    position,
  };
}

// Firestore returns `lastUpdatedAt` as a Timestamp; fall back to Date/number.
function updatedAtMillis(value: any): number {
  return value?.toMillis?.() ?? Number(value);
}

/* -------------------------------------------------------------------------- */
/*                                   Writes                                    */
/* -------------------------------------------------------------------------- */

/**
 * `options.id` is used as-is (callers resolve it with `resolvePositionId`);
 * without it the id falls back to the legacy name-derived one.
 * Refuses to overwrite an existing position.
 */
export async function createPosition(
  name: string,
  description: string,
  options: { id?: string; icon?: string } = {},
) {
  const id = options.id || purifyId(name);
  const ref = doc(db, "positions", id);

  if ((await getDoc(ref)).exists()) {
    throw new Error(`A position with the ID "${id}" already exists.`);
  }

  const data: Record<string, any> = {
    name,
    description,
    active: true,
    createdAt: serverTimestamp(),
  };

  if (options.icon) data.icon = options.icon;

  await setDoc(ref, data);

  return id;
}

export async function positionExists(id: string): Promise<boolean> {
  return (await getDoc(doc(db, "positions", id))).exists();
}

/** Number of candidates referencing the position. */
export async function countCandidatesByPosition(id: string): Promise<number> {
  const snapshot = await getCountFromServer(
    query(
      collection(db, "candidates"),
      where("position", "==", doc(db, "positions", id)),
    ),
  );

  return snapshot.data().count;
}

export type PositionMigrationStage =
  | "validate"
  | "create"
  | "candidates"
  | "verify"
  | "delete";

export class PositionMigrationError extends Error {
  constructor(
    message: string,
    public readonly stage: PositionMigrationStage,
    public readonly migrated = 0,
    public readonly total = 0,
    /** True when candidates were moved back and the new doc removed. */
    public readonly rolledBack = false,
  ) {
    super(message);
    this.name = "PositionMigrationError";
  }
}

const BATCH_SIZE = 400; // Firestore limit is 500 writes per batch

async function repointCandidates(
  candidateRefs: DocumentReference[],
  target: DocumentReference,
) {
  for (let i = 0; i < candidateRefs.length; i += BATCH_SIZE) {
    const batch = writeBatch(db);

    candidateRefs
      .slice(i, i + BATCH_SIZE)
      .forEach((ref) => batch.update(ref, { position: target }));

    await batch.commit();
  }
}

/**
 * Changes a position's id (Firestore ids can't be edited in place):
 *   1. create the new position doc (copy of the old one + `changes`)
 *   2. repoint every candidate from the old position to the new one
 *   3. delete the old position doc
 * The old doc is only deleted after every candidate points at the new one, so
 * a failure never leaves candidates referencing a deleted position. If step 2
 * fails, candidates already moved are moved back and the new doc is removed;
 * the thrown PositionMigrationError reports exactly what happened.
 */
export async function migratePositionId(
  oldId: string,
  newId: string,
  changes: {
    name: string;
    description: string;
    active: boolean;
    icon?: string;
  },
): Promise<{ migrated: number }> {
  if (oldId === newId) {
    throw new PositionMigrationError("The ID did not change.", "validate");
  }

  const oldRef = doc(db, "positions", oldId);
  const newRef = doc(db, "positions", newId);

  const [oldSnap, newSnap] = await Promise.all([getDoc(oldRef), getDoc(newRef)]);

  if (!oldSnap.exists()) {
    throw new PositionMigrationError(
      `Position "${oldId}" no longer exists.`,
      "validate",
    );
  }

  if (newSnap.exists()) {
    throw new PositionMigrationError(
      `A position with the ID "${newId}" already exists.`,
      "validate",
    );
  }

  // 1. Create the new position.
  const { icon, ...rest } = { ...oldSnap.data(), ...changes };
  const newData: Record<string, any> = {
    ...rest,
    lastUpdatedAt: serverTimestamp(),
  };
  if (icon) newData.icon = icon;

  try {
    await setDoc(newRef, newData);
  } catch (error) {
    throw new PositionMigrationError(
      `Could not create "${newId}". Nothing was changed. ${errorText(error)}`,
      "create",
    );
  }

  // 2. Repoint candidates.
  const candidatesSnap = await getDocs(
    query(collection(db, "candidates"), where("position", "==", oldRef)),
  ).catch(() => null);

  if (!candidatesSnap) {
    await deleteDoc(newRef).catch(() => {});

    throw new PositionMigrationError(
      "Could not read the candidates to migrate. Nothing was changed.",
      "candidates",
      0,
      0,
      true,
    );
  }

  const candidateRefs = candidatesSnap.docs.map((d) => d.ref);
  const moved: DocumentReference[] = [];

  try {
    for (let i = 0; i < candidateRefs.length; i += BATCH_SIZE) {
      const chunk = candidateRefs.slice(i, i + BATCH_SIZE);

      await repointCandidates(chunk, newRef);
      moved.push(...chunk);
    }
  } catch (error) {
    // Best-effort rollback so nothing is split across two positions.
    let rolledBack = false;

    try {
      await repointCandidates(moved, oldRef);
      await deleteDoc(newRef);
      rolledBack = true;
    } catch {
      // handled below through `rolledBack`
    }

    throw new PositionMigrationError(
      rolledBack
        ? `Migration failed after ${moved.length} of ${candidateRefs.length} candidates and was rolled back. "${oldId}" is unchanged. ${errorText(error)}`
        : `Migration failed after ${moved.length} of ${candidateRefs.length} candidates and could NOT be rolled back. Both "${oldId}" and "${newId}" still exist and candidates are split between them; nothing was deleted. ${errorText(error)}`,
      "candidates",
      moved.length,
      candidateRefs.length,
      rolledBack,
    );
  }

  // Candidates created while migrating would still point at the old id.
  const remaining = await countCandidatesByPosition(oldId).catch(() => -1);

  if (remaining !== 0) {
    throw new PositionMigrationError(
      `${moved.length} candidates were moved to "${newId}", but ${remaining < 0 ? "the result could not be verified" : `${remaining} still use "${oldId}"`}. The old position was kept; run the update again or move them manually.`,
      "verify",
      moved.length,
      candidateRefs.length,
    );
  }

  // 3. Delete the old position.
  try {
    await deleteDoc(oldRef);
  } catch (error) {
    throw new PositionMigrationError(
      `All ${moved.length} candidates now use "${newId}", but the old position "${oldId}" could not be deleted. Delete it manually. ${errorText(error)}`,
      "delete",
      moved.length,
      candidateRefs.length,
    );
  }

  return { migrated: moved.length };
}

function errorText(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

export async function createCandidate(
  firstName: string,
  lastName: string,
  positionId: string,
  resumeUrl = "",
  videoUrl = "",
  thumbnailUrl = "",
  hasHeadband?: boolean,
) {
  const positionRef = doc(db, "positions", positionId);
  const id = purifyId(`${firstName} ${lastName}`);

  const candidateData: Record<string, any> = {
    name: firstName,
    lastName,
    position: positionRef,
    resumeUrl,
    videoUrl,
    createdAt: serverTimestamp(),
    lastUpdatedAt: serverTimestamp(),
    hasHeadband,
  };

  // Only write the field when it exists — Firestore omits it entirely
  // otherwise, so `candidate.thumbnail` reads back as `undefined`.
  if (thumbnailUrl) {
    candidateData.thumbnail = thumbnailUrl;
  }

  await setDoc(doc(db, "candidates", id), candidateData);

  return id;
}

export async function updatePosition(
  id: string,
  data: {
    name?: string;
    description?: string;
    active?: boolean;
    icon?: string;
  },
) {
  const ref = doc(db, "positions", id);

  // Firestore rejects `undefined` values.
  const defined = Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined),
  );

  await updateDoc(ref, {
    ...defined,
    lastUpdatedAt: serverTimestamp(),
  });
}

export async function updateCandidate(
  id: string,
  data: {
    name?: string;
    lastName?: string;
    positionId?: string;
    resumeUrl?: string;
    videoUrl?: string;
    hasHeadband?: boolean;
    thumbnail?: { shown: boolean; time: number };
  },
) {
  const ref = doc(db, "candidates", id);

  const updateData: Record<string, any> = {
    lastUpdatedAt: serverTimestamp(),
  };

  if (data.name !== undefined) updateData.name = data.name;
  if (data.lastName !== undefined) updateData.lastName = data.lastName;
  if (data.resumeUrl !== undefined) updateData.resumeUrl = data.resumeUrl;
  if (data.videoUrl !== undefined) updateData.videoUrl = data.videoUrl;
  if (data.hasHeadband !== undefined) updateData.hasHeadband = data.hasHeadband;
  if (data.thumbnail !== undefined) updateData.thumbnail = data.thumbnail;

  if (data.positionId) {
    updateData.position = doc(db, "positions", data.positionId);
  }

  await updateDoc(ref, updateData);
}

export async function deleteCandidate(id: string) {
  const ref = doc(db, "candidates", id);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    const data = snap.data();

    const urls = [data.resumeUrl, data.videoUrl, data.thumbnail].filter(
      (url): url is string => typeof url === "string" && url.length > 0,
    );

    // Best-effort: clean up the candidate's files in the bucket before
    // removing the Firestore doc that references them. Imported lazily so
    // the S3 SDK is never part of a page's initial bundle.
    const { deleteFileFromBucket, extractKeyFromUrl } = await import("./s3");

    await Promise.all(
      urls.map((url) => deleteFileFromBucket(extractKeyFromUrl(url))),
    );
  }

  await deleteDoc(ref);
}

/* -------------------------------------------------------------------------- */
/*                                    Reads                                    */
/* -------------------------------------------------------------------------- */

export async function getPosition(id: string): Promise<Position | null> {
  const snap = await getDoc(doc(db, "positions", id));

  return snap.exists() ? toPosition(snap) : null;
}

export async function getPositions(): Promise<Position[]> {
  const snapshot = await getDocs(query(collection(db, "positions")));

  return snapshot.docs.map(toPosition);
}

export async function getCandidates(): Promise<Candidate[]> {
  const [snapshot, positionsSnapshot] = await Promise.all([
    getDocs(
      query(collection(db, "candidates"), orderBy("lastUpdatedAt", "desc")),
    ),
    getDocs(collection(db, "positions")),
  ]);

  const positionsMap = new Map<string, Position>(
    positionsSnapshot.docs.map((positionDoc) => [
      positionDoc.id,
      toPosition(positionDoc),
    ]),
  );

  return snapshot.docs.map((candidateDoc) => {
    const positionRef = candidateDoc.data().position as
      | DocumentReference
      | undefined;

    return toCandidate(
      candidateDoc,
      positionRef ? (positionsMap.get(positionRef.id) ?? null) : null,
    );
  });
}

// Candidates of one position, newest first. Filtering happens in Firestore
// (not by downloading every candidate), and the sort happens here so no
// composite (position + lastUpdatedAt) index is required. Docs without a
// `lastUpdatedAt` are excluded, matching the `orderBy` used by getCandidates.
async function queryCandidateDocsByPosition(positionId: string) {
  const snapshot = await getDocs(
    query(
      collection(db, "candidates"),
      where("position", "==", doc(db, "positions", positionId)),
    ),
  );

  return snapshot.docs
    .filter((candidateDoc) => candidateDoc.data().lastUpdatedAt != null)
    .sort(
      (a, b) =>
        updatedAtMillis(b.data().lastUpdatedAt) -
        updatedAtMillis(a.data().lastUpdatedAt),
    );
}

/**
 * Pass `position` when the caller already has it to skip an extra read.
 */
export async function getCandidatesByPosition(
  positionId: string,
  position?: Position | null,
): Promise<Candidate[]> {
  const [docs, resolvedPosition] = await Promise.all([
    queryCandidateDocsByPosition(positionId),
    position === undefined ? getPosition(positionId) : position,
  ]);

  return docs.map((candidateDoc) => toCandidate(candidateDoc, resolvedPosition));
}

/** Id of the position's most recently updated candidate, if any. */
export async function getFirstCandidateId(
  positionId: string,
): Promise<string | null> {
  const docs = await queryCandidateDocsByPosition(positionId);

  return docs[0]?.id ?? null;
}

/**
 * Pass `knownPosition` (a position the caller already has, or is fetching)
 * to avoid re-reading the candidate's position doc when it is the same one.
 */
export async function getCandidate(
  id: string,
  knownPosition?: Position | null | Promise<Position | null>,
): Promise<Candidate | null> {
  const candidateSnap = await getDoc(doc(db, "candidates", id));

  if (!candidateSnap.exists()) return null;

  const positionRef = candidateSnap.data().position as
    | DocumentReference
    | undefined;

  let position: Position | null = null;

  if (positionRef) {
    const known = await knownPosition;

    if (known && known.id === positionRef.id) {
      position = known;
    } else {
      const positionSnap = await getDoc(positionRef);

      position = positionSnap.exists() ? toPosition(positionSnap) : null;
    }
  }

  return toCandidate(candidateSnap, position);
}
