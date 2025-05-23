/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { SelectOption, buildEnumOptions } from "@eshg/lib-portal";
import { ApiAppointmentType, ApiConcern } from "@eshg/sti-protection-api";

import { APPOINTMENT_TYPES } from "@/lib/businessModules/stiProtection/shared/constants";

const SUPPORTED_APPOINTMENT_TYPES = [
  ApiAppointmentType.HivStiConsultation,
  ApiAppointmentType.ResultsReview,
  ApiAppointmentType.SexWork,
] as string[];

export const APPOINTMENT_TYPE_OPTIONS = buildEnumOptions(
  APPOINTMENT_TYPES,
).filter((option) => SUPPORTED_APPOINTMENT_TYPES.includes(option.value));

type AppointmentOption = SelectOption<ApiAppointmentType, string>;

function typeToOption(type: ApiAppointmentType): AppointmentOption {
  return {
    value: type,
    label: APPOINTMENT_TYPES[type],
  };
}

export function appointmentOptionsByConcern(
  concern?: ApiConcern,
): AppointmentOption[] {
  const defaultAppointmentOptions = [
    typeToOption(ApiAppointmentType.ResultsReview),
  ];
  const appointmentOptions = [];

  switch (concern) {
    case "HIV_STI_CONSULTATION":
      appointmentOptions.push(
        typeToOption(ApiAppointmentType.HivStiConsultation),
      );
      break;
    case "SEX_WORK":
      appointmentOptions.push(typeToOption(ApiAppointmentType.SexWork));
      break;

    default:
      break;
  }

  return [...appointmentOptions, ...defaultAppointmentOptions];
}
