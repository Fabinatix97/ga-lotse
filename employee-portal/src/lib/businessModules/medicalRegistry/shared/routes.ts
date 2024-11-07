/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

const basePath = "/medical-registry";
const proceduresPath = `${basePath}/procedures`;
const proceduresSearchPath = `${basePath}/search-procedure`;

export const routes = {
  procedures: {
    index: `${proceduresPath}`,
    byId: (procedureId: string) => ({
      index: `${proceduresPath}/${procedureId}`,
      details: `${proceduresPath}/${procedureId}/details`,
    }),
  },
  proceduresSearch: { index: `${proceduresSearchPath}` },
} as const;
