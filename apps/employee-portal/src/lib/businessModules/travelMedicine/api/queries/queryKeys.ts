/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryKeyFactory } from "@eshg/lib-portal";

export const apiQueryKey = queryKeyFactory(["travelMedicine"]);

export const appointmentBlockApiQueryKey = queryKeyFactory(
  apiQueryKey(["appointmentBlockApi"]),
);

export const appointmentStandardDurationApiQueryKey = queryKeyFactory(
  apiQueryKey(["appointmentStandardDurationApi"]),
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

export const procedureStepsApiQueryKey = queryKeyFactory(
  apiQueryKey(["procedureStepApi"]),
);
