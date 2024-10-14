/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

const basePath = "/medical-registry";
const proceduresPath = `${basePath}/procedures`;

export const routes = {
  procedures: {
    byId: (procedureId: string) => ({
      index: `${proceduresPath}/${procedureId}`,
    }),
  },
} as const;
