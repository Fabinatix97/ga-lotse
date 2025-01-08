/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { defineRoutes } from "@eshg/lib-portal/helpers/routes";

export const routes = defineRoutes("/official-medical-service", (omsPath) => ({
  procedures: defineRoutes(omsPath("/procedures"), (proceduresPath) => ({
    index: proceduresPath("/"),
    byId: (procedureId: string) =>
      defineRoutes(proceduresPath(`/${procedureId}`), (procedurePath) => ({
        details: procedurePath("/details"),
        progressEntries: procedurePath("/progress-entries"),
      })),
  })),
  appointmentBlockGroups: defineRoutes(
    omsPath("/appointment-block-groups"),
    (appointmentBlockGroupsPath) => ({
      index: appointmentBlockGroupsPath("/"),
      new: appointmentBlockGroupsPath("/new"),
    }),
  ),
}));
