"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import PartyDetail from "./detail";

export default function PartyDetailPage() {
  return (
    <Suspense fallback={null}>
      <Inner />
    </Suspense>
  );
}

function Inner() {
  const params = useSearchParams();
  const id = params.get("id") || "";
  return <PartyDetail id={id} />;
}
