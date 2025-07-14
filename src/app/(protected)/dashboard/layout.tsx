"use client"
import { Users, Settings, LogOut, MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { signOut } from 'firebase/auth'
import type { ReactNode } from "react";
import { auth } from "@/lib/firebase";
import SidebarLink from "@/app/components/sidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const handleLogOut = async()=>{
   try{
    await signOut(auth)
   router.push("/login")
  }catch (error){
 console.error('Logout error:', error)
  }
  }
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
       <aside className="w-40 h-screen bg-white shadow-r hidden md:flex flex-col justify-between shadow-sm">
      <div>
        <div className="p-6 text-2xl font-semibold text-blue-600">
          ChatBuddy
        </div>
         <nav className="px-4 pt-2 space-y-1 text-sm">
          <SidebarLink href="/dashboard/contacts" label="Contacts" icon={Users} />
           <SidebarLink href="/dashboard/chat" label="Chat" icon={MessageCircle} />
          <SidebarLink href="#" label="Settings" icon={Settings} />
        </nav>
      </div>

      <div className="px-4 pb-4">
        <p
         onClick={handleLogOut}
          className="flex items-center gap-3 px-3 py-2 text-xl font-medium
           text-gray-500 hover:bg-red-50 hover:text-red-500 rounded-md transition-colors"
        >
          <LogOut size={20} />
          Logout
        </p>
      </div>
    </aside>

      <main className="flex-1 overflow-y-auto bg-gray-50">{children}</main>
    </div>
  );
}
