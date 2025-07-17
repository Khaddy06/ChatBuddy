"use client";
import {
  Menu,
  X,
  Settings,
  LogOut,
  MessageCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import type { ReactNode } from "react";
import { auth } from "@/lib/firebase";
import SidebarLink from "@/app/components/sidebar";
import { useState } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

  const handleLogOut = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden
     bg-gradient-to-br from-[#F8F6FC] via-[#F5F3F7] to-[#F8F6FC] relative">
      {/* Mobile Menu Button */}
      {!mobileOpen && (
        <button
          onClick={() => setMobileOpen(true)}
          className="absolute top-4 right-4 z-50 font-bold mt-3 md:hidden text-[#7F2982] bg-white/80 rounded-full p-2 shadow-md hover:bg-[#F7717D]/10 transition"
        >
          <Menu size={24} />
        </button>
      )}

      {/* Mobile Modal */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#F8F6FC]/80 backdrop-blur-sm md:hidden">
          <div className="w-[90%] max-w-sm bg-white rounded-3xl shadow-2xl p-8 relative border border-[#E0E0E0]">
            <div className="mb-6 flex justify-between items-center text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#F7717D] via-[#DE639A] to-[#7F2982] drop-shadow-sm">
              <h2>ChatBuddy</h2>
              <button
                onClick={() => setMobileOpen(false)}
                className="text-[#7F2982] hover:text-[#F7717D] transition"
              >
                <X size={25} />
              </button>
            </div>

            <nav className="space-y-4 text-base font-semibold">
              <SidebarLink
                href="/dashboard/chat"
                label="Chat"
                icon={MessageCircle}
                onClick={() => setMobileOpen(false)}
              />
              <SidebarLink
                href="#"
                label="Settings"
                icon={Settings}
                onClick={() => setMobileOpen(false)}
              />
            </nav>

            <div className="pt-8">
              <p
                onClick={handleLogOut}
                className="flex items-center gap-3 px-4 py-2 text-lg font-bold text-[#7F2982] hover:bg-[#F7717D]/10 hover:text-[#F7717D] rounded-xl transition-colors cursor-pointer"
              >
                <LogOut size={20} />
                Logout
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="w-56 h-screen mx-auto bg-white shadow-xl hidden md:flex flex-col justify-between  border-r border-[#E0E0E0]">
        <div>
          <div className="p-8 text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#F7717D] via-[#DE639A] to-[#7F2982] drop-shadow-sm">ChatBuddy</div>
          <nav className="px-6 pt-4 space-y-2 text-base font-semibold">
            {/* <SidebarLink href="/dashboard/contacts" label="Contacts" icon={Users} /> */}
            <SidebarLink href="/dashboard/chat" label="Chat" icon={MessageCircle} />
            <SidebarLink href="#" label="Settings" icon={Settings} />
          </nav>
        </div>
        <div className="px-6 pb-8">
          <p
            onClick={handleLogOut}
            className="flex items-center gap-3 px-4 py-2 text-lg font-bold text-[#7F2982] hover:bg-[#F7717D]/10 hover:text-[#F7717D] rounded-xl transition-colors cursor-pointer"
          >
            <LogOut size={20} />
            Logout
          </p>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto bg-gradient-to-br from-[#F8F6FC] via-[#F5F3F7] to-[#F8F6FC]">{children}</main>
    </div>
  );
}
