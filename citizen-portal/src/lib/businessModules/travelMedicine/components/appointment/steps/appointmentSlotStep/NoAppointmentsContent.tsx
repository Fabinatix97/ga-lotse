/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import Button from "@mui/joy/Button";
import Typography from "@mui/joy/Typography";
import { useRouter } from "next/navigation";

import { useCitizenRoutes } from "@/lib/businessModules/travelMedicine/shared/routes";
import { useTranslation } from "@/lib/i18n/client";

export function NoAppointmentsContent() {
  const { t } = useTranslation(["travelMedicine/forms"]);
  const router = useRouter();
  const citizenRoutes = useCitizenRoutes();

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
        onClick={() => router.push(citizenRoutes.overview)}
      >
        {t("appointmentSlotFormContent.backToOverview")}
      </Button>
    </>
  );
}
