/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Button, Stack } from "@mui/joy";
import Typography from "@mui/joy/Typography";
import { useRouter } from "next/navigation";

import { useTranslation } from "@/lib/i18n/client";
import { byBreakpoint } from "@/lib/shared/breakpoints";

export function NoAppointments({
  backButtonLocation,
}: Readonly<{
  backButtonLocation: string;
}>) {
  const { t } = useTranslation(["prostituteProtection/forms"]);
  const router = useRouter();

  return (
    <Stack
      direction="column"
      justifyContent="center"
      alignItems="center"
      spacing={2}
    >
      <Typography sx={{ fontWeight: "bold" }}>
        {t("appointment_calendar.no_appointments_available")}
      </Typography>
      <Typography>{t("appointment_calendar.try_later")}</Typography>
      <Button
        sx={{ width: byBreakpoint({ mobile: "100%", desktop: "35%" }) }}
        variant="solid"
        onClick={() => router.push(backButtonLocation)}
      >
        {t("appointment_calendar.back_to_overview")}
      </Button>
    </Stack>
  );
}
