/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Button } from "@mui/joy";

import { Alert } from "@eshg/lib-portal";
import { ApiUserFlowType } from "@eshg/school-entry-api";

import { useStartUserFlowTracking } from "@/lib/businessModules/schoolEntry/api/mutations/userFlowTrackingApi";
import { useCitizenRoutes } from "@/lib/businessModules/schoolEntry/shared/routes";
import { useTranslation } from "@/lib/i18n/client";
import {
  ContentSheet,
  ContentSheetTitle,
} from "@/lib/shared/components/layout/contentSheet";
import { useScopedRouter } from "@/lib/shared/components/scopedLinks";
import { setUserFlowTrackingId } from "@/lib/shared/helpers/userFlowTracking.storage";

interface AppointmentSidePanelProps {
  isClosed: boolean;
  appointmentChangesByCitizenLeft: number;
  departmentPhoneNumber: string;
}

export function AppointmentSidePanel(props: AppointmentSidePanelProps) {
  const { t } = useTranslation(["schoolEntry/appointment"]);

  const citizenRoutes = useCitizenRoutes();
  const router = useScopedRouter();
  const startUserFlowTracking = useStartUserFlowTracking();

  function handleRescheduleClick() {
    startUserFlowTracking.mutate(
      { userFlowType: ApiUserFlowType.Rescheduling },
      {
        onSuccess: (response) => {
          setUserFlowTrackingId(response.userFlowTrackingId);
          router.push(citizenRoutes.appointment.updateAppointment);
        },
      },
    );
  }

  return (
    <ContentSheet>
      <ContentSheetTitle>{t("update.title")}</ContentSheetTitle>
      {props.appointmentChangesByCitizenLeft > 0 ? (
        <Button
          variant="outlined"
          disabled={props.isClosed || startUserFlowTracking.isPending}
          onClick={handleRescheduleClick}
        >
          {t("update.appointment")}
        </Button>
      ) : (
        <Alert
          title={t("update.alert")}
          color="warning"
          message={t("update.alertMessage", {
            phoneNumber: props.departmentPhoneNumber,
          })}
        />
      )}
    </ContentSheet>
  );
}
