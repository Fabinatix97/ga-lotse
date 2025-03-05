/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiBookingState,
  ApiGetCitizenProcedureDetailsResponse,
} from "@eshg/official-medical-service-api";
import { Button, Stack } from "@mui/joy";
import { useSuspenseQueries } from "@tanstack/react-query";

import { useGetProcedureDetails } from "@/lib/businessModules/officialMedicalService/api/queries/citizenAuthApi";
import { useTranslation } from "@/lib/i18n/client";
import {
  ContentSheet,
  ContentSheetTitle,
} from "@/lib/shared/components/layout/contentSheet";

export function PersonalAreaSidePanel() {
  const [{ data: procedureDetails }] = useSuspenseQueries({
    queries: [useGetProcedureDetails()],
  });

  const Content = getContent(procedureDetails);

  return (
    <ContentSheet>
      <Content />
    </ContentSheet>
  );
}

function getContent(procedureDetails: ApiGetCitizenProcedureDetailsResponse) {
  return {
    [ApiBookingState.Bookable]: BookableContent,
    [ApiBookingState.Booked]: BookedContent,
    [ApiBookingState.Cancelled]: CancelledContent,
    [ApiBookingState.Withdrawn]: CancelledContent,
  }[procedureDetails.appointment?.bookingState ?? ApiBookingState.Bookable];
}

function BookedContent() {
  const { t } = useTranslation(["officialMedicalService/personalArea"]);

  return (
    <>
      <ContentSheetTitle>{t("side_panel.booked.title")}</ContentSheetTitle>
      <Stack direction="column" gap={2} data-testId="appointment-panel">
        <Button variant="solid">
          {t("side_panel.booked.reschedule_appointment")}
        </Button>
        <Button variant="outlined" color="danger">
          {t("side_panel.booked.cancel_appointment")}
        </Button>
      </Stack>
    </>
  );
}

function CancelledContent() {
  const { t } = useTranslation(["officialMedicalService/personalArea"]);

  return (
    <>
      <Button variant="solid">
        {t("side_panel.cancelled.reschedule_appointment")}
      </Button>
    </>
  );
}

function BookableContent() {
  const { t } = useTranslation(["officialMedicalService/personalArea"]);

  return (
    <>
      <Button variant="solid">
        {t("side_panel.bookable.book_appointment")}
      </Button>
    </>
  );
}
