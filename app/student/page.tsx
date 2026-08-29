"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function StudentRootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/student/login");
  }, [router]);

  return (
    <div className="py-24 text-center text-xs font-mono text-slate-400 flex items-center justify-center gap-2">
      <div className="h-4 w-4 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
      <span>Redirecting to Student Credential Scorecard Portal...</span>
    </div>
  );
}
