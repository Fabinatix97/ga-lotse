/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

const basePath = "/sti-protection";
const proceduresPath = `${basePath}/procedures`;
const waitingRoomPath = `${basePath}/waiting-room`;
const appointmentBlockPath = `${basePath}/appointment-block-groups`;

export const routes = {
  appointmentDefinition: `${basePath}/appointment-definition`,
  procedures: {
    index: `${proceduresPath}`,
    byId: (procedureId: string) => ({
      index: `${proceduresPath}/${procedureId}`,
      details: `${proceduresPath}/${procedureId}/details`,
      consultation: `${proceduresPath}/${procedureId}/consultation`,
      anamnesis: `${proceduresPath}/${procedureId}/anamnesis`,
      examination: `${proceduresPath}/${procedureId}/examination`,
      rapidTest: `${proceduresPath}/${procedureId}/examination/rapid-test`,
      laboratoryTest: `${proceduresPath}/${procedureId}/examination/laboratory-test`,
      report: `${proceduresPath}/${procedureId}/report`,
      progressEntries: `${proceduresPath}/${procedureId}/progress-entries`,
    }),
  },
  waitingRoom: {
    index: waitingRoomPath,
  },
  appointmentBlockGroups: {
    index: `${appointmentBlockPath}`,
    new: `${appointmentBlockPath}/new`,
  },
} as const;
