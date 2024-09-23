/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { Button } from "@mui/joy";
import { useRouter } from "next/navigation";

import { useDeleteInformationStatementTemplate } from "@/lib/businessModules/travelMedicine/api/mutations/informationStatementTemplateApi";
import { useGetAllInformationStatementTemplates } from "@/lib/businessModules/travelMedicine/api/queries/informationStatementTemplateApi";
import { informationStatementColumns } from "@/lib/businessModules/travelMedicine/components/templates/informationStatement/columns";
import { routes } from "@/lib/businessModules/travelMedicine/shared/routes";
import { ButtonBar } from "@/lib/shared/components/buttons/ButtonBar";
import { DataTable } from "@/lib/shared/components/table/DataTable";
import { TablePage } from "@/lib/shared/components/table/TablePage";
import { TableSheet } from "@/lib/shared/components/table/TableSheet";

export function InformationStatementTemplateOverviewTable() {
  const router = useRouter();
  const data = useGetAllInformationStatementTemplates().data;

  const deleteInformationStatementTemplate =
    useDeleteInformationStatementTemplate();

  async function deleteEntry(entryId: string) {
    await deleteInformationStatementTemplate.mutateAsync(entryId).catch();
  }

  return (
    <TablePage
      controls={
        <ButtonBar
          right={
            <Button
              startDecorator={<AddOutlinedIcon />}
              onClick={() =>
                router.push(routes.informationStatementTemplates.new)
              }
            >
              Aufklärungsbogen hinzufügen
            </Button>
          }
        />
      }
      data-testid="table-information-statement-templates"
    >
      <TableSheet>
        <DataTable
          data={data}
          columns={informationStatementColumns(deleteEntry)}
          rowNavRoute={(row) =>
            routes.informationStatementTemplates.details(row.original.id)
          }
          focusColumnHeader="name"
        />
      </TableSheet>
    </TablePage>
  );
}
