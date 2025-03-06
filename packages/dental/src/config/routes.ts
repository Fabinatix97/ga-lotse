/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { defineRoutes } from "@eshg/lib-portal/helpers/routes";

export const routes = defineRoutes("/dental", (dentalPath) => ({
  prophylaxisSessions: defineRoutes(
    dentalPath("/prophylaxis-sessions"),
    (prophylaxisSessionPath) => ({
      overview: prophylaxisSessionPath("/"),
      byId: (prophylaxisSessionId: string) =>
        defineRoutes(
          prophylaxisSessionPath(`/${prophylaxisSessionId}`),
          (prophylaxisSessionPath) => ({
            details: prophylaxisSessionPath("/details"),
            examinations: defineRoutes(
              prophylaxisSessionPath("/examinations"),
              (prophylaxisSessionExaminationsPath) => ({
                byIndex: (participantIndex: number) =>
                  prophylaxisSessionExaminationsPath(`/${participantIndex}`),
              }),
            ),
          }),
        ),
    }),
  ),
  children: defineRoutes(dentalPath("/children"), (childrenPath) => ({
    overview: childrenPath("/"),
    byId: (childId: string) =>
      defineRoutes(childrenPath(`/${childId}`), (childPath) => ({
        details: childPath("/details"),
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
}));
