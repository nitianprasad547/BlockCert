"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function InstituteLoginRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/login?role=INSTITUTE");
  }, [router]);

  return (
    <div className="py-24 text-center text-xs font-mono text-slate-400 flex items-center justify-center gap-2">
      <div className="h-4 w-4 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
      <span>Redirecting to Institute Sign In...</span>
    </div>
  );
}
