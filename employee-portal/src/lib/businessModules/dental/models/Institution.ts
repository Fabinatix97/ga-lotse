/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiInstitution } from "@eshg/employee-portal-api/dental";

export interface Institution {
  readonly id: string;
  readonly name: string;
}

export function mapInstitution(response: ApiInstitution): Institution {
  return {
    id: response.id,
    name: response.name,
  };
}
