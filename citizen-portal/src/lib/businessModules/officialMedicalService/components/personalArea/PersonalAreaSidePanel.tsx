/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { InternalLinkButton } from "@eshg/lib-portal/components/navigation/InternalLinkButton";
import { WithRequired } from "@eshg/lib-portal/types/utility";
import {
  ApiBookingState,
  ApiGetCitizenProcedureDetailsResponse,
} from "@eshg/official-medical-service-api";
import { Button, Stack } from "@mui/joy";
import { isDefined } from "remeda";

import { useCancelAppointmentByCitizen } from "@/lib/businessModules/officialMedicalService/api/mutations/citizenAuthApi";
import { useCitizenRoutes } from "@/lib/businessModules/officialMedicalService/shared/routes";
import { useTranslation } from "@/lib/i18n/client";
import {
  ContentSheet,
  ContentSheetTitle,
} from "@/lib/shared/components/layout/contentSheet";
import { useAccessCodeParam } from "@/lib/shared/helpers/accessCode";
import { useConfirmationDialog } from "@/lib/shared/hooks/useConfirmationDialog";

interface PersonalAreaSidePanelProps {
  procedure: ApiGetCitizenProcedureDetailsResponse;
}

export function PersonalAreaSidePanel({
  procedure,
}: PersonalAreaSidePanelProps) {
  const isVisible =
    procedure.appointment &&
    ((procedure.appointment.bookingState !== ApiBookingState.Booked &&
      procedure.appointment.bookingsRemaining > 0) ||
      procedure.appointment.bookingState === ApiBookingState.Booked);

  if (!isVisible) {
    return;
  }

  return (
    <ContentSheet>
      {renderContent(
        procedure as WithRequired<
          ApiGetCitizenProcedureDetailsResponse,
          "appointment"
        >,
      )}
    </ContentSheet>
  );
}

interface ContentProps {
  procedure: ApiGetCitizenProcedureDetailsResponse;
}

function renderContent(
  procedureDetails: WithRequired<
    ApiGetCitizenProcedureDetailsResponse,
    "appointment"
  >,
) {
  return {
    [ApiBookingState.Bookable]: (
      <BookableContent procedure={procedureDetails} />
    ),
    [ApiBookingState.Booked]: <BookedContent procedure={procedureDetails} />,
    [ApiBookingState.Cancelled]: (
      <CancelledContent procedure={procedureDetails} />
    ),
    [ApiBookingState.Withdrawn]: <></>,
  }[procedureDetails.appointment.bookingState];
}

function BookedContent({ procedure }: ContentProps) {
  const { t } = useTranslation(["officialMedicalService/personalArea"]);
  const { openConfirmationDialog } = useConfirmationDialog();
  const cancelAppointment = useCancelAppointmentByCitizen();
  const citizenRoutes = useCitizenRoutes();
  const accessCode = useAccessCodeParam();

  function handleCancelAppointment() {
    openConfirmationDialog({
      onConfirm: async () => {
        await cancelAppointment.mutateAsync({
          appointmentId: procedure.appointment?.appointmentId ?? "",
        });
      },
      title: t("cancelAppointment.cancelModal.title"),
      description: t("cancelAppointment.cancelModal.description"),
      confirmLabel: t("cancelAppointment.cancelModal.confirmLabel"),
      cancelLabel: t("cancelAppointment.cancelModal.cancelLabel"),
      color: "danger",
    });
  }

  return (
    <>
      <ContentSheetTitle>{t("side_panel.booked.title")}</ContentSheetTitle>
      <Stack direction="column" gap={2} data-testId="appointment-panel">
        {isDefined(procedure.appointment?.bookingsRemaining) &&
          procedure.appointment?.bookingsRemaining > 0 && (
            <InternalLinkButton
              variant="solid"
              href={citizenRoutes.personalArea.rebook(accessCode)}
            >
              {t("side_panel.booked.reschedule_appointment")}
            </InternalLinkButton>
          )}
        <Button
          variant="outlined"
          color="danger"
          onClick={handleCancelAppointment}
        >
          {t("side_panel.booked.cancel_appointment")}
        </Button>
      </Stack>
    </>
  );
}

function CancelledContent({ procedure }: ContentProps) {
  const { t } = useTranslation(["officialMedicalService/personalArea"]);
  const citizenRoutes = useCitizenRoutes();
  const accessCode = useAccessCodeParam();

  return (
    <>
      <ContentSheetTitle>{t("side_panel.cancelled.title")}</ContentSheetTitle>
      {isDefined(procedure.appointment?.bookingsRemaining) &&
        procedure.appointment?.bookingsRemaining > 0 && (
          <InternalLinkButton
            variant="solid"
            href={citizenRoutes.personalArea.rebook(accessCode)}
          >
            {t("side_panel.cancelled.reschedule_appointment")}
          </InternalLinkButton>
        )}
    </>
  );
}

function BookableContent({ procedure }: ContentProps) {
  const { t } = useTranslation(["officialMedicalService/personalArea"]);
  const citizenRoutes = useCitizenRoutes();
  const accessCode = useAccessCodeParam();

  return (
    <>
      <ContentSheetTitle>{t("side_panel.bookable.title")}</ContentSheetTitle>
      {isDefined(procedure.appointment?.bookingsRemaining) &&
        procedure.appointment?.bookingsRemaining > 0 && (
          <InternalLinkButton
            variant="solid"
            href={citizenRoutes.personalArea.rebook(accessCode)}
          >
            {t("side_panel.bookable.book_appointment")}
          </InternalLinkButton>
        )}
    </>
  );
}
