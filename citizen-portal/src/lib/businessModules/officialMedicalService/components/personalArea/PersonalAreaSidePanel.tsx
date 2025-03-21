/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { InternalLinkButton } from "@eshg/lib-portal/components/navigation/InternalLinkButton";
import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { formatPersonName } from "@eshg/lib-portal/formatters/person";
import { WithRequired } from "@eshg/lib-portal/types/utility";
import {
  ApiBookingState,
  ApiGetCitizenProcedureDetailsResponse,
} from "@eshg/official-medical-service-api";
import {
  CakeOutlined,
  MedicalServicesOutlined,
  PersonOutlined,
} from "@mui/icons-material";
import { Button, Stack } from "@mui/joy";
import { isDefined } from "remeda";

import { useCancelAppointmentByCitizen } from "@/lib/businessModules/officialMedicalService/api/mutations/citizenAuthApi";
import { useCitizenRoutes } from "@/lib/businessModules/officialMedicalService/shared/routes";
import { useManualTranslation } from "@/lib/businessModules/officialMedicalService/shared/useManualTranslation";
import { useTranslation } from "@/lib/i18n/client";
import { DetailsItem } from "@/lib/shared/components/DetailsItem";
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
  const { t } = useTranslation(["officialMedicalService/personalArea"]);

  const concernName = useManualTranslation({
    de: procedure.concern.nameDe,
    en: procedure.concern.nameEn,
  });

  return (
    <ContentSheet data-testid={"appointment-panel"}>
      <ContentSheetTitle>{t("overview.title")}</ContentSheetTitle>
      <Stack direction="column" gap={2}>
        <DetailsItem
          label={t("overview.name_section.title")}
          value={formatPersonName(procedure)}
          icon={<PersonOutlined />}
        />
        <DetailsItem
          label={t("overview.birthdate_section.title")}
          value={formatDate(procedure.dateOfBirth)}
          icon={<CakeOutlined />}
        />
        <DetailsItem
          label={t("overview.concern_section.title")}
          value={concernName}
          icon={<MedicalServicesOutlined />}
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
    [ApiBookingState.Withdrawn]: <></>,
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
      {isDefined(procedure.appointment?.bookingsRemaining) &&
        procedure.appointment?.bookingsRemaining > 0 && (
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

  return (
    <>
      {isDefined(procedure.appointment?.bookingsRemaining) &&
        procedure.appointment?.bookingsRemaining > 0 && (
          <InternalLinkButton
            variant="solid"
            href={citizenRoutes.personalArea.rebook(accessCode)}
          >
            {t("overview.actions.cancelled.reschedule_appointment")}
          </InternalLinkButton>
        )}
    </>
  );
}

function BookableContent({ procedure }: PersonalAreaSidePanelProps) {
  const { t } = useTranslation(["officialMedicalService/personalArea"]);
  const citizenRoutes = useCitizenRoutes();
  const accessCode = useAccessCodeParam();

  return (
    <>
      {isDefined(procedure.appointment?.bookingsRemaining) &&
        procedure.appointment?.bookingsRemaining > 0 && (
          <InternalLinkButton
            variant="solid"
            href={citizenRoutes.personalArea.rebook(accessCode)}
          >
            {t("overview.actions.bookable.book_appointment")}
          </InternalLinkButton>
        )}
    </>
  );
}
