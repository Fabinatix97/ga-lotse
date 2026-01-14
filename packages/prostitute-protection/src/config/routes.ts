/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { defineRoutes } from "@eshg/lib-portal/universal";

const basePath = "/prostitute-protection";
const proceduresRoute = "/procedures";
const searchPersonRoute = "/person-search";

export const routes = defineRoutes(basePath, (prostituteProtectionPath) => ({
  procedures: defineRoutes(
    prostituteProtectionPath(proceduresRoute),
    (proceduresPath) => ({
      index: proceduresPath("/"),
      byId: (procedureId: string) =>
        defineRoutes(proceduresPath(`/${procedureId}`), (procedurePath) => ({
          details: procedurePath("/details"),
          progressEntries: procedurePath("/progress-entries"),
          consultation: procedurePath("/consultation"),
          certificates: procedurePath("/certificates"),
        })),
    }),
  ),
  searchPerson: defineRoutes(
    prostituteProtectionPath(searchPersonRoute),
    (searchPersonPath) => ({
      index: searchPersonPath("/"),
    }),
  ),
  appointmentBlockGroups: defineRoutes(
    prostituteProtectionPath("/appointment-block-groups"),
    (appointmentBlockGroupsPath) => ({
      index: appointmentBlockGroupsPath("/"),
      new: appointmentBlockGroupsPath("/new"),
    }),
  ),
  waitingRoom: prostituteProtectionPath("/waiting-room"),
}));
