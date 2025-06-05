/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { DataTable, TablePage, TableSheet } from "@eshg/lib-employee-portal";
import { ApiGetProcedureDraftResponse } from "@eshg/medical-registry-api";

import { employeeChangeColumns } from "@/lib/businessModules/medicalRegistry/components/procedures/details/employees/EmployeeColumns";
import { TableTitle } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/TableTitle";

export function EmployeeChangeSection({
  procedure,
}: Readonly<{
  procedure: ApiGetProcedureDraftResponse;
}>) {
  const { employeeChanges } = procedure;
  if (employeeChanges.length === 0) {
    return null;
  }

  return (
    <TablePage>
      <TableSheet title={<TableTitle title="Mitarbeiter:innen" />}>
        <DataTable
          data={employeeChanges}
          columns={employeeChangeColumns()}
          minWidth={700}
        />
      </TableSheet>
    </TablePage>
  );
}
