/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Dispatch, SetStateAction, startTransition } from "react";
import { isDefined } from "remeda";

import {
  ApiBusinessModule,
  ApiBusinessModuleFromJSON,
  ApiTaskStatusFromJSON,
  ApiTaskTypeFromJSON,
  ApiUser,
  ApiUserGroup,
} from "@eshg/base-api";
import {
  EnumFilterDefinition,
  EnumFilterValue,
  FilterValue,
  UseFilterSettings,
  UseTableControlResult,
  getSelectedEnumFilterValues,
  useFilterSettings,
} from "@eshg/lib-employee-portal";

import { AggregateTaskFilters } from "@/lib/baseModule/api/queries/tasks";
import { businessModuleUserGroups } from "@/lib/baseModule/moduleRegister/moduleUserGroupResolver";
import { taskTypes as inspectionTaskTypes } from "@/lib/businessModules/inspection/shared/constants";
import { taskTypes as measlesProtectionTaskTypes } from "@/lib/businessModules/measlesProtection/shared/constants";
import { taskTypes as schoolEntryTaskTypes } from "@/lib/businessModules/schoolEntry/shared/constants";
import { taskTypes as travelMedicineTaskTypes } from "@/lib/businessModules/travelMedicine/shared/constants";
import { businessModuleNames } from "@/lib/shared/components/procedures/constants";
import {
  buildAssignedByOptions,
  buildOptionsFromBusinessModules,
  buildOptionsFromTaskStatus,
  buildOptionsFromTaskTypes,
} from "@/lib/shared/components/procedures/helper";

export const FILTER_KEYS = {
  businessModule: "businessModule",
  taskTypeInspection: "taskTypeInspection",
  taskTypeSchoolEntry: "taskTypeSchoolEntry",
  taskTypeTravelMedicine: "taskTypeTravelMedicine",
  taskTypeMeaslesProtection: "taskTypeMeaslesProtection",
  assignedById: "assignedById",
  taskStatus: "taskStatus",
};

interface TaskTableFilterSettingsProps {
  user: ApiUser;
  groups: ApiUserGroup[];
  leaders: ApiUser[];
  initialFilterValues: EnumFilterValue[];
  tableControl: UseTableControlResult;
  onFilterApply: Dispatch<SetStateAction<AggregateTaskFilters>>;
}

export function useTaskTableFilterSettings({
  user,
  groups,
  leaders,
  initialFilterValues,
  tableControl,
  onFilterApply,
}: TaskTableFilterSettingsProps): UseFilterSettings {
  const groupNames = groups.map((group) => group.name);
  const selfGroupsBusinessModules = businessModuleUserGroups
    .filter((groups) => groupNames.includes(groups.group))
    .map((groups) => groups.businessModule)
    .filter(isDefined);

  function isGroupMember(businessModule: ApiBusinessModule) {
    return selfGroupsBusinessModules.includes(businessModule);
  }

  const filterDefinitions: EnumFilterDefinition[] = [
    ...(selfGroupsBusinessModules.length > 1
      ? ([
          {
            type: "Enum",
            key: FILTER_KEYS.businessModule,
            name: "Fachmodul",
            options: buildOptionsFromBusinessModules(selfGroupsBusinessModules),
          },
        ] as EnumFilterDefinition[])
      : []),
    ...(isGroupMember(ApiBusinessModule.Inspection)
      ? ([
          {
            type: "Enum",
            key: FILTER_KEYS.taskTypeInspection,
            name: getTaskTypeFilterName(ApiBusinessModule.Inspection),
            options: buildOptionsFromTaskTypes(inspectionTaskTypes),
          },
        ] as EnumFilterDefinition[])
      : []),
    ...(isGroupMember(ApiBusinessModule.SchoolEntry)
      ? ([
          {
            type: "Enum",
            key: FILTER_KEYS.taskTypeSchoolEntry,
            name: getTaskTypeFilterName(ApiBusinessModule.SchoolEntry),
            options: buildOptionsFromTaskTypes(schoolEntryTaskTypes),
          },
        ] as EnumFilterDefinition[])
      : []),
    ...(isGroupMember(ApiBusinessModule.TravelMedicine)
      ? ([
          {
            type: "Enum",
            key: FILTER_KEYS.taskTypeTravelMedicine,
            name: getTaskTypeFilterName(ApiBusinessModule.TravelMedicine),
            options: buildOptionsFromTaskTypes(travelMedicineTaskTypes),
          },
        ] as EnumFilterDefinition[])
      : []),
    ...(isGroupMember(ApiBusinessModule.MeaslesProtection)
      ? ([
          {
            type: "Enum",
            key: FILTER_KEYS.taskTypeMeaslesProtection,
            name: getTaskTypeFilterName(ApiBusinessModule.MeaslesProtection),
            options: buildOptionsFromTaskTypes(measlesProtectionTaskTypes),
          },
        ] as EnumFilterDefinition[])
      : []),
    ...(leaders.length > 0
      ? ([
          {
            type: "Enum",
            key: FILTER_KEYS.assignedById,
            name: "Zugewiesen von",
            options: buildAssignedByOptions(leaders, user),
          },
        ] as EnumFilterDefinition[])
      : []),
    {
      type: "Enum",
      key: FILTER_KEYS.taskStatus,
      name: "Status",
      options: buildOptionsFromTaskStatus(),
    },
  ];

  return useFilterSettings({
    definitions: filterDefinitions,
    initialValues: initialFilterValues,
    onValuesSubmit: (filters) => {
      startTransition(() => {
        onFilterApply({
          businessModule: getBusinessModuleFilters(filters),
          taskType: getTaskTypeFilters(filters),
          assignedById: getAssignedByIdFilter(filters),
          taskStatus: getTaskStatusFilter(filters),
        });
      });

      tableControl.setFilter([], true);
    },
    showSearch: false,
  });
}

function getTaskTypeFilterName(businessModule: ApiBusinessModule) {
  return `Aufgabentyp ${businessModuleNames[businessModule]}`;
}

function getBusinessModuleFilters(filters: FilterValue[]) {
  const selectedValues = getSelectedEnumFilterValues(
    filters,
    FILTER_KEYS.businessModule,
  ).map((v) => ApiBusinessModuleFromJSON(v));
  return selectedValues.length != 0 ? new Set(selectedValues) : undefined;
}

function getTaskTypeFilters(filters: FilterValue[]) {
  const selectedValues = getSelectedEnumFilterValues(
    filters,
    FILTER_KEYS.taskTypeInspection,
    FILTER_KEYS.taskTypeSchoolEntry,
    FILTER_KEYS.taskTypeTravelMedicine,
    FILTER_KEYS.taskTypeMeaslesProtection,
  ).map((v) => ApiTaskTypeFromJSON(v));

  return selectedValues.length != 0 ? new Set(selectedValues) : undefined;
}

function getAssignedByIdFilter(filters: FilterValue[]) {
  const selectedValues = getSelectedEnumFilterValues(
    filters,
    FILTER_KEYS.assignedById,
  );
  return selectedValues.length != 0 ? new Set(selectedValues) : undefined;
}

function getTaskStatusFilter(filters: FilterValue[]) {
  const selectedValues = getSelectedEnumFilterValues(
    filters,
    FILTER_KEYS.taskStatus,
  ).map((v) => ApiTaskStatusFromJSON(v));

  return selectedValues.length != 0 ? new Set(selectedValues) : undefined;
}
