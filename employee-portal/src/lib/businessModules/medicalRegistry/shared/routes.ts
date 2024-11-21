/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

const basePath = "/medical-registry";
const proceduresPath = `${basePath}/procedures`;
const proceduresSearchPath = `${basePath}/search-procedure`;
const proceduresCreatePath = `${proceduresPath}/create`;

export const routes = {
  procedures: {
    index: `${proceduresPath}`,
    byId: (procedureId: string) => ({
      index: `${proceduresPath}/${procedureId}`,
      details: `${proceduresPath}/${procedureId}/details`,
      progressEntries: {
        index: `${proceduresPath}/${procedureId}/progress-entries`,
        byId: (progressEntryId: string) => ({
          details: `${proceduresPath}/${procedureId}/progress-entries/${progressEntryId}/details`,
        }),
      },
    }),
    create: `${proceduresCreatePath}`,
  },
  proceduresSearch: { index: `${proceduresSearchPath}` },
} as const;
