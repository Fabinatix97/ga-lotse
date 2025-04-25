/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { DateRangeOutlined } from "@mui/icons-material";
import { Sheet, Stack, Typography } from "@mui/joy";
import { useTranslation } from "react-i18next";

import { Row } from "@eshg/lib-portal/components/Row";
import { InternalLinkButton } from "@eshg/lib-portal/components/navigation/InternalLinkButton";
import { ApiConcern } from "@eshg/sti-protection-api";

import { useConcernedCitizenRoutes } from "@/lib/businessModules/stiProtection/shared/routes";
import { PageTitle } from "@/lib/shared/components/layout/page";

export function NoAppointmentAvailable({ concern }: { concern: ApiConcern }) {
  const { t } = useTranslation("stiProtection/forms");
  const routes = useConcernedCitizenRoutes(concern);

  return (
    <Stack gap={3}>
      <PageTitle>
        <Row justifyContent="space-between">
          {t("common.appointment_booking_title")}
        </Row>
      </PageTitle>
      <Sheet>
        <Stack gap={3} sx={{ padding: 3, alignItems: "center" }}>
          <Typography level="h2" sx={{ alignSelf: "start" }}>
            {t(`time_slot.title`)}
          </Typography>
          <DateRangeOutlined
            sx={(theme) => ({
              height: theme.spacing(10),
              width: theme.spacing(10),
              color: theme.palette.primary.outlinedBorder,
            })}
          />
          <Typography level="title-md">
            {t("time_slot.no_appointments_available")}
          </Typography>
          <Typography
            sx={(theme) => ({
              maxWidth: theme.spacing(80),
            })}
          >
            {t("time_slot.try_later")}
          </Typography>
          <InternalLinkButton
            href={routes.concernPath.index}
            size="lg"
            sx={(theme) => ({
              maxWidth: theme.spacing(44),
              width: "100%",
              minWidth: "min-content",
            })}
          >
            {t("base/translations:common.back")}
          </InternalLinkButton>
        </Stack>
      </Sheet>
    </Stack>
  );
}
