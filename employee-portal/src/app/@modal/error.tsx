/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { NextErrorBoundaryProps } from "@eshg/lib-portal/components/boundaries/NextErrorBoundary";
import { useRouter } from "next/navigation";

import { ErrorModal } from "@/lib/shared/components/boundaries/ErrorModal";

export default function ModalSlotError(props: NextErrorBoundaryProps) {
  const router = useRouter();

  return (
    <ErrorModal
      error={props.error}
      digest={props.error.digest}
      onReset={props.reset}
      onClose={() => router.back()}
    />
  );
}
