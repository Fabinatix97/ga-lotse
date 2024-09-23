/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiInformationStatement } from "@eshg/employee-portal-api/travelMedicine";
import { ReactNode } from "react";

import { useDeleteInformationStatement } from "@/lib/businessModules/travelMedicine/api/mutations/vaccinationConsultation";
import { vaccinationConsultationInformationStatementsColumns } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/VaccinationConsultationInformationStatementsColumns";
import { DataTable } from "@/lib/shared/components/table/DataTable";
import { TablePage } from "@/lib/shared/components/table/TablePage";
import { TableSheet } from "@/lib/shared/components/table/TableSheet";

export function VaccinationConsultationInformationStatementsTable({
  procedureId,
  isProcedureClosed,
  data,
  title,
  footer,
}: Readonly<{
  procedureId: string;
  isProcedureClosed: boolean;
  data: ApiInformationStatement[];
  title: ReactNode;
  footer: ReactNode;
}>) {
  const deleteInformationStatementApi = useDeleteInformationStatement();

  function deleteInformationStatement(
    procedureId: string,
    informationStatementId: string,
  ) {
    return deleteInformationStatementApi.mutate({
      procedureId,
      informationStatementId,
    });
  }

  return (
    <TablePage data-testid="vc-information-statements">
      <TableSheet title={title} footer={footer} hideTable={data.length === 0}>
        <DataTable
          data={data}
          columns={vaccinationConsultationInformationStatementsColumns(
            procedureId,
            isProcedureClosed,
            deleteInformationStatement,
          )}
        />
      </TableSheet>
    </TablePage>
  );
}
