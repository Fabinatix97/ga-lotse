/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ReadonlyURLSearchParams } from "next/navigation";

import {
  ApiBusinessModule,
  ApiTaskStatus,
  ApiTaskType,
  ApiUser,
} from "@eshg/base-api";
import {
  buildOptionFromUser,
  buildOptionsFromUsers,
} from "@eshg/lib-employee-portal";

import {
  businessModuleNames,
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

export function buildRouteWithParams(
  route: string,
  queryParams: ReadonlyURLSearchParams,
) {
  return queryParams.size === 0 ? route : `${route}?${queryParams.toString()}`;
}
