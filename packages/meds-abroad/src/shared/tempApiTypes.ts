/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

export const ApiProcedureStatus = {
  Draft: "DRAFT",
  Open: "OPEN",
  InProgress: "IN_PROGRESS",
  Closed: "CLOSED",
  Aborted: "ABORTED",
} as const;
export type ApiProcedureStatus =
  (typeof ApiProcedureStatus)[keyof typeof ApiProcedureStatus];

export interface ApiPerson {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
}

export interface ApiMedsAbroadProcedureOverview {
  appointmentStart?: Date;
  createdAt: Date;
  id: string;
  status: ApiProcedureStatus;
  person: ApiPerson;
  isPayed?: boolean;
}
