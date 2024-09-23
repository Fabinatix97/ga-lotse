/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ApiBusinessModule,
  ApiProcedureType,
  ApiTaskStatus,
  ApiTaskType,
  ApiUser,
} from "@eshg/employee-portal-api/base";
import {
  ApiManualProgressEntryType,
  ApiProgressEntryClass,
} from "@eshg/employee-portal-api/businessProcedures";
import { ReadonlyURLSearchParams } from "next/navigation";

import { EnumFilterValue } from "@/lib/shared/components/filterSettings/models/EnumFilter";
import { FilterValue } from "@/lib/shared/components/filterSettings/models/FilterValue";
import {
  manualProgressEntryTypeNames,
  progressEntryClassTitles,
} from "@/lib/shared/components/procedures/progress-entries/constants";

import {
  businessModuleNames,
  procedureTypeNames,
  taskStatusNames,
  taskTypeNames,
} from "./constants";

function buildOptionFromBusinessModule(businessModule: ApiBusinessModule) {
  return { value: businessModule, label: businessModuleNames[businessModule] };
}

export function buildOptionsFromBusinessModules(
  businessModules: ApiBusinessModule[],
) {
  return businessModules.map(buildOptionFromBusinessModule);
}

function buildOptionFromProcedureType(procedureType: ApiProcedureType) {
  return { value: procedureType, label: procedureTypeNames[procedureType] };
}

export function buildOptionsFromProcedureTypes(
  procedureTypes: ApiProcedureType[],
) {
  return procedureTypes.map(buildOptionFromProcedureType);
}

function buildOptionFromTaskType(taskType: ApiTaskType) {
  return { value: taskType, label: taskTypeNames[taskType] };
}

export function buildOptionsFromTaskTypes(taskTypes: ApiTaskType[]) {
  return taskTypes.map(buildOptionFromTaskType);
}

export function buildOptionsFromTaskStatus() {
  return Object.values(ApiTaskStatus).map((v) => {
    return { label: taskStatusNames[v], value: v };
  });
}

export function buildAssignedByOptions(
  selfLeaders: ApiUser[],
  selfUser: ApiUser,
) {
  const isSelfUserIncluded = selfLeaders
    .map((user) => user.userId)
    .includes(selfUser.userId);
  const optionsFromSelfLeaders = buildOptionsFromUsers(selfLeaders);

  return isSelfUserIncluded
    ? optionsFromSelfLeaders
    : [...optionsFromSelfLeaders, buildOptionFromUser(selfUser)];
}

export function buildOptionsFromUsers(users: ApiUser[]) {
  return users.map(buildOptionFromUser);
}

function buildOptionFromUser(user: ApiUser) {
  return {
    label: `${user.firstName} ${user.lastName}`,
    value: user.userId,
  };
}

function buildOptionFromManualProgressEntryType(
  manualProgressEntryType: ApiManualProgressEntryType,
) {
  return {
    value: manualProgressEntryType,
    label: manualProgressEntryTypeNames[manualProgressEntryType],
  };
}

export function buildOptionsFromManualProgressEntryTypes() {
  return Object.values(ApiManualProgressEntryType).map(
    buildOptionFromManualProgressEntryType,
  );
}

function buildOptionFromProgressEntryClass(
  progressEntryClass: ApiProgressEntryClass,
) {
  return {
    value: progressEntryClass,
    label: progressEntryClassTitles[progressEntryClass],
  };
}

export function buildOptionsFromProgressEntryClasses() {
  return Object.values(ApiProgressEntryClass).map(
    buildOptionFromProgressEntryClass,
  );
}

export function buildOptionsFromRecord(optionEntries: Record<string, string>) {
  return Object.entries(optionEntries).map((optionEntry) => {
    return {
      label: optionEntry[1],
      value: optionEntry[0],
    };
  });
}

export function getSelectedFilterValues(
  filters: FilterValue[],
  ...key: string[]
) {
  return filters
    .filter((filterValue) => key.includes(filterValue.key))
    .map((filterValue) => filterValue as EnumFilterValue)
    .flatMap((filterValue) => filterValue.selectedValues);
}

export function buildRouteWithParams(
  route: string,
  queryParams: ReadonlyURLSearchParams,
) {
  return queryParams.size === 0 ? route : `${route}?${queryParams.toString()}`;
}
