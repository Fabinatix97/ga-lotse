/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Alert } from "@eshg/lib-portal";
import {
  ApiAppointmentBookingType,
  ApiGetAppointmentDetailsResponse,
} from "@eshg/travel-medicine-api";

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

  function isCancelled() {
    return (
      props.appointmentDetails.summaryDto.appointmentBookingType ===
      ApiAppointmentBookingType.Cancelled
    );
  }

  return (
    <GridColumnStack>
      <ContentSheet>
        <ContentSheetTitle>{t("title")}</ContentSheetTitle>
        {isCancelled() && (
          <Alert
            title={t("cancelled_header")}
            message={t("cancelled_message")}
            color="danger"
          />
        )}
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
