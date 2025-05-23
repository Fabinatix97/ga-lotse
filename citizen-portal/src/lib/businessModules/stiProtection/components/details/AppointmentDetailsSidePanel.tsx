/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Button, Stack } from "@mui/joy";
import { useRouter } from "next/navigation";

import { InternalLinkButton, useSnackbar } from "@eshg/lib-portal";
import { ApiCitizenProcedure } from "@eshg/sti-protection-api";

import { useCancelBookedAppointment } from "@/lib/businessModules/stiProtection/api/mutations/citizenApi";
import { useFormData } from "@/lib/businessModules/stiProtection/components/appointment/AppointmentDataContext";
import { GoToChangePinCard } from "@/lib/businessModules/stiProtection/components/pin/GoToChangePinCard";
import { useConcernedCitizenRoutes } from "@/lib/businessModules/stiProtection/shared/routes";
import { useTranslation } from "@/lib/i18n/client";
import {
  ContentSheet,
  ContentSheetTitle,
} from "@/lib/shared/components/layout/contentSheet";
import { ColumnGridSidePanel } from "@/lib/shared/components/layout/grid";
import { useConfirmationDialog } from "@/lib/shared/hooks/useConfirmationDialog";

import { GoToResultsStatusCard } from "./GoToResultsStatusCard";

const keycloakLogoutHref = "/logout/keycloak";

export function AppointmentDetailsSidePanel() {
  const { t } = useTranslation(["stiProtection/appointmentInfo"]);
  const { openCancelDialog } = useConfirmationDialog();
  const [{ procedure }] = useFormData<{ procedure: ApiCitizenProcedure }>();
  const citizenRoutes = useConcernedCitizenRoutes(procedure.concern);
  const router = useRouter();
  const snackbar = useSnackbar();

  const hasAppointment = procedure.appointment != null;

  const cancelAppointment = useCancelBookedAppointment();

  function onCancel() {
    openCancelDialog({
      onConfirm: async () => {
        await cancelAppointment.mutateAsync(undefined, {
          onSuccess: () => {
            router.push(keycloakLogoutHref);
          },
          onError: () => {
            snackbar.error(t("cancel_dialog.error"));
          },
        });
      },
      title: t("cancel_dialog.title"),
      children: t("cancel_dialog.message"),
      cancelLabel: t("cancel_dialog.cancel"),
      confirmLabel: t("cancel_dialog.confirm"),
    });
  }

  return (
    <ColumnGridSidePanel>
      <ContentSheet>
        <ContentSheetTitle>{t("personal_area.title")}</ContentSheetTitle>
        <Stack gap={2}>
          {hasAppointment ? (
            <InternalLinkButton
              href={citizenRoutes.personalArea.rebook}
              variant="solid"
            >
              {t("personal_area.rebook_appointment")}
            </InternalLinkButton>
          ) : null}
          <InternalLinkButton
            href={citizenRoutes.personalArea.appointments}
            variant="outlined"
          >
            {t("personal_area.go_to_personal_area")}
          </InternalLinkButton>
          {hasAppointment ? (
            <Button variant="outlined" color="danger" onClick={onCancel}>
              {t("personal_area.cancel_appointment")}
            </Button>
          ) : null}
        </Stack>
      </ContentSheet>
      <GoToResultsStatusCard />
      <GoToChangePinCard />
    </ColumnGridSidePanel>
  );
}
