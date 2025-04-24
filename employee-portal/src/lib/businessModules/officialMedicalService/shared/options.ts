/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { buildEnumOptions } from "@eshg/lib-portal/helpers/form";

import {
  ADDICTION_VALUES,
  BOOLEAN_WITH_UNKNOWN_VALUES,
  CURRENT_MEDICAL_CONDITION_VALUES,
  EATING_DISORDER_VALUES,
  FILLING_PERSON_VALUES,
  HEART_DISEASE_VALUES,
  MARITAL_STATUS_VALUES,
  MENTAL_ILLNESS_VALUES,
  OPTICAL_AID_VALUES,
  THYROID_DISEASE_VALUES,
} from "@/lib/businessModules/officialMedicalService/shared/enums";

export const BOOLEAN_WITH_UNKNOWN_OPTIONS = buildEnumOptions(
  BOOLEAN_WITH_UNKNOWN_VALUES,
  false,
);

export const FILLING_PERSON_OPTIONS = buildEnumOptions(
  FILLING_PERSON_VALUES,
  false,
);

export const MARITAL_STATUS_OPTIONS = buildEnumOptions(
  MARITAL_STATUS_VALUES,
  false,
);

export const CURRENT_MEDICAL_CONDITION_OPTIONS = buildEnumOptions(
  CURRENT_MEDICAL_CONDITION_VALUES,
  false,
);

export const OPTICAL_AID_OPTIONS = buildEnumOptions(OPTICAL_AID_VALUES, false);

export const ADDICTION_OPTIONS = buildEnumOptions(ADDICTION_VALUES, false);

export const EATING_DISORDER_OPTIONS = buildEnumOptions(
  EATING_DISORDER_VALUES,
  false,
);

export const HEART_DISEASE_OPTIONS = buildEnumOptions(
  HEART_DISEASE_VALUES,
  false,
);

export const MENTAL_ILLNESS_OPTIONS = buildEnumOptions(
  MENTAL_ILLNESS_VALUES,
  false,
);

export const THYROID_DISEASE_OPTIONS = buildEnumOptions(
  THYROID_DISEASE_VALUES,
  false,
);
