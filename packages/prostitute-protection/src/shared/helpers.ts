/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { isPast } from "date-fns";

import { ApiProcedureStatus } from "@eshg/base-api";

import { ApiProstituteProtectionProcedure } from "../mock";

export function validateDateTimeIsTodayOrFuture(value?: string) {
  if (value && isPast(value)) {
    return "Das Datum liegt in der Vergangenheit.";
  }

  return undefined;
}

export function isProcedureOpen(procedure: ApiProstituteProtectionProcedure) {
  return procedure.procedureStatus !== ApiProcedureStatus.Closed;
}

export function isProcedureClosed(procedure: ApiProstituteProtectionProcedure) {
  return !isProcedureOpen(procedure);
}

export function isProcedureAborted(
  procedure: ApiProstituteProtectionProcedure,
) {
  return procedure.procedureStatus === ApiProcedureStatus.Aborted;
}

export function isProcedureFinalized(
  procedure: ApiProstituteProtectionProcedure,
) {
  return (
    procedure.procedureStatus === ApiProcedureStatus.Closed ||
    procedure.procedureStatus === ApiProcedureStatus.Aborted
  );
}
