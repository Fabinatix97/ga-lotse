/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import {
  BaseErrorModal,
  ErrorModalProps,
} from "@eshg/lib-portal/components/boundaries/BaseErrorModal";

export function EmployeePortalErrorModal({
  title,
  ...props
}: Readonly<ErrorModalProps>) {
  return <BaseErrorModal title={title ?? "Fehler beim Laden"} {...props} />;
}
