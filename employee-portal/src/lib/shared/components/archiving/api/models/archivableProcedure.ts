/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ApiGetArchivableProceduresResponse,
  ApiProcedure,
} from "@eshg/employee-portal-api/businessProcedures";

export type ArchivableProcedure = ApiProcedure & { id: string };

interface GetArchivableProceduresResponse {
  procedures: ArchivableProcedure[];
  totalElements: number;
  totalPages: number;
}

export function mapArchivableProceduresResponse(
  response: ApiGetArchivableProceduresResponse,
): GetArchivableProceduresResponse {
  return {
    procedures: mapProcedures(response.procedures),
    totalElements: response.totalElements,
    totalPages: response.totalPages,
  };
}

function mapProcedures(procedures: ApiProcedure[]) {
  return procedures.map((procedure) => ({
    // Introduce id for row selection
    id: procedure.procedureId,
    ...procedure,
  }));
}
