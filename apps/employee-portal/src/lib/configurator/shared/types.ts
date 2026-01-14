/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiBusinessModule } from "@eshg/base-api";

// eslint-disable-next-line unused-imports/no-unused-vars
const { Dental, ...ConfigApiBusinessModule } = ApiBusinessModule;

export const ConfiguratorModuleName = {
  ...ConfigApiBusinessModule,
  base: "BASE",
  openData: "OPEN_DATA",
  sexWork: "SEX_WORK",
} as const;

export type ConfiguratorModuleName =
  (typeof ConfiguratorModuleName)[keyof typeof ConfiguratorModuleName];

export type ConfiguratorEndpointName =
  | "ACKNOWLEDGEMENTS_MARKDOWNS_CONFIG"
  | "CONTACT_MARKDOWNS_CONFIG"
  | "DEPARTMENT_INFO"
  | "IMPRINT_MARKDOWNS_CONFIG"
  | "OPENING_HOURS"
  | "SCHOOL_ENTRY"
  | "NOTIFICATION"
  | "PRIVACY_NOTICE"
  | "MEDS_ABROAD"
  | "ACCESSIBILITY_STATEMENT_MARKDOWNS_CONFIG"
  | "PRIVACY_POLICY_MARKDOWNS_CONFIG"
  | "PRIVACY_POLICY"
  | "APPOINTMENT_STANDARD_DURATION"
  | "APPOINTMENT_BLOCK_AVAILABILITY"
  | "OFFICIAL_MEDICAL_SERVICE"
  | "OPEN_DATA"
  | "LOGO_CONFIG"
  | "ADDRESS_REGISTRY"
  | "INSPECTION"
  | "PROSTITUTE_PROTECTION";
