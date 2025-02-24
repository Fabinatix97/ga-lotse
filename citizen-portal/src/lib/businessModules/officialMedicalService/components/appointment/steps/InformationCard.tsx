/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Alert } from "@eshg/lib-portal/components/Alert";
import { List, ListItem, Typography } from "@mui/joy";
import { Trans } from "react-i18next";

import { FormSheetTitle } from "@/lib/businessModules/travelMedicine/components/shared/components/FormSheet";
import { useTranslation } from "@/lib/i18n/client";
import { ContentSheet } from "@/lib/shared/components/layout/contentSheet";

export function InformationCard() {
  const { t, i18n } = useTranslation(["officialMedicalService/appointment"]);

  return (
    <ContentSheet data-testid={"information-card"}>
      <FormSheetTitle>{t("appointmentInformation.title")}</FormSheetTitle>
      <Alert
        color="primary"
        message={t("appointmentInformation.alertMessage")}
      />
      <Typography>
        <Trans
          i18nKey="appointmentInformation.infoText"
          ns="officialMedicalService/appointment"
          i18n={i18n}
          components={{
            t1: <Typography level="body-md" fontWeight="bold" />,
          }}
        />
      </Typography>
      <Typography>
        {t("appointmentInformation.requiredDocumentsHeader")}
      </Typography>
      <List
        marker="disc"
        sx={{
          "--List-gap:": "0.5px",
          "--ListItem-minHeight:": 0,
          "--ListItem-paddingY:": 0,
          "--ListDivider-gap:": 0,
          "--ListItem-paddingLeft:": 0,
          fontWeight: 700,
        }}
      >
        <ListItem>{t("appointmentInformation.listItemIdCard")}</ListItem>
        <ListItem>
          {t("appointmentInformation.listItemMedicalDocuments")}
        </ListItem>
        <ListItem>
          {t("appointmentInformation.listItemCurrentMedication")}
        </ListItem>
      </List>
      <Typography>
        <Trans
          i18nKey="appointmentInformation.closingGreeting"
          ns="officialMedicalService/appointment"
          i18n={i18n}
        />
      </Typography>
    </ContentSheet>
  );
}
