/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FormControl, FormLabel, Input } from "@mui/joy";
import { useQueries } from "@tanstack/react-query";
import { isEmpty } from "remeda";

import { ApiContactCategory } from "@eshg/base-api";
import {
  ActiveFilter,
  FilterSettingsContent,
  FilterSettingsSheet,
  FilterSettingsSheetProps,
  OverlayBoundary,
  ProcedureLabel,
  ProcedureLabelAutocomplete,
  ResettableSingleSelect,
  RoomSelect,
  SchoolYearAutocomplete,
  SearchInstitutionFilter,
  SetDictionaryFilterFn,
  SetDictionaryFiltersFn,
} from "@eshg/lib-employee-portal";
import {
  SelectOptions,
  isDateString,
  toDateString,
  toUtcDate,
} from "@eshg/lib-portal";
import { GetProceduresRequest } from "@eshg/school-entry-api";

import { UserAutoCompleteField } from "@/lib/auditlog/components/authorize/UserAutoCompleteField";
import { useUserApi } from "@/lib/baseModule/api/clients";
import {
  useAppointmentBlockApi,
  useLabelApi,
} from "@/lib/businessModules/schoolEntry/api/clients";
import { mapAppointmentBlockApi } from "@/lib/businessModules/schoolEntry/api/mapAppointmentBlockApi";
import {
  appointmentBlockApiQueryKey,
  schoolEntryApiQueryKey,
} from "@/lib/businessModules/schoolEntry/api/queries/apiQueryKeys";
import {
  getAllMedicalAssistantsQuery,
  getAllPhysiciansQuery,
} from "@/lib/businessModules/schoolEntry/api/queries/appointmentStaff";
import { PROCEDURE_TYPE_OPTIONS } from "@/lib/businessModules/schoolEntry/features/procedures/options";

export type ProcedureFilters = Pick<
  GetProceduresRequest,
  | "procedureTypeFilter"
  | "schoolIdFilter"
  | "dayOfAppointmentFilter"
  | "hasAppointmentFilter"
  | "schoolYearFilter"
  | "isInvitationSentFilter"
  | "hasExaminationEditsFilter"
  | "physiciansFilter"
  | "mfasFilter"
  | "roomFilter"
> & { labelsFilter?: ProcedureLabel[] } & {
  excludedLabelsFilter?: ProcedureLabel[];
};

const FILTER_NAMES: Record<keyof ProcedureFilters, string> = {
  procedureTypeFilter: "Art",
  schoolIdFilter: "Schule",
  dayOfAppointmentFilter: "Untersuchung am",
  hasAppointmentFilter: "Termin",
  schoolYearFilter: "Schuljahr",
  labelsFilter: "Kennungen",
  excludedLabelsFilter: "Ohne Kennungen",
  isInvitationSentFilter: "Einladung versandt",
  hasExaminationEditsFilter: "Untersuchung begonnen",
  physiciansFilter: "Arzt",
  mfasFilter: "MFA",
  roomFilter: "Raum",
};

const SCHOOL_CONTACT = new Set<ApiContactCategory>([ApiContactCategory.School]);

function getFilterLabel(filterValue: ActiveFilter<keyof ProcedureFilters>) {
  return FILTER_NAMES[filterValue.key];
}

interface ProcedureFilterSettingsProps {
  filterFormValues: ProcedureFilters;
  setFilterFormValue: SetDictionaryFilterFn<
    keyof ProcedureFilters,
    ProcedureFilters
  >;
  setFilterFormValues: SetDictionaryFiltersFn<
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
  const labelApi = useLabelApi();
  const appointmentBlockApi = useAppointmentBlockApi();
  const { physicians, mfas } = useGetUsers();

  function setLabelFilterFormValues(
    labelsValues: ProcedureLabel[],
    excludedLabelsValues: ProcedureLabel[],
  ) {
    props.setFilterFormValues([
      {
        name: "labelsFilter",
        value: isEmpty(labelsValues) ? undefined : labelsValues,
      },
      {
        name: "excludedLabelsFilter",
        value: isEmpty(excludedLabelsValues) ? undefined : excludedLabelsValues,
      },
    ]);
  }

