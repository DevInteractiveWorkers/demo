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

export async function createPosition(name: string, description: string) {
  const id = purifyId(name);

  await setDoc(doc(db, "positions", id), {
    name,
    description,
    active: true,
    createdAt: serverTimestamp(),
  });

  return id;
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
  },
) {
  const ref = doc(db, "positions", id);

  await updateDoc(ref, {
    ...data,
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
