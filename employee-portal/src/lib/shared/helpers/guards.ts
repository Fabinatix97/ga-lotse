/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiBusinessModule } from "@eshg/employee-portal-api/businessProcedures";

export function isInteger(value: unknown): value is number {
  return Number.isInteger(value);
}

const businessModuleNames: string[] = Object.values(ApiBusinessModule);

export function isBusinessModule(
  businessModule: string,
): businessModule is ApiBusinessModule {
  return businessModuleNames.includes(businessModule);
}
