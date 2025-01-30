/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  BaseModal,
  BaseModalProps,
} from "@eshg/lib-portal/components/BaseModal";
import {
  AbortDraftVaccinationConsultationRequest,
  ApiGetVaccinationConsultationDetailsResponse,
} from "@eshg/travel-medicine-api";
import { Button, Stack, Typography } from "@mui/joy";
import { useRouter } from "next/navigation";

import { useAboardDraftVaccinationConsultation } from "@/lib/businessModules/travelMedicine/api/mutations/vaccinationConsultation";
import { routes } from "@/lib/businessModules/travelMedicine/shared/routes";

interface AbortProcedureModalProps
  extends Omit<BaseModalProps, "children" | "modalTitle"> {
  procedure: ApiGetVaccinationConsultationDetailsResponse;
}

export function AbortProcedureModal(props: AbortProcedureModalProps) {
  const abortProcedure = useAboardDraftVaccinationConsultation();
  const router = useRouter();

  async function handleSubmit() {
    const request: AbortDraftVaccinationConsultationRequest = {
      procedureId: props.procedure.procedureId,
    };
    await abortProcedure.mutateAsync(request).then(() => {
      router.push(routes.procedures.index);
    });
  }

  return (
    <BaseModal modalTitle="Vorgang löschen?" {...props}>
      <Typography level="body-md" marginBottom={3}>
        Der Vorgang wird gelöscht und kann nicht mehr wiederhergestellt werden.
      </Typography>
      <Stack
        direction="row"
        gap={2}
        alignItems="center"
        justifyContent="flex-end"
      >
        <Button variant="outlined" color="neutral" onClick={props.onClose}>
          Abbrechen
        </Button>

        <Button color="danger" onClick={handleSubmit}>
          Löschen
        </Button>
      </Stack>
    </BaseModal>
  );
}
