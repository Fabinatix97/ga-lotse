/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { Box } from "@mui/joy";
import { createColumnHelper } from "@tanstack/react-table";

import { EvaluationTemplateFromRepository } from "@/lib/businessModules/statistics/api/models/evaluationTemplatesOverview";
import { useGetEvaluationTemplatesFromRepository } from "@/lib/businessModules/statistics/api/queries/useGetEvaluationTemplatesFromRepository";
import { NoSearchResults } from "@/lib/shared/components/NoSearchResult";
import { ActionsMenu } from "@/lib/shared/components/buttons/ActionsMenu";
import { DataTable } from "@/lib/shared/components/table/DataTable";
import { TablePage } from "@/lib/shared/components/table/TablePage";
import { TableSheet } from "@/lib/shared/components/table/TableSheet";

export function RepositoryEvaluationTemplatesOverview() {
  const evaluationTemplates = useGetEvaluationTemplatesFromRepository();

  return (
    <TablePage
      data-testid="repository-evaluation-templates-overview-table"
      fullHeight
    >
      <TableSheet>
        <DataTable
          data={evaluationTemplates}
          columns={evaluationTemplatesColumns()}
          wrapHeader
          wrapContent
          noDataComponent={() => (
            <Box flex={1} alignContent="center">
              <NoSearchResults info="Keine Vorlagen vorhanden" />
            </Box>
          )}
          sorting={{
            manualSorting: false,
            initialSorting: [
              {
                id: "createdAt",
                desc: true,
              },
            ],
          }}
        />
      </TableSheet>
    </TablePage>
  );
}

const columnHelper = createColumnHelper<EvaluationTemplateFromRepository>();

function evaluationTemplatesColumns() {
  const staticColumns = [
    columnHelper.accessor("name", {
      header: "Name",
      meta: { canNavigate: { parentRow: true } },
    }),
    columnHelper.accessor("dataSourceName", {
      header: "Datenquelle",
      meta: { canNavigate: { parentRow: true } },
    }),
    columnHelper.accessor("createdAt", {
      header: "Erstellt am",
      cell: (props) => formatDate(props.getValue()),
      meta: { canNavigate: { parentRow: true } },
    }),
  ];

  return [
    ...staticColumns,
    columnHelper.display({
      id: "actions",
      header: "Aktionen",
      enableSorting: false,
      cell: () => <ActionsMenu actionItems={[]} />,
      meta: {
        width: "6rem",
        cellStyle: "button",
      },
    }),
  ];
}
