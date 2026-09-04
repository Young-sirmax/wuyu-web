"use client";

import { Suspense } from "react";
import AppointmentDetailBody from "./body";

export default function AppointmentDetailPage() {
  return (
    <Suspense fallback={null}>
      <AppointmentDetailBody />
    </Suspense>
  );
}
