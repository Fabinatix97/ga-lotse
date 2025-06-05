/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiGetCountryCodesResponse } from "@eshg/school-entry-api";

export type CountryCodes = Record<string, number>;

export function mapCountryCodes(
  response: ApiGetCountryCodesResponse,
): CountryCodes {
  return response.countryCodes;
}
