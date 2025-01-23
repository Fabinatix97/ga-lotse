/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiChildSearchResult, ApiGender } from "@eshg/dental-api";

export interface ChildSearchResult {
  readonly id: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly dateOfBirth: Date;
  readonly groupName: string;
  readonly gender?: ApiGender;
}

export function mapChildSearchResult(
  response: ApiChildSearchResult,
): ChildSearchResult {
  return {
    ...response,
  };
}
