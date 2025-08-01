/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ConfiguratorEndpointName } from "@/lib/configurator/shared/types";

// display only those pages which have an actual effect on the application.
// Note: There's no citizen page, but the report generator is using dep't info.
// INSPECTION: the only property there is currently FacilityFileNumberMethod
// which is special and not meant to be configured.
export const inspectionConfigRouterEndpoints: ConfiguratorEndpointName[] = [
  "DEPARTMENT_INFO",
];
