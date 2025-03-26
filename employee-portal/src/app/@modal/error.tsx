/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { EmployeePortalErrorModal } from "@eshg/lib-employee-portal";
import { NextErrorBoundaryProps } from "@eshg/lib-portal/components/boundaries/NextErrorBoundary";
import { useRouter } from "next/navigation";

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
