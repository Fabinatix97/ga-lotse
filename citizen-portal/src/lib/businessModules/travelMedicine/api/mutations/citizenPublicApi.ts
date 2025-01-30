/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { ApiPostCitizenVaccinationConsultationRequest } from "@eshg/travel-medicine-api";

import { useCitizenPublicApi } from "@/lib/businessModules/travelMedicine/api/clients";

export function usePostCitizenVaccinationConsultation() {
  const citizenPublicApi = useCitizenPublicApi();
  const snackbar = useSnackbar();

  return useHandledMutation({
    mutationFn: (data: ApiPostCitizenVaccinationConsultationRequest) => {
      return citizenPublicApi.postVaccinationConsultationForCitizen(data);
    },
    onSuccess: () => {
      // change when behaviour is defined
      snackbar.confirmation("Der Termin wurde gebucht.");
    },
  });
}
