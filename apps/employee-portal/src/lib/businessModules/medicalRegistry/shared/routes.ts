/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

const basePath = "/medical-registry";
const proceduresPath = `${basePath}/procedures`;
const proceduresSearchPath = `${basePath}/search`;
const proceduresCreatePath = `${proceduresPath}/create`;

export const routes = {
  procedures: {
    index: `${proceduresPath}`,
    byId: (procedureId: string) => ({
      index: `${proceduresPath}/${procedureId}`,
      details: `${proceduresPath}/${procedureId}/details`,
      progressEntries: `${proceduresPath}/${procedureId}/progress-entries`,
    }),
    create: `${proceduresCreatePath}`,
  },
  proceduresSearch: { index: `${proceduresSearchPath}` },
} as const;
