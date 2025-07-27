"use client";
import { auth } from "@/lib/firebase";
import { yupResolver } from "@hookform/resolvers/yup";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import {  useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as yup from "yup";
import { Eye, EyeOff } from "lucide-react";

const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "minimum of 6 character")
    .required("Password id required"),
});
export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const onSubmit = async (data: { email: string; password: string }) => {
  try {
    await signInWithEmailAndPassword(auth, data.email, data.password);
    toast.success("Login Successfully");

    // ✅ Ask for notification permission
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      console.log("✅ Notification permission granted");
      // optionally call getToken() here if you're using Firebase Messaging
    } else {
      console.warn("🚫 Notification permission denied or dismissed");
    }

    router.push("/dashboard/chat");
  } catch (error: unknown) {
    if (error instanceof Error) {
      toast.error(`Login failed ❌: ${error.message}`);
    } else {
      toast.error("Login failed ❌: Unknown error");
    }
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F6FC] px-4">
      <div className="w-full max-w-xl bg-white p-10 rounded-3xl shadow-2xl border border-[#E0E0E0]">
        <div className="text-center mb-8">
          <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#F7717D] via-[#DE639A] to-[#7F2982] drop-shadow-sm">ChatBuddy</div>
          <p className="text-[#7F2982] text-base mt-2 font-medium">
            Welcome back! Please log in.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="text-sm font-semibold text-[#7F2982] block mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              {...register("email")}
              className="w-full border border-[#E0E0E0] rounded-xl px-4 py-2 text-base text-[#1E1E1E] placeholder:text-[#7F2982]/60 bg-[#F8F6FC] focus:outline-none focus:ring-2 focus:ring-[#DE639A]"
            />
            {errors.email && (
              <p className="text-[#F7717D] text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-semibold text-[#7F2982] block mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                {...register("password")}
                className="w-full border border-[#E0E0E0] rounded-xl px-4 text-[#1E1E1E] placeholder:text-[#7F2982]/60 bg-[#F8F6FC] py-2 pr-16 text-base focus:outline-none focus:ring-2 focus:ring-[#DE639A]"
              />

              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#7F2982] hover:text-[#F7717D] transition"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <Eye size={20}/> : <EyeOff size={20}/>}
              </button>
            </div>
            {errors.password && (
              <p className="text-[#F7717D] text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button 
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-[#F7717D] via-[#DE639A] to-[#7F2982] hover:from-[#DE639A] hover:to-[#F7717D] text-white font-bold rounded-xl py-2 shadow-md transition text-lg disabled:opacity-60 disabled:cursor-not-allowed">
            {isSubmitting ? "Logging in ..." : "Log In"}
          </button>
        </form>

        <p className="text-center text-base mt-8 text-[#7F2982] font-medium">
          Don’t have an account?{" "}
          <a
            href="/signup"
            className="text-[#F7717D] hover:underline font-bold"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
