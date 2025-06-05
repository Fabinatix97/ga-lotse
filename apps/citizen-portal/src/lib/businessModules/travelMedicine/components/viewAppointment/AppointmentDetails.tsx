/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiGetAppointmentDetailsResponse } from "@eshg/travel-medicine-api";

import { AppointmentDetailsAdditionalInformation } from "@/lib/businessModules/travelMedicine/components/viewAppointment/AppointmentDetailsAdditionalInformation";
import { AppointmentDetailsMetaInformation } from "@/lib/businessModules/travelMedicine/components/viewAppointment/AppointmentDetailsMetaInformation";
import { useTranslation } from "@/lib/i18n/client";
import {
  ContentSheet,
  ContentSheetTitle,
} from "@/lib/shared/components/layout/contentSheet";
import { GridColumnStack } from "@/lib/shared/components/layout/grid";

interface AppointmentDetailsProps {
  appointmentDetails: ApiGetAppointmentDetailsResponse;
}

export function AppointmentDetails(props: Readonly<AppointmentDetailsProps>) {
  const { t } = useTranslation(["travelMedicine/appointmentDetails"]);

  return (
    <GridColumnStack>
      <ContentSheet>
        <ContentSheetTitle>{t("title")}</ContentSheetTitle>
        <AppointmentDetailsMetaInformation
          appointmentDetails={props.appointmentDetails}
        />
      </ContentSheet>
      <AppointmentDetailsAdditionalInformation
        appointmentDetails={props.appointmentDetails}
      />
    </GridColumnStack>
  );
}
