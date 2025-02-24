/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { InternalLinkButton } from "@eshg/lib-portal/components/navigation/InternalLinkButton";
import { DateRangeOutlined } from "@mui/icons-material";
import { Stack, Typography } from "@mui/joy";

import { useCitizenRoutes } from "@/lib/businessModules/officialMedicalService/shared/routes";
import { useTranslation } from "@/lib/i18n/client";
import { ContentSheet } from "@/lib/shared/components/layout/contentSheet";

export function NoAppointmentCard() {
  const { t } = useTranslation(["officialMedicalService/appointment"]);
  const citizenRoutes = useCitizenRoutes();

  return (
    <ContentSheet>
      <Typography level="h2">{t("appointment.title")}</Typography>
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={3}
        sx={{ padding: 2 }}
      >
        <DateRangeOutlined sx={{ fontSize: 70, color: "#94beff" }} />
        <Typography sx={{ fontWeight: "bold" }}>
          {t("appointment.appointmentPicker.noAppointmentsAvailable")}
        </Typography>
        <Typography>{t("appointment.appointmentPicker.tryLater")}</Typography>
        <InternalLinkButton variant="solid" href={citizenRoutes.overview}>
          {t("appointment.backToOverview")}
        </InternalLinkButton>
      </Stack>
    </ContentSheet>
  );
}
