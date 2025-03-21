/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { DataTable, TablePage, TableSheet } from "@eshg/lib-employee-portal";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { Button } from "@mui/joy";
import { useSuspenseQueries } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { useDeleteInformationStatementTemplate } from "@/lib/businessModules/travelMedicine/api/mutations/informationStatementTemplateApi";
import { useGetAllInformationStatementTemplatesQuery } from "@/lib/businessModules/travelMedicine/api/queries/informationStatementTemplateApi";
import { informationStatementColumns } from "@/lib/businessModules/travelMedicine/components/templates/informationStatement/columns";
import { routes } from "@/lib/businessModules/travelMedicine/shared/routes";
import { ButtonBar } from "@/lib/shared/components/buttons/ButtonBar";

export function InformationStatementTemplateOverviewTable() {
  const router = useRouter();
  const [{ data: allInformationStatementTemplates }] = useSuspenseQueries({
    queries: [useGetAllInformationStatementTemplatesQuery()],
  });

  const deleteInformationStatementTemplate =
    useDeleteInformationStatementTemplate();

  async function deleteEntry(entryId: string) {
    await deleteInformationStatementTemplate.mutateAsync(entryId);
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
          data={allInformationStatementTemplates}
          columns={informationStatementColumns(deleteEntry)}
          rowNavigation={{
            route: (row) =>
              routes.informationStatementTemplates.details(row.original.id),
            focusColumnAccessorKey: "name",
          }}
        />
      </TableSheet>
    </TablePage>
  );
}
