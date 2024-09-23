/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiContactType } from "@eshg/employee-portal-api/base";

export const contactSearchParamNames = {
  name: "name",
  type: "type",
  category: "category",
} as const;

export const contactDiscriminatorToEnum = {
  PersonContact: ApiContactType.Person,
  InstitutionContact: ApiContactType.Institution,
} as const;
