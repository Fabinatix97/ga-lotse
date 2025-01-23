/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Alert } from "@eshg/lib-portal/components/Alert";
import { List, ListItem, Typography } from "@mui/joy";
import { Trans } from "react-i18next";

import {
  FormSheet,
  FormSheetTitle,
} from "@/lib/businessModules/travelMedicine/components/shared/components/FormSheet";
import { useTranslation } from "@/lib/i18n/client";

export function AppointmentInfoSection() {
  const { t, i18n } = useTranslation(["travelMedicine/forms"]);

  return (
    <FormSheet data-testid="information-content-form">
      <FormSheetTitle>{t("appointmentInfoSection.title")}</FormSheetTitle>
      <Alert
        title={t("appointmentInfoSection.alertHeader")}
        color={"primary"}
        message={t("appointmentInfoSection.alertMessage")}
      />
      <Typography>
        <Trans
          i18nKey="appointmentInfoSection.infoText"
          ns="travelMedicine/forms"
          i18n={i18n}
          components={{
            t1: <Typography level="body-md" fontWeight="bold" />,
          }}
        />
      </Typography>
      <Typography>
        {t("appointmentInfoSection.requiredDocumentsHeader")}
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
        <ListItem>{t("appointmentInfoSection.listItemIdCard")}</ListItem>
        <ListItem>
          {t("appointmentInfoSection.listItemVaccinationCard")}
        </ListItem>
      </List>
      <Typography>
        {t("appointmentInfoSection.closingGreeting")} <br />{" "}
        {t("appointmentInfoSection.healthDepartment")}
      </Typography>
    </FormSheet>
  );
}
