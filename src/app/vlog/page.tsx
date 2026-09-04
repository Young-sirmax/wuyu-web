"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import VlogBody from "./body";

export default function VlogPage() {
  return (
    <Suspense fallback={null}>
      <Inner />
    </Suspense>
  );
}

function Inner() {
  const params = useSearchParams();
  const id = params.get("id") || "";
  return <VlogBody id={id} />;
}
