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
