/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { PortalErrorCode } from "@eshg/lib-portal/errorHandling/PortalErrorCode";
import { resolveError } from "@eshg/lib-portal/errorHandling/errorResolvers";

export function returnConflict(e: unknown) {
  const resolved = resolveError(e);
  if (resolved?.errorCode === PortalErrorCode.UnexpectedError) {
    return PortalErrorCode.Conflict;
  }
  throw e;
}
