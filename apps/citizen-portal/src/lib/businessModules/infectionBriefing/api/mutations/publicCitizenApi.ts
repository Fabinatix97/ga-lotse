/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useMutation } from "@tanstack/react-query";

import { type ApiBookNewCertificateAppointmentRequest } from "@eshg/infection-briefing-api";
import { useSnackbar } from "@eshg/lib-portal";

import { useInfectionBriefingCitizenPublicApi } from "@/lib/businessModules/infectionBriefing/api/clients";
import { useTranslation } from "@/lib/i18n/client";

export function useBookAppointment() {
  const api = useInfectionBriefingCitizenPublicApi();
  const { t } = useTranslation(["infectionBriefing/forms"]);
  const snackbar = useSnackbar();

  return useMutation({
    mutationFn: (appointment: ApiBookNewCertificateAppointmentRequest) =>
      api.bookNewCertificateAppointment(appointment),
    onSuccess: () => {
      snackbar.confirmation(t("submit_success"));
    },
    onError: () => {
      snackbar.error(t("submit_error"));
    },
  });
}
