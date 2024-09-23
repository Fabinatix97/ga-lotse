/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiInformationStatement } from "@eshg/employee-portal-api/travelMedicine";
import { DeleteOutlined } from "@mui/icons-material";
import { ColumnHelper, createColumnHelper } from "@tanstack/react-table";

import { ActionsMenu } from "@/lib/shared/components/buttons/ActionsMenu";

const columnHelper: ColumnHelper<ApiInformationStatement> =
  createColumnHelper<ApiInformationStatement>();

export function vaccinationConsultationInformationStatementsColumns(
  procedureId: string,
  isProcedureClosed: boolean,
  deleteInformationStatement: (
    procedureId: string,
    informationStatementId: string,
  ) => void,
) {
  // todo switch back to old structure when having more than one entry in actions menu
  const columns = [
    columnHelper.accessor("title", {
      header: "Titel",
      cell: (props) => props.getValue(),
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
                  deleteInformationStatement(
                    procedureId,
                    props.row.original.id,
                  ),
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
