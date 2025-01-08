/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiAppointmentType,
  ApiSchoolEntryProcedureType,
} from "@eshg/employee-portal-api/schoolEntry";
import { buildEnumOptions } from "@eshg/lib-portal/helpers/form";

import { isDraft } from "@/lib/businessModules/schoolEntry/features/procedures/procedureDetails/options";
import {
  APPOINTMENT_TYPES,
  ARTICULATION_VALUES,
  BOOLEAN_WITH_UNKNOWN_VALUES,
  COUNTRY_CODE_VALUES,
  DISABILITY_TYPE_VALUES,
  DOCTOR_LETTER_VALUES,
  EXAMINATION_RESULT_VALUES,
  FAMILY_LANGUAGE_VALUES,
  GERMAN_KNOWLEDGE_VALUES,
  HANDEDNESS_VALUES,
  LANGUAGE_KNOWLEDGE_VALUES,
  PRIMARY_LANGUAGE_VALUES,
  PROCEDURE_TYPES,
  SCHOOL_FEEDBACK_VALUES,
  SCHOOL_RECOMMENDATION_VALUES,
  SOPESS_EXAMINATION_VALUES,
  VACCINATION_SCHEME_VALUES,
  WAITING_STATUS_VALUES,
} from "@/lib/businessModules/schoolEntry/features/procedures/translations";

export const PROCEDURE_TYPE_OPTIONS =
  buildEnumOptions<ApiSchoolEntryProcedureType>(PROCEDURE_TYPES);

export const PROCEDURE_TYPE_OPTIONS_EXCLUDING_DRAFT =
  buildEnumOptions<ApiSchoolEntryProcedureType>(PROCEDURE_TYPES).filter(
    (option) => !isDraft(option.value),
  );

export const PROCEDURE_TYPE_OPTIONS_ENTRY_LEVEL = [
  {
    label: PROCEDURE_TYPES[ApiAppointmentType.EntryLevel],
    value: ApiAppointmentType.EntryLevel,
  },
];

export const EXAMINATION_RESULT_OPTIONS = buildEnumOptions(
  EXAMINATION_RESULT_VALUES,
  true,
);

export const RESPONSE_DOCTOR_LETTER_OPTIONS =
  buildEnumOptions(DOCTOR_LETTER_VALUES);

export const SOPESS_EXAMINATION_RESULT_OPTIONS = buildEnumOptions(
  SOPESS_EXAMINATION_VALUES,
  true,
);

export const HANDEDNESS_OPTIONS = buildEnumOptions(HANDEDNESS_VALUES, true);

export const ARTICULATION_OPTIONS = buildEnumOptions(ARTICULATION_VALUES, true);

export const PRIMARY_LANGUAGE_OPTIONS = buildEnumOptions(
  PRIMARY_LANGUAGE_VALUES,
  true,
);

export const LANGUAGE_KNOWLEDGE_OPTIONS = buildEnumOptions(
  LANGUAGE_KNOWLEDGE_VALUES,
  true,
);

export const FAMILY_LANGUAGE_OPTIONS = buildEnumOptions(
  FAMILY_LANGUAGE_VALUES,
  true,
);

export const GERMAN_KNOWLEDGE_OPTIONS = buildEnumOptions(
  GERMAN_KNOWLEDGE_VALUES,
  true,
);

const SUPPORTED_APPOINTMENT_TYPES: string[] = [
  ApiAppointmentType.RegularExamination,
  ApiAppointmentType.CanChild,
  ApiAppointmentType.EntryLevel,
  ApiAppointmentType.SpecialNeeds,
];

export const APPOINTMENT_TYPE_OPTIONS = buildEnumOptions(
  APPOINTMENT_TYPES,
).filter((option) => SUPPORTED_APPOINTMENT_TYPES.includes(option.value));

export const DISABILITY_TYPE_OPTIONS = buildEnumOptions(
  DISABILITY_TYPE_VALUES,
  true,
);

export const SCHOOL_RECOMMENDATION_OPTIONS = buildEnumOptions(
  SCHOOL_RECOMMENDATION_VALUES,
  true,
);

export const SCHOOL_FEEDBACK_OPTIONS = buildEnumOptions(
  SCHOOL_FEEDBACK_VALUES,
  true,
);

export const COUNTRY_CODE_OPTIONS = buildEnumOptions(COUNTRY_CODE_VALUES, true);

export const VACCINATION_SCHEME_OPTIONS = buildEnumOptions(
  VACCINATION_SCHEME_VALUES,
  true,
);

export const WAITING_STATUS_OPTIONS = buildEnumOptions(WAITING_STATUS_VALUES);

export const BOOLEAN_WITH_UNKNOWN_OPTIONS = buildEnumOptions(
  BOOLEAN_WITH_UNKNOWN_VALUES,
  true,
);
