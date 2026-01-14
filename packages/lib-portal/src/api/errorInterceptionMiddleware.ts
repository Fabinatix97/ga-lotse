/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Middleware } from "@eshg/base-api";

import { PortalError } from "../errorHandling/PortalError";
import { PortalErrorCode } from "../errorHandling/PortalErrorCode";
import { resolveErrorResponse } from "../errorHandling/errorResolvers";

export const errorInterceptionMiddleware = {
  // intercept backend errors
  async post(context) {
    if (!context.response.ok) {
      throw await resolveErrorResponse(context.response);
    }
  },
  // intercept fetch errors
  async onError(context) {
    if (context.response === undefined) {
      const cause = resolveCause(context.error);
      throw new PortalError({
        errorCode: PortalErrorCode.UnexpectedError,
        message: `Failed to fetch ${context.url}${cause}`,
      });
    }
    return Promise.resolve();
  },
} satisfies Middleware;

function resolveCause(error: unknown) {
  return error instanceof Error && error.cause instanceof Error
    ? ` (${error.cause.message})`
    : "";
}
