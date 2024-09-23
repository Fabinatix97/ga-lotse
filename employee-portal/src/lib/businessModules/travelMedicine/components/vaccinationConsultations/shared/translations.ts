/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiProcedureStatus,
  ApiServiceStatus,
  ApiTravelTimeUnit,
  ApiTravelType,
} from "@eshg/employee-portal-api/travelMedicine";
import { EnumMap } from "@eshg/lib-portal/types/helpers";

import { AllowedProcedureStatusForSearch } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultationSearch/VaccinationConsultationsSearchFilterSettings";

export const TRAVEL_TYPES: EnumMap<ApiTravelType> = {
  [ApiTravelType.Unspecified]: "nicht erfasst",
  [ApiTravelType.NoTravel]: "keine Reise",
  [ApiTravelType.Business]: "Geschäftsreise",
  [ApiTravelType.Vacation]: "Urlaubsreise",
  [ApiTravelType.Backpack]: "Rucksackreise",
};

export const TRAVEL_TIME_UNITS: EnumMap<ApiTravelTimeUnit> = {
  [ApiTravelTimeUnit.Days]: "Tage",
  [ApiTravelTimeUnit.Weeks]: "Wochen",
  [ApiTravelTimeUnit.Months]: "Monate",
  [ApiTravelTimeUnit.Years]: "Jahre",
};

export const STATUS_NAMES: EnumMap<ApiServiceStatus> = {
  [ApiServiceStatus.Open]: "Offen",
  [ApiServiceStatus.Planned]: "Geplant",
  [ApiServiceStatus.Accomplished]: "Erledigt",
};

export const PROCEDURE_STATUS_NAMES_FOR_SEARCH: EnumMap<AllowedProcedureStatusForSearch> =
  {
    [ApiProcedureStatus.Draft]: "Geplant",
    [ApiProcedureStatus.InProgress]: "In Ausführung",
    [ApiProcedureStatus.Open]: "Offen",
  };
