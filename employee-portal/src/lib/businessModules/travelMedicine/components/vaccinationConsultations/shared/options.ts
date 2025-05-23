/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { buildEnumOptions } from "@eshg/lib-portal";
import {
  ApiTravelTimeUnit,
  ApiTravelType,
  ApiVaccinationType,
} from "@eshg/travel-medicine-api";

import { AllowedProcedureStatusForSearch } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultationSearch/VaccinationConsultationsSearchFilterSettings";
import {
  PROCEDURE_STATUS_NAMES_FOR_SEARCH,
  TRAVEL_TIME_UNITS,
  TRAVEL_TYPES,
} from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/shared/translations";

export const VACCINATION_CONSULTATION_TRAVEL_TYPE_OPTIONS =
  buildEnumOptions<ApiTravelType>(TRAVEL_TYPES).filter(
    (option) => option.value,
  );

export const VACCINATION_CONSULTATION_TRAVEL_TIME_UNITS =
  buildEnumOptions<ApiTravelTimeUnit>(TRAVEL_TIME_UNITS).filter(
    (option) => option.value,
  );

export const VACCINATION_TYPE = [
  {
    value: ApiVaccinationType.Basic,
    label: "Grundimmunisierung",
  },
  { value: ApiVaccinationType.Booster, label: "Auffrischung" },
];

export const PROCEDURE_STATUS_OPTIONS_FOR_SEARCH =
  buildEnumOptions<AllowedProcedureStatusForSearch>(
    PROCEDURE_STATUS_NAMES_FOR_SEARCH,
  );
