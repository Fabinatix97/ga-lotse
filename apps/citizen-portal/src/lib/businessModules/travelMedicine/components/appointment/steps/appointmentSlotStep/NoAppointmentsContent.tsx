/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import Button from "@mui/joy/Button";
import Typography from "@mui/joy/Typography";

import { useTranslation } from "@/lib/i18n/client";
import { useScopedRouter } from "@/lib/shared/components/scopedLinks";

export function NoAppointmentsContent({
  backButtonLocation,
}: Readonly<{
  backButtonLocation: string;
}>) {
  const { t } = useTranslation(["travelMedicine/forms"]);
  const router = useScopedRouter();

  return (
    <>
      <Typography sx={{ fontWeight: "bold" }}>
        {t(
          "appointmentSlotFormContent.appointmentPicker.noAppointmentsAvailable",
        )}
      </Typography>
      <Typography>
        {t("appointmentSlotFormContent.appointmentPicker.tryLater")}
      </Typography>
      <Button
        sx={{ width: "20%" }}
        variant="solid"
        onClick={() => router.push(backButtonLocation)}
      >
        {t("appointmentSlotFormContent.backToOverview")}
      </Button>
    </>
  );
}
