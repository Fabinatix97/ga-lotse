/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiResource, ApiResourceType } from "@eshg/base-api";

export interface ResourceUpdateFormValues {
  id: ApiResource["id"];
  type: ApiResourceType;
  name: string;
  labelNames: string[];
  articleNumber: string;
  description: string;
}
