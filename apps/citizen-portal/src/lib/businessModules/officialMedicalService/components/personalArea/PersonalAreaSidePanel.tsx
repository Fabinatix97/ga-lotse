/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  CakeOutlined,
  DifferenceOutlined,
  MedicalServicesOutlined,
  PersonOutlined,
} from "@mui/icons-material";
import { Button, Stack } from "@mui/joy";
import { isDefined } from "remeda";

import {
  InternalLinkButton,
  WithRequired,
  formatDate,
  formatPersonName,
} from "@eshg/lib-portal";
import {
  ApiBookingState,
  ApiGetCitizenProcedureDetailsResponse,
} from "@eshg/official-medical-service-api";

import { useCancelAppointmentByCitizen } from "@/lib/businessModules/officialMedicalService/api/mutations/citizenAuthApi";
import { useCitizenRoutes } from "@/lib/businessModules/officialMedicalService/shared/routes";
import { useTranslation } from "@/lib/i18n/client";
import { DetailsItem } from "@/lib/shared/components/DetailsItem";
import {
  ContentSheet,
  ContentSheetTitle,
} from "@/lib/shared/components/layout/contentSheet";
import { useAccessCodeParam } from "@/lib/shared/helpers/accessCode";
import { useConfirmationDialog } from "@/lib/shared/hooks/useConfirmationDialog";
import { useManualTranslation } from "@/lib/shared/hooks/useManualTranslation";

interface PersonalAreaSidePanelProps {
  procedure: ApiGetCitizenProcedureDetailsResponse;
}

export function PersonalAreaSidePanel({
  procedure,
}: PersonalAreaSidePanelProps) {
  const { t } = useTranslation(["officialMedicalService/personalArea"]);

  const concernName = useManualTranslation({
    de: procedure.concern.nameDe,
    en: procedure.concern.nameEn,
  });

  return (
    <ContentSheet data-testid="appointment-panel">
      <ContentSheetTitle>{t("overview.title")}</ContentSheetTitle>
      <Stack direction="column" gap={2}>
        <DetailsItem
          label={t("overview.name.title")}
          value={formatPersonName(procedure)}
          icon={<PersonOutlined />}
        />
        <DetailsItem
          label={t("overview.birthdate.title")}
          value={formatDate(procedure.dateOfBirth)}
          icon={<CakeOutlined />}
        />
        <DetailsItem
          label={t("overview.concern.title")}
          value={concernName}
          icon={<MedicalServicesOutlined />}
        />
        <DetailsItem
          label={t("overview.medicalOpinion.title")}
          value={t("overview.medicalOpinion.value", {
            context: procedure.medicalOpinionStatus,
          })}
          icon={<DifferenceOutlined />}
        />
        {isDefined(procedure.appointment) &&
          renderActions(
            procedure as WithRequired<
              ApiGetCitizenProcedureDetailsResponse,
              "appointment"
            >,
          )}
      </Stack>
    </ContentSheet>
  );
}

function renderActions(
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
    [ApiBookingState.Withdrawn]: null,
  }[procedureDetails.appointment.bookingState];
}

function BookedContent({ procedure }: PersonalAreaSidePanelProps) {
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
      {hasBookingsRemaining(procedure) && (
        <InternalLinkButton
          variant="solid"
          href={citizenRoutes.personalArea.rebook(accessCode)}
        >
          {t("overview.actions.booked.reschedule_appointment")}
        </InternalLinkButton>
      )}
      <Button
        variant="outlined"
        color="danger"
        sx={{ height: "40px" }}
        onClick={handleCancelAppointment}
      >
        {t("overview.actions.booked.cancel_appointment")}
      </Button>
    </>
  );
}

function CancelledContent({ procedure }: PersonalAreaSidePanelProps) {
  const { t } = useTranslation(["officialMedicalService/personalArea"]);
  const citizenRoutes = useCitizenRoutes();
  const accessCode = useAccessCodeParam();

  if (!hasBookingsRemaining(procedure)) {
    return null;
  }

  return (
    <InternalLinkButton
      variant="solid"
      href={citizenRoutes.personalArea.rebook(accessCode)}
      sx={{ height: "40px" }}
    >
      {t("overview.actions.cancelled.reschedule_appointment")}
    </InternalLinkButton>
  );
}

function BookableContent({ procedure }: PersonalAreaSidePanelProps) {
  const { t } = useTranslation(["officialMedicalService/personalArea"]);
  const citizenRoutes = useCitizenRoutes();
  const accessCode = useAccessCodeParam();

  if (!hasBookingsRemaining(procedure)) {
    return null;
  }

  return (
    <InternalLinkButton
      variant="solid"
      href={citizenRoutes.personalArea.rebook(accessCode)}
      sx={{ height: "40px" }}
    >
      {t("overview.actions.bookable.book_appointment")}
    </InternalLinkButton>
  );
}

function hasBookingsRemaining(
  procedure: ApiGetCitizenProcedureDetailsResponse,
): boolean {
  const bookingsRemaining = procedure.appointment?.bookingsRemaining;
  return bookingsRemaining !== undefined && bookingsRemaining > 0;
}
