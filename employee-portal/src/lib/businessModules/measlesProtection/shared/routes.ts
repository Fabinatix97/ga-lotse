/**
 * Copyright 2024 cronn GmbH
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
      progressEntries: {
        index: `${proceduresPath}/${procedureId}/progress-entries`,
        details: (entryId: string) =>
          `${proceduresPath}/${procedureId}/progress-entries/${entryId}/details`,
      },
    }),
    draft: (procedureId: string) => `${proceduresPath}/draft/${procedureId}`,
  },
  appointmentBlockGroups: {
    index: `${appointmentBlockPath}`,
    new: `${appointmentBlockPath}/new`,
  },
  inbox: {
    index: inboxPath,
    details: (inboxProcedureId: string) =>
      `${inboxPath}/${inboxProcedureId}/details`,
  },
} as const;
