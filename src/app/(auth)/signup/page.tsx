"use client";
import { auth, db } from "@/lib/firebase";
import { yupResolver } from "@hookform/resolvers/yup";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as yup from "yup";

const schema = yup.object().shape({
  name: yup.string().required("name is required"),
  email: yup.string().email("invalid email").required("email is required"),
  password: yup
    .string()
    .min(6, "minimum of 6 character")
    .required("password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "password must match")
    .required("Please confirm your password"),
});

export default function RegisterPage() {
  const [showpassword, setShowPassword] = useState(false);
  const [confirmShowPassword, setConfirmShowPassword] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const onSubmit = async (data: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      await updateProfile(userCredential.user, {
        displayName: data.name,
      });

      await setDoc(doc(db, "users", userCredential.user.uid), {
        uid: userCredential.user.uid,
        name: data.name,
        email: data.email,
      });
      toast.success("Account Created Successfully");
      router.push("/login");
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
            Welcome! Please create an account.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="text-sm font-semibold text-[#7F2982] block mb-1">
              Name
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              {...register("name")}
              className="w-full border border-[#E0E0E0] rounded-xl px-4 py-2 text-base text-[#1E1E1E] placeholder:text-[#7F2982]/60 bg-[#F8F6FC] focus:outline-none focus:ring-2 focus:ring-[#DE639A]"
            />
            {errors.name && (
              <p className="text-[#F7717D] text-xs mt-1">
                {errors?.name?.message}
              </p>
            )}
          </div>
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
                {errors?.email?.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-semibold text-[#7F2982] block mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showpassword ? "text" : "password"}
                placeholder="Enter password"
                {...register("password")}
                className="w-full border border-[#E0E0E0] rounded-xl px-4 py-2 text-base text-[#1E1E1E] placeholder:text-[#7F2982]/60 bg-[#F8F6FC] pr-16 focus:outline-none focus:ring-2 focus:ring-[#DE639A]"
              />
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#7F2982] hover:text-[#F7717D] transition"
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showpassword ?  <Eye size={20}/> : <EyeOff size={20}/> }
              </button>
            </div>
            {errors.password && (
              <p className="text-[#F7717D] text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          <div>
            <label className="text-sm font-semibold text-[#7F2982] block mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={confirmShowPassword ? "text" : "password"}
                placeholder="Confirm password"
                {...register("confirmPassword")}
                className="w-full border border-[#E0E0E0] rounded-xl px-4 py-2 text-base text-[#1E1E1E] placeholder:text-[#7F2982]/60 bg-[#F8F6FC] pr-16 focus:outline-none focus:ring-2 focus:ring-[#DE639A]"
              />
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#7F2982] hover:text-[#F7717D] transition"
                type="button"
                onClick={() => setConfirmShowPassword((prev) => !prev)}
              >
                {confirmShowPassword ? <Eye size={20}/> : <EyeOff size={20}/>}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-[#F7717D] text-xs mt-1">
                {errors?.confirmPassword?.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-[#F7717D] via-[#DE639A] to-[#7F2982] hover:from-[#DE639A] hover:to-[#F7717D] text-white font-bold rounded-xl py-2 shadow-md transition text-lg disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-base mt-8 text-[#7F2982] font-medium">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-[#F7717D] hover:underline font-bold"
          >
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
