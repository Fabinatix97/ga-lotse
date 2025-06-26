/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useSuspenseQueries } from "@tanstack/react-query";
import { addDays, formatISO } from "date-fns";
import { useMemo, useState } from "react";

import { ApiObjectType } from "@eshg/inspection-api";
import {
  ButtonBar,
  DataTable,
  FilterDefinition,
  FilterSettings,
  FilterSettingsSheet,
  FilterSettingsStateProvider,
  FilterValue,
  Pagination,
  TablePage,
  TableSheet,
  ToggleFilterButton,
  useFilterSettings,
  useGdprValidationTasksAlert,
  useGetGdprValidationBannerQuery,
  useQueryParamStateProvider,
  useTableControl,
} from "@eshg/lib-employee-portal";
import { optionsFromRecord } from "@eshg/lib-portal";
import { ApiBusinessModule } from "@eshg/lib-procedures-api";

import { procedureStatusNames } from "@/lib/baseModule/api/procedures/enums";
import {
  useFacilityApi,
  useGdprValidationTaskApi,
} from "@/lib/businessModules/inspection/api/clients";
import { getPendingFacilitiesQuery } from "@/lib/businessModules/inspection/api/queries/facility";
import { useGetObjectTypes } from "@/lib/businessModules/inspection/api/queries/objectTypes";
import { ExportBannedFacilitiesButton } from "@/lib/businessModules/inspection/components/facility/pending/ExportBannedFacilitiesButton";
import { NewFacilityButton } from "@/lib/businessModules/inspection/components/facility/pending/NewFacilityButton";
import { PendingFacilitiesIncidentsSidebar } from "@/lib/businessModules/inspection/components/facility/pending/PendingFacilitiesIncidentsSidebar";
import { PotentialDuplicatesWarning } from "@/lib/businessModules/inspection/components/facility/pending/PotentialDuplicatesWarning";
import { useReviewFacilityDuplicateSidebar } from "@/lib/businessModules/inspection/components/facility/pending/ReviewFacilityDuplicateSidebar";
import { useReviewInspectionDuplicateSidebar } from "@/lib/businessModules/inspection/components/facility/pending/ReviewInspectionDuplicateSidebar";
import { ProcessImportButton } from "@/lib/businessModules/inspection/components/processImport/ProcessImportButton";
import {
  inspectionBannedFacilityFilterNames,
  inspectionDuplicateFilterNames,
  inspectionPendingFacilityKindNames,
  inspectionPhaseNames,
  inspectionTypeNames,
} from "@/lib/businessModules/inspection/shared/enums";
import { PendingFacilitiesFilters } from "@/lib/businessModules/inspection/shared/types";
import { TextInputFilter } from "@/lib/shared/components/tableFilters/TextInputFilter";

import {
  createPendingFacilitiesColumns,
  getPendingFacilityRowRoute,
} from "./columns";

type UserActivityState =
  | { type: "view-table" }
  | { type: "view-incidents"; inspectionId: string; facilityName: string };

const initialUserActivity: UserActivityState = { type: "view-table" };

function createFilterDefinitions(
  objectTypes: ApiObjectType[],
): FilterDefinition[] {
  const objectTypeOptions = objectTypes.map((o) => ({
    label: o.name,
    value: o.id,
  }));

  return [
    {
      type: "EnumSingle",
      key: "kind",
      name: "Art",
      options: optionsFromRecord(inspectionPendingFacilityKindNames),
    },
    {
      type: "EnumSingle",
      key: "objectTypeId",
      name: "Objekttyp",
      options: objectTypeOptions,
    },
    {
      type: "Enum",
      key: "status",
      name: "Status",
      options: optionsFromRecord(procedureStatusNames),
    },
    {
      type: "Enum",
      key: "type",
      name: "Typ",
      options: optionsFromRecord(inspectionTypeNames),
    },
    {
      type: "Enum",
      key: "phase",
      name: "Phase",
      options: optionsFromRecord(inspectionPhaseNames),
    },
    {
      type: "Date",
      key: "isBefore",
      name: "Begehung vor",
    },
    {
      type: "Date",
      key: "isAfter",
      name: "Begehung nach",
    },
    {
      type: "EnumSingle",
      key: "hasDuplicates",
      name: "Duplikat",
      options: optionsFromRecord(inspectionDuplicateFilterNames),
    },
    {
      type: "EnumSingle",
      key: "banned",
      name: "Untersagte Einrichtung",
      options: optionsFromRecord(inspectionBannedFacilityFilterNames),
    },
  ];
}

