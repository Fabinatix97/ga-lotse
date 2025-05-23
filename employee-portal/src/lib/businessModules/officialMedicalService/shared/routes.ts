/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { defineRoutes } from "@eshg/lib-portal/universal";

export const routes = defineRoutes("/official-medical-service", (omsPath) => ({
  procedures: defineRoutes(omsPath("/procedures"), (proceduresPath) => ({
    index: proceduresPath("/"),
    byId: (procedureId: string) =>
      defineRoutes(proceduresPath(`/${procedureId}`), (procedurePath) => ({
        details: procedurePath("/details"),
        documents: procedurePath("/documents"),
        anamnesis: procedurePath("/anamnesis"),
        progressEntries: procedurePath("/progress-entries"),
        syncAffectedPerson: (fileStateId: string, personVersion: number) =>
          procedurePath(
            `/sync-affected-person/${fileStateId}/${personVersion}`,
          ),
        syncFacility: (fileStateId: string, facilityVersion: number) =>
          procedurePath(`/sync-facility/${fileStateId}/${facilityVersion}`),
      })),
  })),
  appointmentBlockGroups: defineRoutes(
    omsPath("/appointment-block-groups"),
    (appointmentBlockGroupsPath) => ({
      index: appointmentBlockGroupsPath("/"),
      new: appointmentBlockGroupsPath("/new"),
    }),
  ),
  waitingRoom: omsPath("/waiting-room"),
}));
