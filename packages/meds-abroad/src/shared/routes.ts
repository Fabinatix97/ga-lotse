/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

const basePath = "/meds-abroad";
const proceduresPath = `${basePath}/procedures`;
//const appointmentBlockPath = `${basePath}/appointment-block-groups`;

export const routes = {
  procedures: {
    index: `${proceduresPath}`,
    byId: (procedureId: string) => ({
      details: `${proceduresPath}/${procedureId}/details`,
      progressEntries: `${proceduresPath}/${procedureId}/progress-entries`,
    }),
  },
} as const;
