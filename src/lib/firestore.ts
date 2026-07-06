// src/lib/firestore.ts

import {
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  getDoc,
  DocumentReference,
  updateDoc,
  setDoc,
  limit as firestoreLimit,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData,
  orderBy,
} from "firebase/firestore";

import { db } from "./firebase";
import { Candidate, Position } from "./type";

function purifyId(id: string) {
  const newId = id
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[^a-z\s]/g, "") // keep only letters and spaces
    .replace(/\s+/g, "-") // spaces -> hyphens
    .replace(/-+/g, "-"); // avoid duplicate hyphens
  return newId;
}

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
  hasHeadband?: boolean,
) {
  const positionRef = doc(db, "positions", positionId);

  const id = purifyId(`${firstName} ${lastName}`);

  await setDoc(doc(db, "candidates", id), {
    name: firstName,
    lastName,
    position: positionRef,
    resumeUrl,
    videoUrl,
    createdAt: serverTimestamp(),
    lastUpdatedAt: serverTimestamp(),
    hasHeadband,
  });

  return id;
}

export async function getPosition(id: string): Promise<Position | null> {
  const snap = await getDoc(doc(db, "positions", id));

  if (!snap.exists()) return null;

  return {
    id: snap.id,
    ...(snap.data() as Omit<Position, "id">),
  };
}

export async function getPositions() {
  const snapshot = await getDocs(query(collection(db, "positions")));

  return snapshot.docs.map((doc) => {
    const data = doc.data();

    return {
      id: doc.id,
      name: data.name,
      ...data,
    };
  });
}

export async function getCandidates(options?: {
  limit?: number;
  lastDoc?: QueryDocumentSnapshot<DocumentData>;
}): Promise<{
  candidates: Candidate[];
  lastDoc: QueryDocumentSnapshot<DocumentData> | null;
  hasMore: boolean;
}> {
  let candidatesQuery;

  if (options?.limit) {
    candidatesQuery = options.lastDoc
      ? query(
          collection(db, "candidates"),
          orderBy("lastUpdatedAt", "desc"),
          startAfter(options.lastDoc),
          firestoreLimit(options.limit),
        )
      : query(
          collection(db, "candidates"),
          orderBy("lastUpdatedAt", "desc"),
          firestoreLimit(options.limit),
        );
  } else {
    candidatesQuery = query(
      collection(db, "candidates"),
      orderBy("lastUpdatedAt", "desc"),
    );
  }

  const snapshot = await getDocs(candidatesQuery);

  // Fetch all positions once
  const positionsSnapshot = await getDocs(collection(db, "positions"));

  const positionsMap = new Map<string, Position>();

  positionsSnapshot.docs.forEach((doc) => {
    positionsMap.set(doc.id, {
      id: doc.id,
      ...(doc.data() as Omit<Position, "id">),
    });
  });

  const candidates = snapshot.docs.map((candidateDoc) => {
    const data = candidateDoc.data();

    let position: Position | null = null;

    if (data.position) {
      const positionRef = data.position as DocumentReference;
      position = positionsMap.get(positionRef.id) ?? null;
    }

    return {
      id: candidateDoc.id,
      ...(data as Omit<Candidate, "id" | "position">),
      position,
    };
  });

  return {
    candidates,
    lastDoc: snapshot.docs[snapshot.docs.length - 1] ?? null,
    hasMore:
      options?.limit != null ? snapshot.docs.length === options.limit : false,
  };
}

export async function getCandidatesByPosition(
  positionId: string,
): Promise<Candidate[]> {
  const { candidates } = await getCandidates();

  return candidates.filter(
    (candidate) => candidate.position?.id === positionId,
  );
}

export async function getCandidate(id: string): Promise<Candidate | null> {
  const candidateSnap = await getDoc(doc(db, "candidates", id));

  if (!candidateSnap.exists()) return null;

  const data = candidateSnap.data();

  let position: Position | null = null;

  if (data.position) {
    const positionSnap = await getDoc(data.position as DocumentReference);

    if (positionSnap.exists()) {
      position = {
        id: positionSnap.id,
        ...(positionSnap.data() as Omit<Position, "id">),
      };
    }
  }

  return {
    id: candidateSnap.id,
    ...(data as Omit<Candidate, "id" | "position">),
    position,
  };
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

  if (data.positionId) {
    updateData.position = doc(db, "positions", data.positionId);
  }

  await updateDoc(ref, updateData);
}
