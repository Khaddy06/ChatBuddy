"use client";
import { auth } from "@/lib/firebase";
import { useEffect, useState } from "react";
import Link from "next/link";
import { UserCircle2 } from "lucide-react";
import { getContacts } from "@/lib/getContact";

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
    <div className="p-8">
      <h2 className="text-2xl text-black  font-semibold mb-4">Contact</h2>

      {loading ? (
        <div className="animate-pulse space-y-3">
          <div className="h-14 bg-gray-200 rounded-lg" />
          <div className="h-14 bg-gray-200 rounded-lg" />
        </div>
      ) : contacts.length === 0 ? (
        <p className="text-gray-500">No users found.</p>
      ) : (
        <div className="space-y-3">
          {contacts.map((contact) => (
            <Link href={`/dashboard/chat/${contact.uid}`} key={contact.uid}>
              <div className="flex items-center gap-3 mb-3 p-6 bg-blue-400 rounded-xl shadow-sm cursor-pointer hover:bg-blue-500 transition">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <UserCircle2 className="text-gray-500 w-6 h-6" />
                </div>
                <div className="flex-1">
                  <p className="text-lg font-medium text-white">
                    {contact.name}
                  </p>
                  <p className="text-sm text-white/80 truncate">
                    {contact.lastMessage || "No messages yet"}
                  </p>
                </div>
                <div className="text-xs text-white/60">
                  {contact.timestamp
                    ? new Date(contact.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
