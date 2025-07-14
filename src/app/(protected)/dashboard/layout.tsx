"use client";
import { Menu, X, Users, Settings, LogOut, MessageCircle } from "lucide-react";
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
    <div className="flex h-screen overflow-hidden bg-gray-50 relative">
      {/* Mobile Menu Button */}
      {!mobileOpen && (
        <button
          onClick={() => setMobileOpen(true)}
          className="absolute top-4 right-4 z-50 font-bold mt-3 md:hidden text-blue-600"
        >
          <Menu size={24} />
        </button>
      )}

      {/* Mobile Modal */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm md:hidden">


          <div className="w-[90%] max-w-sm bg-white rounded-xl shadow-lg p-6 relative">
            {/* Close Button */}
           

            {/* Modal Content */}
            <div className="mb-6  text-2xl font-semibold text-blue-600 flex justify-between">
              <h2 className="text-2xl font-semibold text-blue-600">ChatBuddy</h2>
              <button
              onClick={() => setMobileOpen(false)}
              className="text-black font-bold hover:text-gray-700"
            >
              <X size={25} />
            </button>
            </div>

            <nav className="space-y-3 text-sm">
              <SidebarLink
                href="/dashboard/contacts"
                label="Contacts"
                icon={Users}
                onClick={() => setMobileOpen(false)}
              />
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

            <div className="pt-6">
              <p
                 onClick={handleLogOut}
                className="flex items-center gap-3 px-4 py-2 text-lg font-medium
                  text-gray-500 hover:bg-red-50 hover:text-red-500 rounded-md transition-colors"
              >
                <LogOut size={20} />
                Logout
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="w-40 h-screen bg-white shadow-r hidden md:flex flex-col justify-between shadow-sm">
        <div>
          <div className="p-6 text-2xl font-semibold text-blue-600">ChatBuddy</div>
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
};