  return (
    <OverlayBoundary>
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
            <FormLabel>Untersuchung begonnen</FormLabel>
            <ResettableSingleSelect
              value={evaluateBooleanValue(
                props.filterFormValues.hasExaminationEditsFilter,
              )}
              onChange={(_, newValue) => {
                if (newValue === null) {
                  return;
                }
                props.setFilterFormValue(
                  "hasExaminationEditsFilter",
                  evaluateStringAsBoolean(newValue),
                );
              }}
              onResetSelect={() => {
                props.setFilterFormValue(
                  "hasExaminationEditsFilter",
                  undefined,
                );
              }}
            >
              <SelectOptions
                options={[
                  { value: "true", label: "Ja" },
                  { value: "false", label: "Nein" },
                ]}
              />
            </ResettableSingleSelect>
          </FormControl>
          <FormControl>
            <FormLabel>Termin</FormLabel>
            <ResettableSingleSelect
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
              onResetSelect={() => {
                props.setFilterFormValue("hasAppointmentFilter", undefined);
              }}
            >
              <SelectOptions
                options={[
                  { value: "true", label: "mit Termin" },
                  { value: "false", label: "ohne Termin" },
                ]}
              />
            </ResettableSingleSelect>
          </FormControl>
          <FormControl>
            <FormLabel>Einladung versandt</FormLabel>
            <ResettableSingleSelect
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
              onResetSelect={() => {
                props.setFilterFormValue("isInvitationSentFilter", undefined);
              }}
            >
              <SelectOptions
                options={[
                  { value: "true", label: "Ja" },
                  { value: "false", label: "Nein" },
                ]}
              />
            </ResettableSingleSelect>
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
              placeholder="Schule suchen"
              institutionId={props.filterFormValues.schoolIdFilter}
              categories={SCHOOL_CONTACT}
              onChange={(schoolId) =>
                props.setFilterFormValue("schoolIdFilter", schoolId)
              }
            />
          </FormControl>
          <FormControl>
            <FormLabel>Art</FormLabel>
            <ResettableSingleSelect
              aria-label="Art"
              value={props.filterFormValues.procedureTypeFilter ?? ""}
              onChange={(_, newValue) => {
                if (newValue === null) {
                  return;
                }
                props.setFilterFormValue("procedureTypeFilter", newValue);
              }}
              onResetSelect={() => {
                props.setFilterFormValue("procedureTypeFilter", undefined);
              }}
            >
              <SelectOptions options={PROCEDURE_TYPE_OPTIONS} />
            </ResettableSingleSelect>
          </FormControl>
          <FormControl>
            <FormLabel>Kennungen</FormLabel>
            <ProcedureLabelAutocomplete
              name="labels"
              value={props.filterFormValues.labelsFilter ?? []}
              procedureLabelApi={labelApi}
              procedureLabelApiQueryKey={schoolEntryApiQueryKey}
              onChange={(newValue) => {
                const filteredExcludedLabels = removeAllLabel(
                  props.filterFormValues.excludedLabelsFilter ?? [],
                  newValue,
                );
                setLabelFilterFormValues(
                  newValue,
                  filteredExcludedLabels ?? [],
                );
              }}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Ohne Kennungen</FormLabel>
            <ProcedureLabelAutocomplete
              name="excludedLabels"
              value={props.filterFormValues.excludedLabelsFilter ?? []}
              procedureLabelApi={labelApi}
              procedureLabelApiQueryKey={schoolEntryApiQueryKey}
              onChange={(newValue) => {
                const filteredLabels = removeAllLabel(
                  props.filterFormValues.labelsFilter ?? [],
                  newValue,
                );
                setLabelFilterFormValues(filteredLabels ?? [], newValue);
              }}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Ärzte</FormLabel>
            <UserAutoCompleteField
              options={Object.values(physicians)}
              values={
                props.filterFormValues.physiciansFilter
                  ?.map((id) => physicians[id])
                  .filter((user) => !!user) ?? []
              }
              setFieldValue={(_, value) =>
                props.setFilterFormValue(
                  "physiciansFilter",
                  value.map((user) => user.userId),
                )
              }
              color="neutral"
            />
          </FormControl>
          <FormControl>
            <FormLabel>MFAs</FormLabel>
            <UserAutoCompleteField
              options={Object.values(mfas)}
              values={
                props.filterFormValues.mfasFilter
                  ?.map((id) => mfas[id])
                  .filter((user) => !!user) ?? []
              }
              setFieldValue={(_, value) =>
                props.setFilterFormValue(
                  "mfasFilter",
                  value.map((user) => user.userId),
                )
              }
              color="neutral"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Raum</FormLabel>
            <RoomSelect
              appointmentBlockApi={mapAppointmentBlockApi(appointmentBlockApi)}
              queryKey={appointmentBlockApiQueryKey}
              filterFormValues={props.filterFormValues}
              setFilterFormValue={props.setFilterFormValue}
            />
          </FormControl>
        </FilterSettingsContent>
      </FilterSettingsSheet>
    </OverlayBoundary>
  );
}

function removeAllLabel(
  labels: ProcedureLabel[],
  labelsToRemove: ProcedureLabel[],
): ProcedureLabel[] {
  return labels.filter(
    (label) => !labelsToRemove.map((label) => label.id).includes(label.id),
  );
}

function useGetUsers() {
  const userApi = useUserApi();
  const [{ data: physicians }, { data: mfas }] = useQueries({
    queries: [
      getAllPhysiciansQuery(userApi),
      getAllMedicalAssistantsQuery(userApi),
    ],
  });
  return {
    physicians: Object.fromEntries(
      physicians?.map((user) => [user.userId, user]) ?? [],
    ),
    mfas: Object.fromEntries(mfas?.map((user) => [user.userId, user]) ?? []),
  };
}
