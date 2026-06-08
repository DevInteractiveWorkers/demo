// src/lib/firestore.ts

import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  getDoc,
  DocumentReference,
  updateDoc,
} from "firebase/firestore";

import { db } from "./firebase";

export async function createPosition(name: string, description: string) {
  return addDoc(collection(db, "positions"), {
    name,
    description,
    active: true,
    createdAt: serverTimestamp(),
  });
}

export async function createCandidate(
  firstName: string,
  lastName: string,
  positionId: string,
  resumeUrl = "",
  videoUrl = "",
) {
  const positionRef = doc(db, "positions", positionId);

  return addDoc(collection(db, "candidates"), {
    name: firstName,
    lastName,
    position: positionRef,
    resumeUrl,
    videoUrl,
    createdAt: serverTimestamp(),
    lastUpdatedAt: serverTimestamp(),
  });
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

export async function getCandidates() {
  const snapshot = await getDocs(collection(db, "candidates"));

  const candidates = await Promise.all(
    snapshot.docs.map(async (candidateDoc) => {
      const data = candidateDoc.data();

      let position = null;

      if (data.position) {
        const positionSnap = await getDoc(data.position as DocumentReference);

        if (positionSnap.exists()) {
          position = {
            id: positionSnap.id,
            ...positionSnap.data(),
          };
        }
      }

      return {
        id: candidateDoc.id,
        ...data,
        position,
      };
    }),
  );

  return candidates;
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
