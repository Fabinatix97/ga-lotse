/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Button, Stack } from "@mui/joy";
import { useRouter } from "next/navigation";

import { useCitizenRoutes } from "@/lib/businessModules/travelMedicine/shared/routes";
import { useTranslation } from "@/lib/i18n/client";
import {
  ContentSheet,
  ContentSheetTitle,
} from "@/lib/shared/components/layout/contentSheet";
import { useAccessCodeParam } from "@/lib/shared/helpers/accessCode";

export function AppointmentDetailsSidePanel({
  hasAccomplishedService,
}: Readonly<{
  hasAccomplishedService: boolean;
}>) {
  const router = useRouter();
  const citizenRoutes = useCitizenRoutes();
  const accessCode = useAccessCodeParam();
  const { t } = useTranslation(["travelMedicine/appointmentDetails"]);

  return (
    <ContentSheet>
      <Stack gap={"16px"}>
        {!hasAccomplishedService && (
          <>
            <ContentSheetTitle sx={{ paddingBottom: "8px" }}>
              {t("sidePanel.title")}
            </ContentSheetTitle>
            <Button color="primary" variant="outlined" type="submit">
              {t("sidePanel.postponeAppointment")}
            </Button>
            <Button color="danger" variant="outlined" type="submit">
              {t("sidePanel.cancelAppointment")}
            </Button>
          </>
        )}
        <Button
          color="neutral"
          variant="soft"
          type="submit"
          onClick={() =>
            router.push(citizenRoutes.viewAppointment.index(accessCode))
          }
        >
          {t("sidePanel.back")}
        </Button>
      </Stack>
    </ContentSheet>
  );
}
