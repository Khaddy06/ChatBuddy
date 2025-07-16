// hooks/useAuthUid.ts
"use client";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";

export function useAuthUid() {
  const [uid, setUid] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) setUid(user.uid);
    });
    return () => unsubscribe();
  }, []);

  return uid;
}
