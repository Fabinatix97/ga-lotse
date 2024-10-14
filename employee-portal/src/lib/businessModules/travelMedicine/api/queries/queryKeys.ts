/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryKeyFactory } from "@eshg/lib-portal/api/queryKeyFactory";

const apiQueryKey = queryKeyFactory(["travelMedicine"]);

export const appointmentBlockApiQueryKey = queryKeyFactory(
  apiQueryKey(["appointmentBlockApi"]),
);

export const appointmentTypesApiQueryKey = queryKeyFactory(
  apiQueryKey(["appointmentTypesApi"]),
);

export const informationStatementTemplateApiQueryKey = queryKeyFactory(
  apiQueryKey(["informationStatementTemplateApi"]),
);

export const diseaseApiQueryKey = queryKeyFactory(apiQueryKey(["diseaseApi"]));

export const medicalHistoryTemplateApiQueryKey = queryKeyFactory(
  apiQueryKey(["medicalHistoryTemplateApi"]),
);

export const otherServiceTemplatesApiQueryKey = queryKeyFactory(
  apiQueryKey(["otherServiceTemplatesApi"]),
);

export const vaccinationConsultationApiQueryKey = queryKeyFactory(
  apiQueryKey(["vaccinationConsultationApi"]),
);

export const vaccineApiQueryKey = queryKeyFactory(apiQueryKey(["vaccineApi"]));

export const unusedBaseInventoryVaccineApiQueryKey = queryKeyFactory(
  apiQueryKey(["unusedBaseInventoryVaccineApi"]),
);

export const appointmentStaffApiQueryKey = queryKeyFactory(
  apiQueryKey(["appointmentStaffApi"]),
);

export const inboxProcedureApiQueryKey = queryKeyFactory(
  apiQueryKey(["inboxProcedureApi"]),
);

export const procedureStepsApiQueryKey = queryKeyFactory(
  apiQueryKey(["procedureStepApi"]),
);

export const progressEntryApiQueryKey = queryKeyFactory(
  apiQueryKey(["progressEntryApi"]),
);

export const fileApiQueryKey = queryKeyFactory(apiQueryKey(["fileApi"]));

export const travelMedicineFeatureTogglesPublicApiQueryKey = queryKeyFactory(
  apiQueryKey(["travelMedicineFeatureTogglesPublicApi"]),
);

export const editorApiQueryKey = queryKeyFactory(apiQueryKey(["editorApi"]));

export const archivingApiQueryKey = queryKeyFactory(
  apiQueryKey(["archivingApi"]),
);
