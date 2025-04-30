"use client";
import Input from "@/components/Shared/ui/Input";
import useFetch from "@/lib/fetch";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const router = usePathname();
  const id = router.split("/").pop();

  const [pass1, setPass1] = useState("");
  const [pass2, setPass2] = useState("");
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await useFetch.post(`/auth/reset-password`, {
        token: id,
        newPassword: pass1,
      });
      if (res.ok) {
        setStatus("success");
      } else {
        const data = await res.json();
        setErrorMsg(data.message || "Something went wrong.");
        setStatus("error");
      }
    } catch (err) {
      setErrorMsg("Network error.");
      setStatus("error");
      console.error(err);
    }
  };
  if (status === "success") {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen ">
            <div className="bg-white rounded-xl  p-8 max-w-md w-full text-center">
                <h1 className="text-2xl font-bold text-start mb-2">Your Password is Reset</h1>
                <p className="text-gray-600 text-start text-sm">You can now Login to your account</p>
                <Link href="/"
                    type="submit"
                    className={` py-2.5 px-6 rounded-sm block text-white w-full mt-4 bg-black transition  shadow-md text-sm`}
                >Continue</Link>
            </div>
        </div>
    );
}
  return (
    <div className="flex flex-col items-center justify-center min-h-screen ">
      <div className="bg-white rounded-xl  p-8 max-w-md w-full">
        <div className="flex flex-col mb-4">
          <h1 className="text-2xl font-bold text-black mb-1">Reset Password</h1>
          <p className="text-[12px]">
            Enter your email to receive a password reset link.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <Input
            type="password"
            value={pass1}
            onChange={setPass1}
            placeholder="Your new password"
            className="min-w-full"
          />
          <Input
            type="password"
            value={pass2}
            onChange={setPass2}
            placeholder="Repeat your new password"
            passwordStrength={false}
            className="min-w-full"
          />
          <button
            type="submit"
            disabled={
              status === "loading" || pass1 !== pass2 || pass1.length < 8
            }
            className={` py-2.5 px-6 rounded-sm  text-white disabled:bg-neutral-700 bg-black transition disabled:opacity-60 disabled:cursor-not-allowed shadow-md text-sm`}
          >
            {status === "loading" ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  ></path>
                </svg>
                Sending...
              </span>
            ) : (
              "Continue"
            )}
          </button>
        </form>
        {status === "error" && (
          <p className="mt-4 text-red-600 text-center animate-pulse">
            {errorMsg}
          </p>
        )}
      </div>
    </div>
  );
}
