/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Alert } from "@eshg/lib-portal";

import { useCitizenRoutes } from "@/lib/businessModules/schoolEntry/shared/routes";
import { useTranslation } from "@/lib/i18n/client";
import {
  ContentSheet,
  ContentSheetTitle,
} from "@/lib/shared/components/layout/contentSheet";
import { ScopedInternalLinkButton } from "@/lib/shared/components/scopedLinks";

interface AppointmentSidePanelProps {
  isClosed: boolean;
  appointmentChangesByCitizenLeft: number;
  departmentPhoneNumber: string;
}

export function AppointmentSidePanel(props: AppointmentSidePanelProps) {
  const { t } = useTranslation(["schoolEntry/appointment"]);

  const citizenRoutes = useCitizenRoutes();

  return (
    <ContentSheet>
      <ContentSheetTitle>{t("update.title")}</ContentSheetTitle>
      {props.appointmentChangesByCitizenLeft > 0 ? (
        <ScopedInternalLinkButton
          variant="outlined"
          href={citizenRoutes.appointment.updateAppointment}
          disabled={props.isClosed}
        >
          {t("update.appointment")}
        </ScopedInternalLinkButton>
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
