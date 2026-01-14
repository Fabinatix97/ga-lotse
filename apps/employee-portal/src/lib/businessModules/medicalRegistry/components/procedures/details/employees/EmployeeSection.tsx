/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { DataTable, TablePage, TableSheet } from "@eshg/lib-employee-portal";
import { ApiGetProcedureConfirmedResponse } from "@eshg/medical-registry-api";

import { employeeColumns } from "@/lib/businessModules/medicalRegistry/components/procedures/details/employees/EmployeeColumns";
import { TableTitle } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/TableTitle";

export function EmployeeSection({
  procedure,
}: Readonly<{
  procedure: ApiGetProcedureConfirmedResponse;
}>) {
  const { employees } = procedure;
  if (employees.length === 0) {
    return null;
  }

  return (
    <TablePage>
      <TableSheet title={<TableTitle title="Angestellte Mitarbeiter:innen" />}>
        <DataTable
          data={employees}
          columns={employeeColumns()}
          minWidth={790}
        />
      </TableSheet>
    </TablePage>
  );
}
