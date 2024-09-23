/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiGetCountryCodesResponse } from "@eshg/employee-portal-api/schoolEntry";

export type CountryCodes = Record<string, number>;

export function mapCountryCodes(
  response: ApiGetCountryCodesResponse,
): CountryCodes {
  return response.countryCodes;
}
