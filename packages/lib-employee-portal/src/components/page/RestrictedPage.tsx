/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { ApiUserRole } from "@eshg/base-api";
import { Alert, RequiresChildren } from "@eshg/lib-portal";

import { useHasUserRoleCheck } from "../../features/auth/hooks/useAccessControl";

export function RestrictedPage(
  props: Readonly<{ requiredUserRole: ApiUserRole } & RequiresChildren>,
) {
  const userHasRights = useHasUserRoleCheck(props.requiredUserRole);

  if (userHasRights) {
    return props.children;
  }

  return (
    <Alert
      color="primary"
      title="Keine Berechtigungen"
      message="Sie verfügen derzeit nicht über die erforderlichen Berechtigungen, um diese Seite abzurufen."
    />
  );
}
