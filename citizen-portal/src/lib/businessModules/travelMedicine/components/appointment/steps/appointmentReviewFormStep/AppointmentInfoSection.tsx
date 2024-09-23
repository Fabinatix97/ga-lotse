/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Alert } from "@eshg/lib-portal/components/Alert";
import { List, ListItem, Typography } from "@mui/joy";

import {
  FormSheet,
  FormSheetTitle,
} from "@/lib/businessModules/travelMedicine/components/shared/components/FormSheet";
import { useTranslation } from "@/lib/i18n/client";

export function AppointmentInfoSection() {
  const { t } = useTranslation(["travelMedicine/forms"]);

  return (
    <FormSheet>
      <FormSheetTitle>{t("appointmentInfoSection.title")}</FormSheetTitle>
      <Alert
        title={t("appointmentInfoSection.alertHeader")}
        color={"primary"}
        message={t("appointmentInfoSection.alertMessage")}
      />
      <Typography>
        Sie erhalten in
        <Typography level={"body-md"} fontWeight={"bold"}>
          {""} den nächsten Minuten{" "}
        </Typography>
        eine{" "}
        <Typography level={"body-md"} fontWeight={"bold"}>
          {""} Terminbestätigung{" "}
        </Typography>{" "}
        Terminbestätigung per E-Mail. Dort sind alle Informationen zum Termin
        enthalten. Sie haben zudem die Möglichkeit den Termin zu ändern oder zu
        stornieren
      </Typography>
      <Typography>
        Notwendige Dokumente, welche Sie bitte zum Termin mitbringen, sind:
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
        <ListItem>Personalausweis</ListItem>
        <ListItem>Impfpass</ListItem>
      </List>
      <Typography>
        Mit freundlichen Grüßen <br /> Ihr Gesundheitsamt
      </Typography>
    </FormSheet>
  );
}
