/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

const basePath = "/configuration";

export const routes = {
  baseModule: {
    index: `${basePath}/base-module`,
  },
  schoolEntry: {
    index: `${basePath}/school-entry`,
  },
  travelMedicine: {
    index: `${basePath}/travel-medicine`,
  },
  measlesProtection: {
    index: `${basePath}/measles-protection`,
  },
  medicalRegistry: {
    index: `${basePath}/medical-registry`,
  },
  stiProtection: {
    index: `${basePath}/sti-protection`,
  },
  sexWork: {
    index: `${basePath}/sexwork`,
  },
} as const;
