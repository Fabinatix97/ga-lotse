/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { List, ListItem } from "@mui/joy";

import { useTranslation } from "@/lib/i18n/client";

export function ImportantInformationAlertList() {
  const { t } = useTranslation("infectionBriefing/forms");
  return (
    <List
      marker="disc"
      sx={{
        "--List-gap:": "0.5px",
        "--ListItem-minHeight:": 0,
        "--ListItem-paddingY:": 0,
        "--ListDivider-gap:": 0,
        "--ListItem-paddingLeft:": 0,
        fontWeight: 500,
      }}
    >
      <ListItem>{t("appointmentTypeFormContent.infoTextListItem1")}</ListItem>
      <ListItem>{t("appointmentTypeFormContent.infoTextListItem2")}</ListItem>
    </List>
  );
}
