/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { defineRoutes } from "@eshg/lib-portal/universal";

export const routes = defineRoutes("/dental", (dentalPath) => ({
  index: dentalPath("/"),
  prophylaxisSessions: defineRoutes(
    dentalPath("/prophylaxis-sessions"),
    (prophylaxisSessionPath) => ({
      overview: prophylaxisSessionPath("/"),
      byId: (prophylaxisSessionId: string) =>
        defineRoutes(
          prophylaxisSessionPath(`/${prophylaxisSessionId}`),
          (prophylaxisSessionPath) => ({
            index: prophylaxisSessionPath("/"),
            details: prophylaxisSessionPath("/details"),
            examinations: defineRoutes(
              prophylaxisSessionPath("/examinations"),
              (prophylaxisSessionExaminationsPath) => ({
                index: prophylaxisSessionExaminationsPath("/"),
                byExaminationId: (examinationId: string) =>
                  prophylaxisSessionExaminationsPath(`/${examinationId}`),
              }),
            ),
          }),
        ),
    }),
  ),
  children: defineRoutes(dentalPath("/children"), (childrenPath) => ({
    overview: childrenPath("/"),
    schoolYearTransition: defineRoutes(
      childrenPath("/school-year-transition"),
      (schoolYearTransitionPath) => ({
        daycares: schoolYearTransitionPath("/daycares"),
        schools: schoolYearTransitionPath("/schools"),
        groups: (institutionId: string) =>
          schoolYearTransitionPath(`/groups/${institutionId}`),
        children: (institutionId: string) =>
          schoolYearTransitionPath(`/children/${institutionId}`),
      }),
    ),
    byId: (childId: string) =>
      defineRoutes(childrenPath(`/${childId}`), (childPath) => ({
        index: childPath("/"),
        details: childPath("/details"),
        syncPerson: (fileStateId: string, personVersion: number) =>
          childPath(`/sync-person/${fileStateId}/${personVersion}`),
        examinations: defineRoutes(
          childPath("/examinations"),
          (examinationsPath) => ({
            overview: examinationsPath("/"),
            byId: (examinationId: string) =>
              examinationsPath(`/${examinationId}`),
          }),
        ),
        progressEntries: childPath("/progress-entries"),
      })),
  })),
  procedureLabels: defineRoutes(
    dentalPath("/procedure-labels"),
    (procedureLabelsPath) => ({
      overview: procedureLabelsPath("/"),
    }),
  ),
}));
