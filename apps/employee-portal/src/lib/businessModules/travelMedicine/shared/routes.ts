/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

const basePath = "/travel-medicine";
const informationStatementTemplatesPath = `${basePath}/information-statement-templates`;
const medicalHistoryTemplatesPath = `${basePath}/medical-history-templates`;
const proceduresPath = `${basePath}/procedure`;
const proceduresSearchPath = `${basePath}/search-procedure`;
const vaccinesPath = `${basePath}/vaccines`;
const diseasesPath = `${basePath}/diseases`;
const appointmentBlockPath = `${basePath}/appointment-block-groups`;
const otherServicesTemplatesPath = `${basePath}/other-services`;
const inboxPath = `${basePath}/inbox`;

export const routes = {
  index: `${basePath}`,
  informationStatementTemplates: {
    index: `${informationStatementTemplatesPath}`,
    new: `${informationStatementTemplatesPath}/new`,
    details: (templateId: string) =>
      `${informationStatementTemplatesPath}/${templateId}`,
  },
  medicalHistoryTemplates: {
    index: `${medicalHistoryTemplatesPath}`,
    new: `${medicalHistoryTemplatesPath}/new`,
    details: (templateId: string) =>
      `${medicalHistoryTemplatesPath}/${templateId}`,
  },
  procedures: {
    index: `${proceduresPath}`,
    baseData: (procedureId: string) =>
      `${proceduresPath}/${procedureId}/base-data`,
    medicalHistories: (procedureId: string, procedureStepId?: string) =>
      procedureStepId
        ? `${proceduresPath}/${procedureId}/medical-histories?medical-history=${procedureStepId}`
        : `${proceduresPath}/${procedureId}/medical-histories`,
    informationStatements: (procedureId: string) =>
      `${proceduresPath}/${procedureId}/information-statements`,
    certificates: (procedureId: string) =>
      `${proceduresPath}/${procedureId}/certificates`,
    downloadFile: (fileId: string) =>
      `${proceduresPath}/download-file/${fileId}`,
    progressEntries: (procedureId: string) =>
      `${proceduresPath}/${procedureId}/progress-entries`,
    syncPerson: (
      procedureId: string,
      fileStateId: string,
      personVersion: number,
    ) =>
      `${proceduresPath}/${procedureId}/sync-person/${fileStateId}/${personVersion}`,
  },
  proceduresSearch: { index: `${proceduresSearchPath}` },
  vaccines: {
    index: `${vaccinesPath}`,
  },
  diseases: {
    index: `${diseasesPath}`,
  },
  appointmentBlockGroups: {
    index: `${appointmentBlockPath}`,
    new: `${appointmentBlockPath}/new`,
  },
  otherServiceTemplates: {
    index: `${otherServicesTemplatesPath}`,
  },
  inbox: {
    index: `${inboxPath}`,
  },
} as const;
