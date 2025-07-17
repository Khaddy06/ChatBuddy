"use client";
import { auth } from "@/lib/firebase";
import { useEffect, useState } from "react";
import Link from "next/link";
import { UserCircle2 } from "lucide-react";
import { getContacts } from "@/lib/getContact";
import { getChatId } from "@/lib/chatutil";

interface User {
  lastMessage: string;
  timestamp: string;
  uid: string;
  name: string;
  email: string;
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContacts = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const users = await getContacts(user.uid);
      setContacts(users);
      setLoading(false);
    };

    fetchContacts();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F6FC] p-8">
      <h2 className="text-2xl md:text-3xl font-bold text-[#7F2982] mb-6 drop-shadow-sm">Contacts</h2>

      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-16 bg-[#E0E0E0] rounded-2xl" />
          <div className="h-16 bg-[#E0E0E0] rounded-2xl" />
        </div>
      ) : contacts.length === 0 ? (
        <p className="text-[#7F2982] text-lg">No users found.</p>
      ) : (
        <div className="space-y-4 ">
          {contacts.map((contact) => {
            const currentUser = auth.currentUser?.uid;
            const chatId = currentUser && contact.uid
              ? getChatId(currentUser, contact.uid)
              : contact.uid;
            return (
              <Link href={`/dashboard/chat/${chatId}`} key={contact.uid}>
                <div className="flex items-center  gap-4 p-5 bg-gradient-to-r from-[#F8F6FC] via-[#F7717D]/10 to-[#7F2982]/10 rounded-2xl shadow-md cursor-pointer hover:from-[#F7717D]/20 hover:to-[#7F2982]/20 transition">
                  <div className="w-12 h-12 rounded-full bg-[#E0E0E0] flex items-center justify-center shadow-sm">
                    <UserCircle2 className="text-[#7F2982] w-7 h-7" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-lg font-semibold text-[#7F2982] truncate">{contact.name}</p>
                    <p className="text-sm text-[#1E1E1E]/80 truncate">{contact.lastMessage || "No messages yet"}</p>
                  </div>
                  <div className="text-xs text-[#7F2982]/60 min-w-fit">
                    {contact.timestamp
                      ? new Date(contact.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : ""}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
