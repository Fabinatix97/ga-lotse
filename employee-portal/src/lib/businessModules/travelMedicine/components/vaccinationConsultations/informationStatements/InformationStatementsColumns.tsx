/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiInformationStatement } from "@eshg/employee-portal-api/travelMedicine";
import {
  DeleteOutlined,
  Replay,
  TextSnippetOutlined,
} from "@mui/icons-material";
import { ColumnHelper, createColumnHelper } from "@tanstack/react-table";

import { CitizenHasAnsweredStatusChip } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/informationStatements/CitizenHasAnsweredChip";
import {
  ActionsItem,
  ActionsMenu,
} from "@/lib/shared/components/buttons/ActionsMenu";

const columnHelper: ColumnHelper<ApiInformationStatement> =
  createColumnHelper<ApiInformationStatement>();

export function informationStatementsColumns({
  isProcedureClosed,
  onResetInformationStatement,
  onDeleteInformationStatement,
  onGetInformationStatementPdf,
}: Readonly<{
  isProcedureClosed: boolean;
  onResetInformationStatement: (informationStatementId: string) => void;
  onDeleteInformationStatement: (informationStatementId: string) => void;
  onGetInformationStatementPdf: (
    informationStatementId: string,
  ) => Promise<void>;
}>) {
  function renderActionButtons(informationStatement: ApiInformationStatement) {
    const actionItems: ActionsItem[] = [];

    actionItems.push({
      label: "PDF herunterladen",
      startDecorator: <TextSnippetOutlined />,
      onClick: async () =>
        await onGetInformationStatementPdf(informationStatement.id),
    });

    if (!isProcedureClosed && informationStatement.citizenHasAnswered) {
      actionItems.push({
        label: "Aufklärungsbogen zurücksetzen",
        startDecorator: <Replay />,
        onClick: () => onResetInformationStatement(informationStatement.id),
      });
    }

    if (!isProcedureClosed) {
      actionItems.push({
        label: "Löschen",
        color: "danger",
        startDecorator: <DeleteOutlined color="danger" />,
        onClick: () => onDeleteInformationStatement(informationStatement.id),
      });
    }

    return actionItems;
  }

  return [
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
    columnHelper.display({
      header: "Aktionen",
      cell: (props) => (
        <ActionsMenu
          actionItems={renderActionButtons(props.cell.row.original)}
        />
      ),
      meta: {
        width: 96,
      },
    }),
  ];
}
