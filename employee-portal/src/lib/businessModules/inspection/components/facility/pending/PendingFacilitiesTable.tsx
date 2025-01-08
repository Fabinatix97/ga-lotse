/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiBusinessModule } from "@eshg/employee-portal-api/businessProcedures";
import { ApiObjectType } from "@eshg/employee-portal-api/inspection";
import { optionsFromRecord } from "@eshg/lib-portal/components/formFields/SelectOptions";
import { useSuspenseQueries } from "@tanstack/react-query";
import { addDays, formatISO } from "date-fns";
import { useMemo, useState } from "react";

import { procedureStatusNames } from "@/lib/baseModule/api/procedures/enums";
import { useFacilityApi } from "@/lib/businessModules/inspection/api/clients";
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
import { useIsOfflineFeatureEnabled } from "@/lib/businessModules/inspection/shared/offline/useIsOfflineFeatureEnabled";
import { PendingFacilitiesFilters } from "@/lib/businessModules/inspection/shared/types";
import { useGetGdprValidationBannerQuery } from "@/lib/shared/api/queries/gdpr";
import { ButtonBar } from "@/lib/shared/components/buttons/ButtonBar";
import { FilterButton } from "@/lib/shared/components/buttons/FilterButton";
import { FilterSettings } from "@/lib/shared/components/filterSettings/FilterSettings";
import { FilterSettingsSheet } from "@/lib/shared/components/filterSettings/FilterSettingsSheet";
import { FilterDefinition } from "@/lib/shared/components/filterSettings/models/FilterDefinition";
import { FilterValue } from "@/lib/shared/components/filterSettings/models/FilterValue";
import {
  FilterSettingsStateProvider,
  useFilterSettings,
} from "@/lib/shared/components/filterSettings/useFilterSettings";
import { useSearchParamStateProvider } from "@/lib/shared/components/filterSettings/useSearchParamStateProvider";
import { useGdprValidationTasksAlert } from "@/lib/shared/components/gdpr/useGdprValidationTasksAlert";
import { Pagination } from "@/lib/shared/components/pagination/Pagination";
import { DataTable } from "@/lib/shared/components/table/DataTable";
import { TablePage } from "@/lib/shared/components/table/TablePage";
import { TableSheet } from "@/lib/shared/components/table/TableSheet";
import { TextInputFilter } from "@/lib/shared/components/tableFilters/TextInputFilter";
import { useTableControl } from "@/lib/shared/hooks/searchParams/useTableControl";

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
  const isOfflineFeatureEnabled = useIsOfflineFeatureEnabled();
  const { data: objectTypes } = useGetObjectTypes();

  const filterDefinitions = createFilterDefinitions(objectTypes);
  const paramStateProvider = useSearchParamStateProvider(
    filterDefinitions,
    true,
  );
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
  const gdprBannerQuery = useGetGdprValidationBannerQuery(
    ApiBusinessModule.Inspection,
  );
  const [{ data: procedures, isFetching }, { data: gdprBanner }] =
    useSuspenseQueries({
      queries: [
        getPendingFacilitiesQuery(facilityApi, filter),
        gdprBannerQuery,
      ],
    });

  useGdprValidationTasksAlert({
    banner: gdprBanner,
    businessModule: ApiBusinessModule.Inspection,
  });

  const tableControl = useTableControl({ serverSideSorting: true });
  const columns = createPendingFacilitiesColumns(
    handleViewIncidentsClick,
    openReviewFacilityDuplicateSidebar,
    openReviewInspectionDuplicateSidebar,
    isOfflineFeatureEnabled,
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
                <FilterButton {...filterSettings.filterButtonProps} />
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
          open={true}
          onClose={handleSidebarClosed}
          inspectionId={userActivity.inspectionId}
          facilityName={userActivity.facilityName}
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
      case "Number":
        break;
    }
  }

  return Object.fromEntries(filters);
}
