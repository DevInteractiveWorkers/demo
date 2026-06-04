// src/lib/firestore.ts

import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
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