export function PendingFacilitiesTable(
  props: Readonly<{ filter: PendingFacilitiesFilters }>,
) {
  const tableControl = useTableControl({ serverSideSorting: true });
  const { data: objectTypes } = useGetObjectTypes();

  const filterDefinitions = createFilterDefinitions(objectTypes);
  const paramStateProvider = useQueryParamStateProvider(filterDefinitions, {
    useRouterReplace: true,
  });
  const { stateProvider, filter } = usePendingFacilitiesFilterState({
    stateProvider: paramStateProvider,
    defaults: [
      {
        type: "Enum",
        key: "phase",
        selectedValues: ["NEW", "PLANNING", "READY_FOR_EXECUTION"],
      },
      {
        type: "Date",
        key: "isBefore",
        selectedValue: formatISO(addDays(new Date(), 14), {
          representation: "date",
        }),
      },
    ],
    filter: props.filter,
  });

  function filterForDuplicates() {
    filterSettings.filterSettingsProps.activeFilterProps.deleteAllFilterValues();
    filterSettings.filterSettingsProps.onDraftValueChange("hasDuplicates", {
      type: "EnumSingle",
      key: "hasDuplicates",
      selectedValue: "true",
    });
    paramStateProvider.setActiveValues([
      {
        type: "EnumSingle",
        key: "hasDuplicates",
        selectedValue: "true",
      },
    ]);
  }

  const facilityApi = useFacilityApi();
  const gdprValidationTaskApi = useGdprValidationTaskApi();
  const gdprBannerQuery = useGetGdprValidationBannerQuery(
    ApiBusinessModule.Inspection,
    gdprValidationTaskApi,
  );
  const [{ data: procedures, isFetching }, { data: gdprBanner }] =
    useSuspenseQueries({
      queries: [
        getPendingFacilitiesQuery(facilityApi, {
          ...filter,
          pageNumber: tableControl.paginationProps.pageNumber,
          pageSize: tableControl.paginationProps.pageSize,
        }),
        gdprBannerQuery,
      ],
    });

  useGdprValidationTasksAlert({
    banner: gdprBanner,
    businessModule: ApiBusinessModule.Inspection,
  });

  const columns = createPendingFacilitiesColumns(
    handleViewIncidentsClick,
    openReviewFacilityDuplicateSidebar,
    openReviewInspectionDuplicateSidebar,
    true,
  );

  const [userActivity, setUserActivity] =
    useState<UserActivityState>(initialUserActivity);

  const filterSettings = useFilterSettings({
    definitions: filterDefinitions,
    stateProvider,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onValuesSubmit: (_values) => {},
    showSearch: false,
  });

  const reviewFacilityDuplicateSidebar = useReviewFacilityDuplicateSidebar();
  const reviewInspectionDuplicateSidebar =
    useReviewInspectionDuplicateSidebar();

  function openReviewFacilityDuplicateSidebar(inspectionId: string) {
    reviewFacilityDuplicateSidebar.open({ inspectionId });
  }

  function openReviewInspectionDuplicateSidebar(inspectionId: string) {
    reviewInspectionDuplicateSidebar.open({ inspectionId });
  }

  function handleSidebarClosed() {
    setUserActivity(initialUserActivity);
  }

  function handleViewIncidentsClick(
    inspectionId: string,
    facilityName: string,
  ) {
    setUserActivity({
      type: "view-incidents",
      inspectionId: inspectionId,
      facilityName: facilityName,
    });
  }

  return (
    <>
      {procedures.numberOfPossibleDuplicates !== 0 && (
        <PotentialDuplicatesWarning
          numberOfDuplicates={procedures.numberOfPossibleDuplicates}
          onFilterForDuplicates={filterForDuplicates}
        />
      )}
      <TablePage
        fullHeight
        controls={
          <ButtonBar
            left={
              <>
                <ToggleFilterButton {...filterSettings.filterButtonProps} />
                <TextInputFilter
                  searchParamName="name"
                  placeholder="Name"
                  tableControl={tableControl}
                />
                <TextInputFilter
                  searchParamName="postalCode"
                  placeholder="PLZ"
                  tableControl={tableControl}
                />
                <TextInputFilter
                  searchParamName="city"
                  placeholder="Stadt"
                  tableControl={tableControl}
                />
                <TextInputFilter
                  searchParamName="street"
                  placeholder="Straße"
                  tableControl={tableControl}
                />
              </>
            }
            right={
              <>
                <ExportBannedFacilitiesButton />
                <ProcessImportButton
                  onFilterForDuplicates={filterForDuplicates}
                />
                <NewFacilityButton />
              </>
            }
          />
        }
        filterSettings={
          filterSettings.filterSettingsVisible && (
            <FilterSettingsSheet {...filterSettings.filterSettingsSheetProps}>
              <FilterSettings {...filterSettings.filterSettingsProps} />
            </FilterSettingsSheet>
          )
        }
      >
        <TableSheet
          loading={isFetching}
          footer={
            <Pagination
              totalCount={procedures.totalNumberOfElements}
              {...tableControl.paginationProps}
            />
          }
        >
          <DataTable
            data={procedures.elements}
            columns={columns}
            sorting={tableControl.tableSorting}
            rowNavigation={{
              route: getPendingFacilityRowRoute,
              focusColumnAccessorKey: "name",
            }}
            striped
          />
        </TableSheet>
      </TablePage>
      {userActivity.type === "view-incidents" && (
        <PendingFacilitiesIncidentsSidebar
          open
          inspectionId={userActivity.inspectionId}
          facilityName={userActivity.facilityName}
          onClose={handleSidebarClosed}
        />
      )}
    </>
  );
}

function usePendingFacilitiesFilterState(options: {
  stateProvider: FilterSettingsStateProvider;
  filter: PendingFacilitiesFilters;
  defaults: FilterValue[];
}) {
  const { activeValues, setActiveValues, ...rest } = options.stateProvider;
  const [touched, setTouched] = useState(activeValues.length > 0);

  const stateProvider: FilterSettingsStateProvider = {
    activeValues: touched ? activeValues : options.defaults,
    setActiveValues: (values) => {
      setTouched(true);
      setActiveValues(values);
    },
    ...rest,
  };

  const filter: PendingFacilitiesFilters = useMemo(
    () => ({
      ...options.filter,
      ...(touched ? {} : activeValuesToFilters(options.defaults)),
    }),
    [options.filter, options.defaults, touched],
  );

  return {
    stateProvider,
    filter,
  };
}

function activeValuesToFilters(
  activeValues: FilterValue[],
): PendingFacilitiesFilters {
  const filters = new Map<string, unknown>();

  for (const value of activeValues) {
    switch (value.type) {
      case "Date":
      case "EnumSingle":
        filters.set(value.key, value.selectedValue);
        break;
      case "Enum":
        filters.set(value.key, value.selectedValues);
        break;
      default:
        break;
    }
  }

  return Object.fromEntries(filters);
}
