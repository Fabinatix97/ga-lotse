/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiGetAppointmentDetailsResponse } from "@eshg/citizen-portal-api/travelMedicine";

import { AppointmentDetailsAdditionalInformation } from "@/lib/businessModules/travelMedicine/components/viewAppointment/AppointmentDetailsAdditionalInformation";
import { AppointmentDetailsMetaInformation } from "@/lib/businessModules/travelMedicine/components/viewAppointment/AppointmentDetailsMetaInformation";
import { useTranslation } from "@/lib/i18n/client";
import {
  ContentSheet,
  ContentSheetTitle,
} from "@/lib/shared/components/layout/contentSheet";
import { GridColumnStack } from "@/lib/shared/components/layout/grid";

export function AppointmentDetails({
  appointmentDetails,
}: Readonly<{
  appointmentDetails: ApiGetAppointmentDetailsResponse;
}>) {
  const { t } = useTranslation(["travelMedicine/appointmentDetails"]);

  return (
    <GridColumnStack>
      <ContentSheet>
        <ContentSheetTitle>{t("title")}</ContentSheetTitle>
        <AppointmentDetailsMetaInformation
          appointmentDetails={appointmentDetails}
        />
      </ContentSheet>
      <AppointmentDetailsAdditionalInformation
        appointmentDetails={appointmentDetails}
      />
    </GridColumnStack>
  );
}
