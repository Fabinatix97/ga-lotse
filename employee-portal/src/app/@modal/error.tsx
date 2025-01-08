/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { NextErrorBoundaryProps } from "@eshg/lib-portal/components/boundaries/NextErrorBoundary";
import { useRouter } from "next/navigation";

import { EmployeePortalErrorModal } from "@/lib/shared/components/boundaries/EmployeePortalErrorModal";

export default function ModalSlotError(props: NextErrorBoundaryProps) {
  const router = useRouter();

  return (
    <EmployeePortalErrorModal
      error={props.error}
      digest={props.error.digest}
      onReset={props.reset}
      onClose={() => router.back()}
    />
  );
}
