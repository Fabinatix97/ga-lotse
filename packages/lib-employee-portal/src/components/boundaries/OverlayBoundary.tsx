/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import {
  BaseOverlayBoundary,
  BaseOverlayBoundaryProps,
} from "@eshg/lib-portal/components/boundaries/BaseOverlayBoundary";

import { EmployeePortalErrorModal } from "./EmployeePortalErrorModal";

type OverlayBoundaryProps = Omit<
  BaseOverlayBoundaryProps,
  "fallbackErrorModal"
>;

export function OverlayBoundary(props: OverlayBoundaryProps) {
  return (
    <BaseOverlayBoundary
      fallbackErrorModal={EmployeePortalErrorModal}
      {...props}
    />
  );
}
