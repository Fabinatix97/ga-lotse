/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useMutation } from "@tanstack/react-query";

import {
  type ApiBookNewCertificateAppointmentRequest,
  ApiBookReplacementCertificateAppointmentRequest,
} from "@eshg/infection-briefing-api";
import { useSnackbar } from "@eshg/lib-portal";

import { useInfectionBriefingPublicCitizenApi } from "@/lib/businessModules/infectionBriefing/api/clients";
import { AppointmentRequest } from "@/lib/businessModules/infectionBriefing/components/appointment/AppointmentStepper";
import { useTranslation } from "@/lib/i18n/client";

export function useBookAppointment() {
  const api = useInfectionBriefingPublicCitizenApi();
  const { t } = useTranslation(["infectionBriefing/forms"]);
  const snackbar = useSnackbar();

  interface AppointmentMutationParams {
    type: "NEW" | "DUPLICATE";
    data: AppointmentRequest;
  }

  return useMutation({
    mutationFn: ({ type, data }: AppointmentMutationParams) => {
      if (type === "NEW") {
        return api.bookNewCertificateAppointment(
          data as ApiBookNewCertificateAppointmentRequest,
        );
      } else {
        return api.bookReplacementCertificateAppointment(
          data as ApiBookReplacementCertificateAppointmentRequest,
        );
      }
    },
    onSuccess: () => {
      snackbar.confirmation(t("submit_success"));
    },
    onError: () => {
      snackbar.error(t("submit_error"));
    },
  });
}
