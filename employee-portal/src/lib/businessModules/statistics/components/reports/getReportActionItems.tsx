/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  BookmarkAdd,
  Bookmarks,
  Delete,
  Edit,
  Share,
} from "@mui/icons-material";
import { isDefined } from "remeda";

import { ReportDataType } from "@/lib/businessModules/statistics/api/models/evaluationReports";
import { routes } from "@/lib/businessModules/statistics/shared/routes";
import { ActionsItem } from "@/lib/shared/components/buttons/ActionsMenu";

type OptionalActionItem =
  | { type: "remember"; action: () => void }
  | { type: "subscribe"; action: () => void }
  | { type: "share"; action: () => Promise<void> }
  | { type: "update"; action: () => void };

export function getSharedURL(detailLinkId: string) {
  return new URL(
    routes.reports.details(detailLinkId).index,
    window.location.origin,
  ).href;
}

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
) {
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
    concatOptionalActionItem("remember", {
      label: "Report merken",
      startDecorator: <BookmarkAdd />,
    }),
    concatOptionalActionItem("subscribe", {
      label: "Serie abonnieren",
      startDecorator: <Bookmarks />,
    }),
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
        // TODO: Discuss and change after https://cronn-gmbh.atlassian.net/browse/ISSUE-5002
        label: "Teilen",
        startDecorator: <Share />,
      },
      type !== ReportDataType.Series,
    ),
    canDelete
      ? type === ReportDataType.Series && "seriesId" in deleteActions
        ? {
            label: "Serie löschen",
            onClick: () => {
              deleteActions.deleteReportSeriesWithConfirmation(
                deleteActions.seriesId,
              );
            },
            startDecorator: <Delete />,
            disabled,
            color: "danger",
          }
        : {
            label: "Report löschen",
            onClick: () => {
              deleteActions.deleteReportWithConfirmation(
                deleteActions.reportId,
              );
            },
            startDecorator: <Delete />,
            disabled,
            color: "danger",
          }
      : undefined,
  ].filter((it) => isDefined(it)) as ActionsItem[];
}
