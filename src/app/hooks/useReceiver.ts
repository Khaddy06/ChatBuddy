// hooks/useReceiver.ts
"use client";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Receiver {
  name: string;
}

export function useReceiver(id: string | null) {
  const [receiver, setReceiver] = useState<Receiver | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchReceiver = async () => {
      const snap = await getDoc(doc(db, "users", id));
      if (snap.exists()) setReceiver(snap.data() as Receiver);
    };
    fetchReceiver();
  }, [id]);

  return receiver;
}
