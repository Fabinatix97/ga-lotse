/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useMutation } from "@tanstack/react-query";

import { useSnackbar } from "@eshg/lib-portal";
import { ApiPostCitizenVaccinationConsultationRequest } from "@eshg/travel-medicine-api";

import { useCitizenPublicApi } from "@/lib/businessModules/travelMedicine/api/clients";

export function usePostCitizenVaccinationConsultation() {
  const citizenPublicApi = useCitizenPublicApi();
  const snackbar = useSnackbar();

  return useMutation({
    mutationFn: (request: ApiPostCitizenVaccinationConsultationRequest) => {
      return citizenPublicApi.postVaccinationConsultationForCitizen(request);
    },
    onSuccess: () => {
      // change when behaviour is defined
      snackbar.confirmation("Der Termin wurde gebucht.");
    },
  });
}
