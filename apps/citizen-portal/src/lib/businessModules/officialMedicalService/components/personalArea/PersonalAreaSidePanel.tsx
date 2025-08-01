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
  DetailsColumn,
  DetailsList,
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
import { byBreakpoint } from "@/lib/shared/breakpoints";
import { DetailsItem } from "@/lib/shared/components/DetailsItem";
import {
  ContentSheet,
  ContentSheetTitle,
} from "@/lib/shared/components/layout/contentSheet";
import { ScopedInternalLinkButton } from "@/lib/shared/components/scopedLinks";
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
      <DetailsList data-testid="overview-summary">
        <DetailsColumn sx={{ gap: byBreakpoint({ mobile: 1, desktop: 2 }) }}>
          <DetailsItem
            label={t("overview.name.title")}
            value={formatPersonName(procedure)}
            icon={<PersonOutlined />}
            hiddenLabel
          />
          <DetailsItem
            label={t("overview.birthdate.title")}
            value={formatDate(procedure.dateOfBirth)}
            icon={<CakeOutlined />}
            hiddenLabel
          />
          <DetailsItem
            label={t("overview.concern.title")}
            value={concernName}
            icon={<MedicalServicesOutlined />}
            hiddenLabel
          />
          <DetailsItem
            label={t("overview.medicalOpinion.title")}
            value={t("overview.medicalOpinion.value", {
              context: procedure.medicalOpinionStatus,
            })}
            icon={<DifferenceOutlined />}
            hiddenLabel
          />
        </DetailsColumn>
      </DetailsList>
      {isDefined(procedure.appointment) && (
        <Stack gap={2}>
          {renderActions(
            procedure as WithRequired<
              ApiGetCitizenProcedureDetailsResponse,
              "appointment"
            >,
          )}
        </Stack>
      )}
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
        <ScopedInternalLinkButton
          variant="solid"
          href={citizenRoutes.personalArea.rebook(accessCode)}
        >
          {t("overview.actions.booked.reschedule_appointment")}
        </ScopedInternalLinkButton>
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
    <ScopedInternalLinkButton
      variant="solid"
      href={citizenRoutes.personalArea.rebook(accessCode)}
      sx={{ height: "40px" }}
    >
      {t("overview.actions.cancelled.reschedule_appointment")}
    </ScopedInternalLinkButton>
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
    <ScopedInternalLinkButton
      variant="solid"
      href={citizenRoutes.personalArea.rebook(accessCode)}
      sx={{ height: "40px" }}
    >
      {t("overview.actions.bookable.book_appointment")}
    </ScopedInternalLinkButton>
  );
}

function hasBookingsRemaining(
  procedure: ApiGetCitizenProcedureDetailsResponse,
): boolean {
  const bookingsRemaining = procedure.appointment?.bookingsRemaining;
  return bookingsRemaining !== undefined && bookingsRemaining > 0;
}
