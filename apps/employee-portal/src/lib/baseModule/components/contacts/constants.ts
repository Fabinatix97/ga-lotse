/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiContactType } from "@eshg/base-api";

export const contactSearchParamNames = {
  name: "name",
  type: "type",
  categories: "categories",
} as const;

export const contactDiscriminatorToEnum = {
  PersonContact: ApiContactType.Person,
  InstitutionContact: ApiContactType.Institution,
} as const;
