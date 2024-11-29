/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { defineRoutes } from "@eshg/lib-portal/helpers/routes";

export const routes = defineRoutes("/dental", (dentalPath) => ({
  prophylaxisSessions: dentalPath("/prophylaxis-sessions"),
  children: defineRoutes(dentalPath("/children"), (childrenPath) => ({
    overview: childrenPath("/"),
    byId: (childId: string) =>
      defineRoutes(childrenPath(`/${childId}`), (childrenPath) => ({
        details: childrenPath("/details"),
      })),
  })),
}));
