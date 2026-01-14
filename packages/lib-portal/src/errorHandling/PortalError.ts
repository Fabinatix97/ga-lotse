/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiErrorCode } from "@eshg/base-api";

import { PortalErrorCode } from "./PortalErrorCode";

interface PortalErrorParams {
  errorCode: PortalErrorCode;
  message: string;
  originalErrorCode?: ApiErrorCode;
  cause?: unknown;
}

export class PortalError extends Error {
  readonly errorCode: PortalErrorCode;
  readonly originalErrorCode?: ApiErrorCode;

  constructor(params: PortalErrorParams) {
    super(params.message);
    this.errorCode = params.errorCode;
    this.originalErrorCode = params.originalErrorCode;
    this.cause = params.cause;
  }
}
