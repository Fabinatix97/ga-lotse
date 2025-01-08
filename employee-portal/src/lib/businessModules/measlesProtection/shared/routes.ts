/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

const basePath = "/measles-protection";
const proceduresPath = `${basePath}/procedures`;
const appointmentBlockPath = `${basePath}/appointment-block-groups`;
const inboxPath = `${basePath}/inbox`;

export const routes = {
  procedures: {
    index: `${proceduresPath}`,
    details: (procedureId: string) => ({
      index: `${proceduresPath}/${procedureId}`,
      proof: `${proceduresPath}/${procedureId}/proof`,
      progressEntries: `${proceduresPath}/${procedureId}/progress-entries`,
    }),
    draft: (procedureId: string) => `${proceduresPath}/draft/${procedureId}`,
  },
  appointmentBlockGroups: {
    index: `${appointmentBlockPath}`,
    new: `${appointmentBlockPath}/new`,
  },
  inbox: {
    index: inboxPath,
  },
} as const;
