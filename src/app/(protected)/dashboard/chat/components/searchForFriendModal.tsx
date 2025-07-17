import { auth, db } from "@/lib/firebase";
import { collection, where, query, getDocs, getDoc, doc } from "firebase/firestore";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


interface UserProfile {
    uid: string;
    name: string;
    email: string;
}


export default function SearchForFriendModal({onClose}: {onClose: () => void}) {
    const [searchTerm, setSearchTerm] = useState("");
    const [results, setResults] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(false);
    const [chatStatus, setChatStatus] = useState<Record<string, "previous" | "new" | "checking">>({});
    const router = useRouter();
    const currentUser = auth.currentUser?.uid;

    useEffect(() => {
        if (!searchTerm.trim()) {
          setResults([]);
          setChatStatus({});
          return;
        }
    
        const delayDebounce = setTimeout(async () => {
          setLoading(true);
    
          const q = query(
            collection(db, "users"),
            where("name", ">=", searchTerm),
            where("name", "<=", searchTerm + "\uf8ff")
          );
    
          const snapshot = await getDocs(q);
          const matches: UserProfile[] = [];
    
          snapshot.forEach((docSnap) => {
            if (docSnap.id !== currentUser) {
              matches.push({ uid: docSnap.id, ...docSnap.data() } as UserProfile);
            }
          });
    
          setResults(matches);
          setLoading(false);

          // Check chat existence for each result
          const status: Record<string, "previous" | "new" | "checking"> = {};
          for (const user of matches) {
            status[user.uid] = "checking";
            const chatId = currentUser && user.uid
              ? [currentUser, user.uid].sort().join("-")
              : undefined;
            if (!chatId) {
              status[user.uid] = "new";
              continue;
            }
            const chatDoc = await getDoc(doc(db, "conversations", chatId));
            status[user.uid] = chatDoc.exists() ? "previous" : "new";
          }
          setChatStatus(status);
        }, 500); // delay of 500ms
    
        return () => clearTimeout(delayDebounce);
      }, [searchTerm, currentUser]);

    const handleStartChat = (user: UserProfile) => {
        const currentUser = auth.currentUser?.uid;
        const chatId =
        currentUser && user.uid
          ? [currentUser, user.uid].sort().join("-")
          : undefined;

         if (!chatId) return;
         router.push(`/dashboard/chat/${user.uid}`);
         onClose();
    }

    
    return (
        <div className="fixed inset-0 bg-[#F8F6FC]/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md p-8 rounded-3xl shadow-2xl border border-[#E0E0E0] relative">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-[#7F2982] hover:text-[#F7717D] transition"
            >
              <X className="w-6 h-6" />
            </button>
    
            <h2 className="text-2xl font-bold mb-6 text-[#7F2982] text-center drop-shadow-sm">Search Friends</h2>
    
            <input
              placeholder="Enter name"
              className="w-full border border-[#E0E0E0] p-3 rounded-xl mb-6 bg-[#F8F6FC] text-[#1E1E1E] placeholder:text-[#7F2982]/60 focus:outline-none focus:ring-2 focus:ring-[#DE639A] text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
    
            <div className="space-y-4">
              {results.length === 0 && !loading && (
                <p className="text-[#7F2982]/70 text-center">No users found</p>
              )}
              {results.map((user) => (
                <div
                  key={user.uid}
                  className="border border-[#E0E0E0] p-4 rounded-2xl bg-gradient-to-r from-[#F8F6FC] via-[#F7717D]/10 to-[#7F2982]/10 shadow-sm hover:from-[#F7717D]/20 hover:to-[#7F2982]/20 cursor-pointer transition flex items-center justify-between gap-4"
                  onClick={() => handleStartChat(user)}
                >
                  <div>
                    <p className="font-semibold text-[#7F2982]">{user.name}</p>
                    <p className="text-sm text-[#1E1E1E]/80">{user.email}</p>
                  </div>
                  <div className="text-xs font-bold px-3 py-1 rounded-full shadow-sm"
                    style={{
                      background: chatStatus[user.uid] === "previous" ? "#F8F6FC" : "#F7717D22",
                      color: chatStatus[user.uid] === "previous" ? "#7F2982" : "#F7717D"
                    }}
                  >
                    {chatStatus[user.uid] === "checking" ? "Checking..." : chatStatus[user.uid] === "previous" ? "Previous chat" : "New chat"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
}