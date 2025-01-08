/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { GetProceduresRequest } from "@eshg/employee-portal-api/schoolEntry";
import { SelectOptions } from "@eshg/lib-portal/components/formFields/SelectOptions";
import {
  isDateString,
  toDateString,
  toUtcDate,
} from "@eshg/lib-portal/helpers/dateTime";
import { FormControl, FormLabel, Input, Select } from "@mui/joy";
import { isDefined, isEmpty } from "remeda";

import { Label } from "@/lib/businessModules/schoolEntry/api/models/Label";
import { PROCEDURE_TYPE_OPTIONS } from "@/lib/businessModules/schoolEntry/features/procedures/options";
import { LabelAutocomplete } from "@/lib/businessModules/schoolEntry/features/procedures/procedureDetails/LabelAutocomplete";
import { SearchInstitutionFilter } from "@/lib/businessModules/schoolEntry/features/procedures/proceduresTable/SearchInstitutionFilter";
import { ResetButton } from "@/lib/shared/components/ResetButton";
import { ActiveFilter } from "@/lib/shared/components/filterSettings/ActiveFilter";
import { FilterSettingsContent } from "@/lib/shared/components/filterSettings/FilterSettingsContent";
import {
  FilterSettingsSheet,
  FilterSettingsSheetProps,
} from "@/lib/shared/components/filterSettings/FilterSettingsSheet";
import { SetDictionaryFilterFn } from "@/lib/shared/components/filterSettings/useFilterDictionary";
import { SchoolYearAutocomplete } from "@/lib/shared/components/formFields/schoolYear";

export type ProcedureFilters = Pick<
  GetProceduresRequest,
  | "procedureTypeFilter"
  | "schoolIdFilter"
  | "dayOfAppointmentFilter"
  | "hasAppointmentFilter"
  | "schoolYearFilter"
  | "isInvitationSentFilter"
> & { labelsFilter?: Label[] };

const FILTER_NAMES: Record<keyof ProcedureFilters, string> = {
  procedureTypeFilter: "Art",
  schoolIdFilter: "Schule",
  dayOfAppointmentFilter: "Untersuchung am",
  hasAppointmentFilter: "Termin",
  schoolYearFilter: "Schuljahr",
  labelsFilter: "Kennungen",
  isInvitationSentFilter: "Einladung versandt",
};

function getFilterLabel(filterValue: ActiveFilter<keyof ProcedureFilters>) {
  return FILTER_NAMES[filterValue.key];
}

interface ProcedureFilterSettingsProps {
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

function evaluateBooleanValue(value: boolean | undefined) {
  return value === true ? "true" : value === false ? "false" : "";
}

function evaluateStringAsBoolean(value: string) {
  return value === "true" ? true : value === "false" ? false : undefined;
}

export function ProcedureFilterSettings(props: ProcedureFilterSettingsProps) {
  return (
    <FilterSettingsSheet {...props.filterSettingsSheetProps}>
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
          <FormLabel>Untersuchung am</FormLabel>
          <Input
            type="date"
            value={
              props.filterFormValues.dayOfAppointmentFilter !== undefined
                ? toDateString(props.filterFormValues.dayOfAppointmentFilter)
                : ""
            }
            onChange={(dayOfAppointment) => {
              const value = dayOfAppointment.target.value;
              props.setFilterFormValue(
                "dayOfAppointmentFilter",
                isDateString(value) ? toUtcDate(value) : undefined,
              );
            }}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Termin</FormLabel>
          <Select
            value={evaluateBooleanValue(
              props.filterFormValues.hasAppointmentFilter,
            )}
            onChange={(_, newValue) => {
              if (newValue === null) {
                return;
              }
              props.setFilterFormValue(
                "hasAppointmentFilter",
                evaluateStringAsBoolean(newValue),
              );
            }}
            endDecorator={
              isDefined(props.filterFormValues.hasAppointmentFilter) ? (
                <ResetButton
                  onReset={() => {
                    props.setFilterFormValue("hasAppointmentFilter", undefined);
                  }}
                />
              ) : undefined
            }
          >
            <SelectOptions
              options={[
                { value: "true", label: "mit Termin" },
                { value: "false", label: "ohne Termin" },
              ]}
            />
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel>Einladung versandt</FormLabel>
          <Select
            value={evaluateBooleanValue(
              props.filterFormValues.isInvitationSentFilter,
            )}
            onChange={(_, newValue) => {
              if (newValue === null) {
                return;
              }
              props.setFilterFormValue(
                "isInvitationSentFilter",
                evaluateStringAsBoolean(newValue),
              );
            }}
            endDecorator={
              isDefined(props.filterFormValues.isInvitationSentFilter) ? (
                <ResetButton
                  onReset={() => {
                    props.setFilterFormValue(
                      "isInvitationSentFilter",
                      undefined,
                    );
                  }}
                />
              ) : undefined
            }
          >
            <SelectOptions
              options={[
                { value: "true", label: "Ja" },
                { value: "false", label: "Nein" },
              ]}
            />
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel>Schuljahr</FormLabel>
          <SchoolYearAutocomplete
            value={props.filterFormValues.schoolYearFilter ?? null}
            onChange={(_, newValue) => {
              props.setFilterFormValue(
                "schoolYearFilter",
                newValue ?? undefined,
              );
            }}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Schule</FormLabel>
          <SearchInstitutionFilter
            institutionId={props.filterFormValues.schoolIdFilter}
            onChange={(schoolId) =>
              props.setFilterFormValue("schoolIdFilter", schoolId)
            }
          />
        </FormControl>
        <FormControl>
          <FormLabel>Art</FormLabel>
          <Select
            aria-label="Art"
            value={props.filterFormValues.procedureTypeFilter ?? ""}
            onChange={(_, newValue) => {
              if (newValue === null) {
                return;
              }
              props.setFilterFormValue("procedureTypeFilter", newValue);
            }}
            endDecorator={
              isDefined(props.filterFormValues.procedureTypeFilter) ? (
                <ResetButton
                  onReset={() => {
                    props.setFilterFormValue("procedureTypeFilter", undefined);
                  }}
                />
              ) : undefined
            }
          >
            <SelectOptions options={PROCEDURE_TYPE_OPTIONS} />
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel>Kennungen</FormLabel>
          <LabelAutocomplete
            name="labels"
            value={props.filterFormValues.labelsFilter ?? []}
            onChange={(newValue) => {
              props.setFilterFormValue(
                "labelsFilter",
                isEmpty(newValue) ? undefined : newValue,
              );
            }}
          />
        </FormControl>
      </FilterSettingsContent>
    </FilterSettingsSheet>
  );
}
