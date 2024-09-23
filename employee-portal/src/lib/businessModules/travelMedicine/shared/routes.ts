/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiAppointmentType } from "@eshg/employee-portal-api/travelMedicine";

const basePath = "/travel-medicine";
const informationStatementTemplatesPath = `${basePath}/information-statement-templates`;
const medicalHistoryTemplatesPath = `${basePath}/medical-history-templates`;
const proceduresPath = `${basePath}/procedure`;
const proceduresSearchPath = `${basePath}/search-procedure`;
const vaccinesPath = `${basePath}/vaccines`;
const diseasesPath = `${basePath}/diseases`;
const appointmentBlockPath = `${basePath}/appointment-block-groups`;
const appointmentTypesPath = `${basePath}/appointment-definition`;
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
    new: `${proceduresPath}/new`,
    details: (procedureId: string) => `${proceduresPath}/${procedureId}`,
    baseData: (procedureId: string) =>
      `${proceduresPath}/${procedureId}/base-data`,
    medicalHistories: (procedureId: string, procedureStepId?: string) =>
      procedureStepId
        ? `${proceduresPath}/${procedureId}/medical-histories?medical-history=${procedureStepId}`
        : `${proceduresPath}/${procedureId}/medical-histories`,
    certificates: (procedureId: string) =>
      `${proceduresPath}/${procedureId}/certificates`,
    downloadFile: (fileId: string) =>
      `${proceduresPath}/download-file/${fileId}`,
    progressEntries: (procedureId: string) => ({
      index: `${routes.procedures.details(procedureId)}/progress-entries`,
      details: (entryId: string) =>
        `${routes.procedures.progressEntries(procedureId).index}/${entryId}/details`,
    }),
    bookAppointment: (
      procedureId: string,
      stepId: string,
      appointmentType: ApiAppointmentType,
    ) =>
      `${routes.procedures.details(procedureId)}/${stepId}/${appointmentType}/book-appointment`,
    vaccinations: (id: string, stepId: string) =>
      `${routes.procedures.details(id)}/procedure-step/${stepId}/vaccinations`,
    otherServices: (id: string, stepId: string) =>
      `${routes.procedures.details(id)}/procedure-step/${stepId}/other-services`,
    medicalHistory: {
      details: (medicalHistoryId: string) =>
        `${proceduresPath}/medical-history/${medicalHistoryId}`,
    },
  },
  proceduresSearch: { index: `${proceduresSearchPath}` },
  appointmentTypes: {
    index: `${appointmentTypesPath}`,
  },
  vaccines: {
    index: `${vaccinesPath}`,
  },
  diseases: {
    index: `${diseasesPath}`,
  },
  appointmentBlockGroups: {
    index: `${appointmentBlockPath}`,
    new: `${appointmentBlockPath}/new`,
    details: (appointmentId: string) =>
      `${appointmentBlockPath}/${appointmentId}`,
  },
  otherServiceTemplates: {
    index: `${otherServicesTemplatesPath}`,
  },
  inbox: {
    index: `${inboxPath}`,
    details: (inboxProcedureId: string) =>
      `${inboxPath}/${inboxProcedureId}/details`,
  },
} as const;
