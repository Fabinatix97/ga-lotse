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

import { routes } from "@/lib/businessModules/statistics/shared/routes";
import { ActionsItem } from "@/lib/shared/components/buttons/ActionsMenu";

type OptionalActionItem =
  | { type: "remember"; action: () => void }
  | { type: "subscribe"; action: () => void }
  | { type: "update"; action: () => void };

export function getReportActionItems(
  optionalActionitems: OptionalActionItem[],
  isSeries: boolean,
  seriesId: string,
  detailLinkId: string,
  share: (id: string) => Promise<void>,
  deleteReportWithConfirmation: (reportId: string) => void,
  canWrite: boolean,
  canDelete: boolean,
) {
  async function handleClickCopyAddress() {
    await share(
      new URL(
        routes.reports.details(detailLinkId).index,
        window.location.origin,
      ).href,
    );
  }

  function concatOptionalActionItem(
    itemName: OptionalActionItem["type"],
    actionsItem: Omit<ActionsItem, "onClick">,
  ) {
    const foundItem = optionalActionitems.find(
      (item) => item.type === itemName,
    );
    return !!foundItem
      ? {
          ...actionsItem,
          onClick: foundItem.action,
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
    {
      // TODO: Discuss and change after https://cronn-gmbh.atlassian.net/browse/ISSUE-5002
      label: "Teilen",
      onClick: handleClickCopyAddress,
      startDecorator: <Share />,
    },
    canWrite
      ? concatOptionalActionItem("update", {
          label: "Bearbeiten",
          startDecorator: <Edit />,
        })
      : undefined,
    canDelete
      ? {
          label: isSeries ? "Serie löschen" : "Report löschen",
          onClick: () => deleteReportWithConfirmation(seriesId),
          startDecorator: <Delete />,
          color: "danger",
        }
      : undefined,
  ].filter((it) => isDefined(it)) as ActionsItem[];
}
