/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

const basePath = "/official-medical-service";
const proceduresPath = `${basePath}/procedures`;

export const routes = {
  procedures: {
    index: `${proceduresPath}`,
    byId: (procedureId: string) => ({
      index: `${proceduresPath}/${procedureId}`,
    }),
  },
} as const;
