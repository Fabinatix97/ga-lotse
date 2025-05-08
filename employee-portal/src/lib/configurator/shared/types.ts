/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiBusinessModule } from "@eshg/base-api";

// eslint-disable-next-line unused-imports/no-unused-vars
const { Inspection, Dental, ...ConfigApiBusinessModule } = ApiBusinessModule;
export const ConfiguratorModuleName = {
  ...ConfigApiBusinessModule,
  base: "BASE",
  openDdata: "OPEN_DATA",
  sexWork: "SEX_WORK",
} as const;

export type ConfiguratorModuleName =
  (typeof ConfiguratorModuleName)[keyof typeof ConfiguratorModuleName];

export type ConfiguratorEndpointName = "DEPARTMENT_INFO" | "OPENING_HOURS";
