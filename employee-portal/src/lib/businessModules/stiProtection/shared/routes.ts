/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

const basePath = "/sti-protection";
const proceduresPath = `${basePath}/procedures`;
const appointmentBlockPath = `${basePath}/appointment-block-groups`;

export const routes = {
  procedures: {
    index: `${proceduresPath}`,
    byId: (procedureId: string) => ({
      index: `${proceduresPath}/${procedureId}`,
      details: `${proceduresPath}/${procedureId}/details`,
      anamnesis: `${proceduresPath}/${procedureId}/anamnesis`,
      examination: `${proceduresPath}/${procedureId}/examination`,
      report: `${proceduresPath}/${procedureId}/report`,
      progressEntries: {
        index: `${proceduresPath}/${procedureId}/progress-entries`,
        byId: (entryId: string) =>
          `${proceduresPath}/${procedureId}/progress-entries/${entryId}/details`,
      },
    }),
  },
  appointmentBlockGroups: {
    index: `${appointmentBlockPath}`,
    new: `${appointmentBlockPath}/new`,
  },
} as const;
