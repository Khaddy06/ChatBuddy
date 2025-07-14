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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
        <div className="text-center mb-8">
          <div className="text-3xl font-bold text-blue-600">ChatBuddy</div>
          <p className="text-gray-500 text-sm mt-2">
            Welcome! Please create an account.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="text-lg font-medium text-[#1A1A1A] block mb-1">
              Name
            </label>
            <input
              type="name"
              placeholder="enter your name"
              {...register("name")}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm 
              text-black  placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.name && (
              <p className="text-red-600 text-xs mt-1">
                {errors?.name?.message}
              </p>
            )}
          </div>
          <div>
            <label className="text-lg font-medium text-[#1A1A1A] block mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              {...register("email")}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm 
              text-black  placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.email && (
              <p className="text-red-600 text-xs mt-1">
                {errors?.email?.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-lg font-medium text-[#1A1A1A] block mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showpassword ? "text" : "password"}
                placeholder="enter password"
                {...register("password")}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 
                text-black  placeholder:text-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-blue-600"
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showpassword ?  <Eye size={18}/>:<EyeOff size={18}/> }
              </button>
            </div>
            {errors.password && (
              <p className="text-red-600 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          <label className="text-lg font-medium text-[#1A1A1A] block mb-1">
            Confirm Password
          </label>
          <div>
            <div className="relative">
              <input
                type={confirmShowPassword ? "text" : "password"}
                placeholder="confirm password"
                {...register("confirmPassword")}
                className="w-full border border-gray-300 rounded-lg 
                 text-black  placeholder:text-gray-500 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-blue-600"
                type="button"
                onClick={() => setConfirmShowPassword((prev) => !prev)}
              >
                {confirmShowPassword ? <Eye size={18}/>:<EyeOff size={18}/>}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-600 text-xs mt-1">
                {errors?.confirmPassword?.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white 
            font-semibold rounded-lg py-2 transition"
          >
            {isSubmitting ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-sm mt-6 text-gray-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-blue-600 hover:underline font-medium"
          >
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
