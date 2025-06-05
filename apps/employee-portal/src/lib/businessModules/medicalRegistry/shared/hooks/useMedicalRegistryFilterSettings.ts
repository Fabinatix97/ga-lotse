/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  FilterDefinition,
  FilterValue,
  UseFilterSettings,
  getFilterSelectedValue,
  getFilterSelectedValues,
  useFilterSettings,
} from "@eshg/lib-employee-portal";
import { PROFESSIONAL_TITLE_NAMES } from "@eshg/medical-registry";
import {
  ApiProcedureStatus,
  ApiProcedureType,
  ApiProfessionalTitle,
  GetProcedureOverviewRequest,
} from "@eshg/medical-registry-api";

import {
  EntryStatus,
  entryStatusNames,
} from "@/lib/businessModules/medicalRegistry/shared/constants";

const FILTER_KEYS = {
  status: "status",
  certificateRequested: "certificateRequested",
  professionalTitle: "professionalTitle",
};

const initialProfessionalTitles = "initialProfessionalTitles";

export function useMedicalRegistryFilterSettings(): UseFilterSettings {
  const filterDefinitions: FilterDefinition[] = [
    {
      type: "EnumSingle",
      key: FILTER_KEYS.certificateRequested,
      name: "Meldebestätigung",
      options: [
        { value: "true", label: "Ja" },
        { value: "false", label: "Nein" },
      ],
    },
    {
      type: "Enum",
      key: FILTER_KEYS.status,
      name: "Status",
      options: buildOptionsFromStatus(),
    },
    {
      type: "Enum",
      key: FILTER_KEYS.professionalTitle,
      name: "Berufsbezeichnung",
      options: buildOptionsFromProfessionalTitles(),
    },
  ];

  function getInitialValues(): FilterValue[] | undefined {
    const storedTitles = localStorage.getItem(initialProfessionalTitles);
    return storedTitles
      ? [
          {
            type: "Enum",
            key: "professionalTitle",
            selectedValues: JSON.parse(storedTitles) as [],
          },
        ]
      : undefined;
  }

  return useFilterSettings({
    definitions: filterDefinitions,
    initialValues: getInitialValues(),
    onValuesSubmit: (values) => {
      const selectedProfessionalTitles = getFilterSelectedValues(
        values,
        FILTER_KEYS.professionalTitle,
        ApiProfessionalTitle,
      );
      const stringifiedTitles = JSON.stringify(selectedProfessionalTitles);
      if (selectedProfessionalTitles !== undefined) {
        localStorage.setItem(initialProfessionalTitles, stringifiedTitles);
      } else {
        localStorage.removeItem(initialProfessionalTitles);
      }
    },
    showSearch: false,
  });
}

function buildOptionsFromProfessionalTitles() {
  return Object.entries(PROFESSIONAL_TITLE_NAMES).map(([key, label]) => ({
    value: key,
    label,
  }));
}

function buildOptionsFromStatus() {
  return Object.entries(entryStatusNames).map(([key, label]) => ({
    value: key,
    label: label,
  }));
}

export function getMedicalRegistryEntryFilters(
  filterValues: FilterValue[],
): Pick<
  GetProcedureOverviewRequest,
  | "certificateRequested"
  | "procedureStatus"
  | "procedureType"
  | "professionalTitle"
> {
  const { status, type } = mapStatusToStatusAndType(
    getFilterSelectedValues(filterValues, FILTER_KEYS.status, EntryStatus) ??
      [],
  );

  const professionalTitle =
    getFilterSelectedValues(
      filterValues,
      FILTER_KEYS.professionalTitle,
      ApiProfessionalTitle,
    ) ?? [];
  return {
    certificateRequested: evaluateStringAsBoolean(
      getFilterSelectedValue(filterValues, FILTER_KEYS.certificateRequested),
    ),
    procedureStatus: status.length !== 0 ? new Set(status) : undefined,
    procedureType: type.length !== 0 ? new Set(type) : undefined,
    professionalTitle:
      professionalTitle.length !== 0 ? new Set(professionalTitle) : undefined,
  };
}

function mapStatusToStatusAndType(statusValues: EntryStatus[]) {
  const status: ApiProcedureStatus[] = [];
  const type: ApiProcedureType[] = [];
  for (const value of statusValues) {
    if (value === EntryStatus.Closed) {
      status.push(ApiProcedureStatus.Closed);
      type.push(ApiProcedureType.MedicalRegistryEntry);
    } else if (value === EntryStatus.Open) {
      status.push(ApiProcedureStatus.Open);
      type.push(ApiProcedureType.MedicalRegistryEntry);
    } else if (value === EntryStatus.DraftEmployee) {
      status.push(ApiProcedureStatus.Draft);
      type.push(ApiProcedureType.MedicalRegistryEmployeeDraft);
    } else if (value === EntryStatus.DraftCitizen) {
      status.push(ApiProcedureStatus.Draft);
      type.push(ApiProcedureType.MedicalRegistryCitizenDraft);
    }
  }
  return { status, type };
}
function evaluateStringAsBoolean(value: string | undefined) {
  return value === "true" ? true : value === "false" ? false : undefined;
}
