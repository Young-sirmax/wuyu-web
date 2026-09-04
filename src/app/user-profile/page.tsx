"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Profile from "./profile";

export default function UserProfilePage() {
  return (
    <Suspense fallback={null}>
      <Inner />
    </Suspense>
  );
}

function Inner() {
  const params = useSearchParams();
  const openid = params.get("openid") || "";
  return <Profile openid={openid} />;
}
