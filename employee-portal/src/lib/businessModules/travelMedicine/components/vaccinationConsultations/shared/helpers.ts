/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiAppointmentSummary,
  ApiDisease,
  ApiInformationStatementTemplate,
  ApiServiceStatus,
  ApiUser,
  ApiVaccine,
} from "@eshg/employee-portal-api/travelMedicine";
import { SelectOption } from "@eshg/lib-portal/components/formFields/SelectOptions";
import { formatDateTime } from "@eshg/lib-portal/formatters/dateTime";
import { isEmpty, isNonNullish } from "remeda";

import { AppointmentSummary } from "@/lib/businessModules/travelMedicine/api/models/AppointmentSummary";
import { OtherServicesTemplates } from "@/lib/businessModules/travelMedicine/api/models/OtherServicesTemplates";
import { fullName } from "@/lib/shared/components/users/userFormatter";

export function createDiseaseOptions(allDiseases: ApiDisease[] | undefined) {
  if (allDiseases) {
    const options: SelectOption[] = allDiseases.map((disease, idx) => ({
      label: disease.name,
      value: disease.id + "," + idx,
    }));

    return options;
  } else {
    return [];
  }
}

export function createVaccinesOptions(
  allVaccines: ApiVaccine[] | undefined,
  diseaseOptions: SelectOption[],
) {
  if (allVaccines && diseaseOptions) {
    const options: SelectOption[][] = [[]];

    diseaseOptions.forEach((disease, index) => {
      const diseaseId = disease.value.split(",")[0];

      options[index] = allVaccines
        .filter((vaccine) => vaccine.disease.id == diseaseId)
        .map((vaccine) => {
          return {
            label: vaccine.name,
            value: vaccine.id,
          };
        });
    });

    return options;
  } else {
    return [[]];
  }
}

export function createInformationStatementTemplateOptions(
  allInformationStatementTemplates:
    | ApiInformationStatementTemplate[]
    | undefined,
  selectedDiseases: string[],
) {
  if (selectedDiseases && allInformationStatementTemplates) {
    const diseaseIdList = selectedDiseases.map(
      (disease) => disease.split(",")[0]!,
    );

    const options: SelectOption[] = allInformationStatementTemplates
      .filter((template) => {
        const diseaseIdsFromTemplate = template.diseases.map(
          (disease) => disease.id,
        );
        return diseaseIdList.some((diseaseId) =>
          diseaseIdsFromTemplate.includes(diseaseId),
        );
      })
      .map((template) => ({
        value: template.id,
        label: template.title,
      }));
    return options;
  } else {
    return [];
  }
}

export function createOtherServicesTemplateOptions(
  allTemplates: OtherServicesTemplates[] | undefined,
) {
  if (allTemplates) {
    const options: SelectOption[] = allTemplates.map((template) => ({
      label: template.description,
      value: template.id,
    }));

    return options;
  } else {
    return [];
  }
}

export function createAppointmentOptions(
  availableAppointments: ApiAppointmentSummary[] | undefined,
) {
  if (availableAppointments) {
    const labelOptions: SelectOption[] = availableAppointments.map(
      (appointment) => ({
        label: getAppointmentLabel(appointment),
        value: appointment.procedureStepId,
      }),
    );

    return labelOptions;
  } else {
    return [];
  }
}

function getAppointmentLabel(appointment: AppointmentSummary) {
  if (appointment.start) {
    return `${formatDateTime(appointment.start)} Uhr`;
  } else {
    return "";
  }
}

export function determineInitialUser(
  currentUser: string,
  serviceStatus: string,
  users: ApiUser[],
  defaultUser: string,
) {
  let result = currentUser; // plain: just use the user stored in the model
  if (serviceStatus === ApiServiceStatus.Planned) {
    if (currentUser) {
      return result;
    } else if (isNonNullish(defaultUser)) {
      result = defaultUser;
      return result;
    } else if (isEmpty(users)) {
      result = "";
      return result;
    } else {
      result = users[0]!.userId;
      return result;
    }
  }
  return result;
}

export function createPhysicianOptions(allPhysicians: ApiUser[] | undefined) {
  if (allPhysicians) {
    const options: SelectOption[] = allPhysicians.map((option) => ({
      value: option.userId,
      label: fullName(option),
    }));

    return options;
  } else {
    return [];
  }
}

export function createMedicalAssistantOptions(
  allMedicalAssistants: ApiUser[] | undefined,
) {
  if (allMedicalAssistants) {
    const options: SelectOption[] = allMedicalAssistants.map((option) => ({
      value: option === undefined ? "" : option.userId,
      label: option === undefined ? "" : fullName(option),
    }));

    return options;
  } else {
    return [];
  }
}
