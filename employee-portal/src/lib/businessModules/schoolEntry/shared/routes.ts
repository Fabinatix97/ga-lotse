/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { defineRoutes } from "@eshg/lib-portal/helpers/routes";

export const routes = defineRoutes("/school-entry", (schoolEntryPath) => ({
  procedures: defineRoutes(
    schoolEntryPath("/procedures"),
    (proceduresPath) => ({
      overview: proceduresPath("/"),
      byId: (procedureId: string) =>
        defineRoutes(proceduresPath(`/${procedureId}`), (procedurePath) => ({
          details: procedurePath("/details"),
          syncPerson: (fileStateId: string, personVersion: number) =>
            procedurePath(`/sync-person/${fileStateId}/${personVersion}`),
          examinations: defineRoutes(
            procedurePath("/examinations"),
            (examinationsPath) => ({
              index: examinationsPath("/"),
              ear: examinationsPath("/ear"),
              eye: examinationsPath("/eye"),
              sopess: examinationsPath("/sopess"),
              developmentScreening: examinationsPath("/development-screening"),
            }),
          ),
          vaccination: procedurePath("/vaccination"),
          anamnesis: procedurePath("/anamnesis"),
          progressEntries: procedurePath("/progress-entries"),
        })),
    }),
  ),
  waitingRoom: schoolEntryPath("/waiting-room"),
  appointmentBlockGroups: defineRoutes(
    schoolEntryPath("/appointment-block-groups"),
    (appointmentBlockGroupsPath) => ({
      overview: appointmentBlockGroupsPath("/"),
      new: appointmentBlockGroupsPath("/new"),
    }),
  ),
  inbox: defineRoutes(schoolEntryPath("/inbox"), (inboxPath) => ({
    overview: inboxPath("/"),
  })),
  labels: defineRoutes(schoolEntryPath("/labels"), (labelsPath) => ({
    overview: labelsPath("/"),
  })),
}));
