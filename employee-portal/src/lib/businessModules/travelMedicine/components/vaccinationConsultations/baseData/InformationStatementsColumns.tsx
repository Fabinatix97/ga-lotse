/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiInformationStatement } from "@eshg/employee-portal-api/travelMedicine";
import { DeleteOutlined } from "@mui/icons-material";
import { ColumnHelper, createColumnHelper } from "@tanstack/react-table";

import { CitizenHasAnsweredStatusChip } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/informationStatements/CitizenHasAnsweredChip";
import { ActionsMenu } from "@/lib/shared/components/buttons/ActionsMenu";

const columnHelper: ColumnHelper<ApiInformationStatement> =
  createColumnHelper<ApiInformationStatement>();

export function informationStatementsColumns({
  isProcedureClosed,
  onDeleteInformationStatement,
}: Readonly<{
  isProcedureClosed: boolean;
  onDeleteInformationStatement: (informationStatementId: string) => void;
}>) {
  // todo switch back to old structure when having more than one entry in actions menu
  const columns = [
    columnHelper.accessor("title", {
      header: "Titel",
      cell: (props) => props.getValue(),
    }),
    columnHelper.accessor("citizenHasAnswered", {
      header: "Status",
      cell: (props) => (
        <CitizenHasAnsweredStatusChip
          value={props.getValue() ? "ANSWERED" : "NOT_ANSWERED"}
        />
      ),
    }),
  ];

  if (!isProcedureClosed) {
    return [
      ...columns,
      columnHelper.display({
        header: "Aktionen",
        cell: (props) => (
          <ActionsMenu
            actionItems={[
              {
                label: "Löschen",
                disabled: isProcedureClosed,
                color: "danger",
                startDecorator: <DeleteOutlined color="danger" />,
                onClick: () =>
                  onDeleteInformationStatement(props.row.original.id),
              },
            ]}
          />
        ),
        meta: {
          width: 96,
        },
      }),
    ];
  }

  return columns;
}
