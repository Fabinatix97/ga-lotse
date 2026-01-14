/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { defineRoutes } from "@eshg/lib-portal/universal";

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
              infoLetter: examinationsPath("/info-letter"),
            }),
          ),
          vaccination: procedurePath("/vaccination"),
          anamnesis: procedurePath("/anamnesis"),
          progressEntries: procedurePath("/progress-entries"),
        })),
    }),
  ),
  waitingRoom: schoolEntryPath("/waiting-room"),
  appointments: defineRoutes(
    schoolEntryPath("/appointments"),
    (appointmentsPath) => ({
      overview: appointmentsPath("/"),
      appointmentBlockGroups: defineRoutes(
        appointmentsPath("/appointment-block-groups"),
        (appointmentBlockGroupsPath) => ({
          overview: appointmentBlockGroupsPath("/"),
          new: appointmentBlockGroupsPath("/new"),
        }),
      ),
    }),
  ),
  inbox: defineRoutes(schoolEntryPath("/inbox"), (inboxPath) => ({
    overview: inboxPath("/"),
  })),
  procedureLabels: defineRoutes(
    schoolEntryPath("/procedure-labels"),
    (labelsPath) => ({
      overview: labelsPath("/"),
    }),
  ),
}));
