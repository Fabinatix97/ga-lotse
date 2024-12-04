/**
 * Copyright 2024 cronn GmbH
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
          }),
        ),
    }),
  ),
  children: defineRoutes(dentalPath("/children"), (childrenPath) => ({
    overview: childrenPath("/"),
    byId: (childId: string) =>
      defineRoutes(childrenPath(`/${childId}`), (childPath) => ({
        details: childPath("/details"),
        examinations: childPath("/examinations"),
        progressEntries: defineRoutes(
          childPath("/progress-entries"),
          (progressEntriesPath) => ({
            overview: progressEntriesPath("/"),
            byId: (progressEntryId: string) =>
              progressEntriesPath(`/${progressEntryId}`),
          }),
        ),
      })),
  })),
}));
