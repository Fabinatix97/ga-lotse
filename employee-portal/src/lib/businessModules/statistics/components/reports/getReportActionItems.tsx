/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Delete, Download, Edit, Share } from "@mui/icons-material";
import { isDefined } from "remeda";

import { ReportDataType } from "@/lib/businessModules/statistics/api/models/evaluationReports";
import { ActionsItem } from "@/lib/shared/components/buttons/ActionsMenu";

type OptionalActionItem =
  | { type: "share"; action: () => Promise<void> }
  | { type: "update"; action: () => void }
  | { type: "export"; action: () => Promise<void> };

export interface DeleteReportOrSeries {
  deleteReportWithConfirmation: (reportId: string) => void;
  deleteReportSeriesWithConfirmation: (reportId: string) => void;
  seriesId: string;
  reportId: string;
}
export interface DeleteReport {
  deleteReportWithConfirmation: (id: string) => void;
  reportId: string;
}

export function getReportActionItems(
  optionalActionitems: OptionalActionItem[],
  type: ReportDataType,
  deleteActions: DeleteReportOrSeries | DeleteReport,
  canWrite: boolean,
  canDelete: boolean,
  disabled: boolean,
): ActionsItem[] {
  function concatOptionalActionItem(
    itemName: OptionalActionItem["type"],
    actionsItem: Omit<ActionsItem, "onClick">,
    typeChecked = true,
  ) {
    const foundItem = optionalActionitems.find(
      (item) => item.type === itemName,
    );
    return !!typeChecked && foundItem
      ? {
          ...actionsItem,
          onClick: foundItem.action,
          disabled,
        }
      : undefined;
  }

  return [
    concatOptionalActionItem(
      "update",
      {
        label:
          type === ReportDataType.Single
            ? "Report bearbeiten"
            : "Serie bearbeiten",
        startDecorator: <Edit />,
      },
      type !== ReportDataType.Child && canWrite,
    ),
    concatOptionalActionItem(
      "share",
      {
        label: "Teilen",
        startDecorator: <Share />,
      },
      type !== ReportDataType.Series,
    ),
    concatOptionalActionItem(
      "export",
      {
        label: "Daten exportieren",
        startDecorator: <Download />,
      },
      type !== ReportDataType.Series,
    ),
    canDelete
      ? type === ReportDataType.Series && "seriesId" in deleteActions
        ? ({
            label: "Serie löschen",
            onClick: () => {
              deleteActions.deleteReportSeriesWithConfirmation(
                deleteActions.seriesId,
              );
            },
            startDecorator: <Delete />,
            disabled,
            color: "danger",
          } as const)
        : ({
            label: "Report löschen",
            onClick: () => {
              deleteActions.deleteReportWithConfirmation(
                deleteActions.reportId,
              );
            },
            startDecorator: <Delete />,
            disabled,
            color: "danger",
          } as const)
      : undefined,
  ].filter(isDefined);
}
