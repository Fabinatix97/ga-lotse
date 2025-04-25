/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FormControl, FormLabel, Input } from "@mui/joy";
import { useEffect, useState } from "react";

import {
  ActiveFilter,
  FilterSettingsContent,
  FilterSettingsSheet,
  FilterSettingsSheetProps,
  ResettableSingleSelect,
  SetDictionaryFilterFn,
} from "@eshg/lib-employee-portal";
import { SelectOptions } from "@eshg/lib-portal/components/formFields/SelectOptions";
import {
  isDateString,
  toDateString,
  toUtcDate,
} from "@eshg/lib-portal/helpers/dateTime";
import { ApiProcedureStatus } from "@eshg/travel-medicine-api";

import { PROCEDURE_STATUS_OPTIONS_FOR_SEARCH } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/shared/options";

type AllowedKeys = Extract<
  "DRAFT" | "IN_PROGRESS" | "OPEN",
  keyof typeof ApiProcedureStatus
>;
export type AllowedProcedureStatusForSearch =
  (typeof ApiProcedureStatus)[AllowedKeys];

export type ProcedureFilters = Pick<
  {
    lastName: string;
    firstName: string;
    dateOfBirth: Date;
    status: ApiProcedureStatus;
  },
  "lastName" | "firstName" | "dateOfBirth" | "status"
>;

const FILTER_NAMES: Record<keyof ProcedureFilters, string> = {
  lastName: "Nachname",
  firstName: "Vorname",
  dateOfBirth: "Geburtsdatum",
  status: "Status",
};

function getFilterLabel(filterValue: ActiveFilter<keyof ProcedureFilters>) {
  return FILTER_NAMES[filterValue.key];
}

interface VaccinationConsultationsSearchFilterSettingsProps {
  filterFormValues: ProcedureFilters;
  setFilterFormValue: SetDictionaryFilterFn<
    keyof ProcedureFilters,
    ProcedureFilters
  >;
  deleteFilterValue: (key: keyof ProcedureFilters) => void;
  clearFilterValues: () => void;
  filterSettingsSheetProps: FilterSettingsSheetProps;
  activeFilters: ActiveFilter<keyof ProcedureFilters>[];
}

export function VaccinationConsultationsSearchFilterSettings(
  props: Readonly<VaccinationConsultationsSearchFilterSettingsProps>,
) {
  const [filterConditionsMet, setFilterConditionsMet] = useState(true);

  useEffect(() => {
    const lastNameValid =
      props.filterFormValues.lastName !== undefined &&
      props.filterFormValues.lastName.trim().length >= 2;
    const firstNameValid =
      props.filterFormValues.firstName !== undefined &&
      props.filterFormValues.firstName.trim().length >= 2;
    const dateOfBirthValid = props.filterFormValues.dateOfBirth !== undefined;

    if (lastNameValid || firstNameValid || dateOfBirthValid) {
      setFilterConditionsMet(true);
    } else {
      setFilterConditionsMet(false);
    }
  }, [props.filterFormValues]);

  return (
    <FilterSettingsSheet
      {...props.filterSettingsSheetProps}
      filterConditionsMet={filterConditionsMet}
    >
      <FilterSettingsContent
        showActiveFilters={props.activeFilters.length > 0}
        activeFilters={
          <ActiveFilter
            maxVisible={5}
            filterValues={props.activeFilters}
            deleteAllFilterValues={props.clearFilterValues}
            deleteFilterValue={props.deleteFilterValue}
            getFilterValueLabel={getFilterLabel}
          />
        }
      >
        <FormControl>
          <FormLabel>Vorname</FormLabel>
          <Input
            type="text"
            value={props.filterFormValues.firstName ?? ""}
            onChange={(firstName) => {
              const value = firstName.target.value;
              props.setFilterFormValue("firstName", value);
              if (value === "") props.deleteFilterValue("firstName");
            }}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Nachname</FormLabel>
          <Input
            type="text"
            value={props.filterFormValues.lastName ?? ""}
            onChange={(lastName) => {
              const value = lastName.target.value;
              props.setFilterFormValue("lastName", value);
              if (value === "") props.deleteFilterValue("lastName");
            }}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Geburtsdatum</FormLabel>
          <Input
            type="date"
            value={
              props.filterFormValues.dateOfBirth !== undefined
                ? toDateString(props.filterFormValues.dateOfBirth)
                : ""
            }
            onChange={(dateOfBirth) => {
              const value = dateOfBirth.target.value;
              props.setFilterFormValue(
                "dateOfBirth",
                isDateString(value) ? toUtcDate(value) : undefined,
              );
            }}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Status</FormLabel>
          <ResettableSingleSelect
            aria-label="Status"
            value={props.filterFormValues.status ?? ""}
            onChange={(_, newValue) => {
              if (newValue === null) {
                return;
              }
              props.setFilterFormValue("status", newValue);
            }}
            onResetSelect={() => {
              props.setFilterFormValue("status", undefined);
              props.deleteFilterValue("status");
            }}
          >
            <SelectOptions options={PROCEDURE_STATUS_OPTIONS_FOR_SEARCH} />
          </ResettableSingleSelect>
        </FormControl>
      </FilterSettingsContent>
    </FilterSettingsSheet>
  );
}
