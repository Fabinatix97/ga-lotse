/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  type ApiBusinessModule,
  ApiGetAggregatedTasksResponse,
  ApiTask,
  type ApiTaskStatus,
  type ApiTaskType,
  ApiUser,
} from "@eshg/employee-portal-api/base";
import { formatPersonName } from "@eshg/lib-portal/formatters/person";
import { isDefined } from "remeda";

export interface Task {
  readonly assignedById?: string;
  readonly assignedByName: string;
  readonly assigneeId?: string;
  readonly assigneeByName: string;
  readonly businessModule: ApiBusinessModule;
  readonly createdAt: Date;
  readonly dueAt?: Date;
  readonly isOverdue: boolean;
  readonly modifiedAt: Date;
  readonly procedureId: string;
  readonly summary: string;
  readonly taskId: string;
  readonly taskStatus: ApiTaskStatus;
  readonly taskType: ApiTaskType;
}

export interface GetAggregatedTasksResponse {
  count: number;
  tasks: Task[];
  resolvedUsers: Record<string, ApiUser>;
}

export function mapResponse(
  response: ApiGetAggregatedTasksResponse,
): GetAggregatedTasksResponse {
  return {
    count: response.count,
    tasks: response.tasks.map((task) => mapTask(task, response.resolvedUsers)),
    resolvedUsers: response.resolvedUsers,
  };
}

function mapTask(task: ApiTask, resolvedUsers: Record<string, ApiUser>): Task {
  return {
    assignedById: task.assignedById,
    assignedByName: buildName(task.assignedById, resolvedUsers),
    assigneeId: task.assigneeId,
    assigneeByName: buildName(task.assigneeId, resolvedUsers),
    businessModule: task.businessModule,
    createdAt: task.createdAt,
    dueAt: task.dueAt,
    isOverdue: task.isOverdue,
    modifiedAt: task.modifiedAt,
    procedureId: task.procedureId,
    summary: task.summary,
    taskId: task.taskId,
    taskStatus: task.taskStatus,
    taskType: task.taskType,
  };
}

function buildName(
  userId: string | undefined,
  resolvedUsers: Record<string, ApiUser>,
): string {
  const DEFAULT_USER_NAME = "Unbekannter Benutzer";
  if (!isDefined(userId)) return DEFAULT_USER_NAME;

  const user = resolvedUsers[userId];
  return isDefined(user) ? formatPersonName(user) : DEFAULT_USER_NAME;
}
