/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  BaseModal,
  BaseModalProps,
} from "@eshg/lib-portal/components/BaseModal";
import { Button, Stack, Typography } from "@mui/joy";

import { useDeleteAppointmentEp } from "@/lib/businessModules/travelMedicine/api/mutations/procedureSteps";

interface CancelAppointmentModalProps extends Omit<BaseModalProps, "children"> {
  procedureStepId: string;
}

export function CancelAppointmentModal(props: CancelAppointmentModalProps) {
  const cancelAppointmentApi = useDeleteAppointmentEp();

  async function handleSubmit() {
    await cancelAppointmentApi.mutateAsync(
      {
        procedureStepId: props.procedureStepId,
      },
      {
        onSuccess: () => {
          props.onClose();
        },
      },
    );
  }

  return (
    <BaseModal modalTitle="Termin absagen?" {...props}>
      <Typography level="body-md" marginBottom={3}>
        Wollen Sie den Termin wirklich absagen? Die zu impfende Person erhält
        eine Bestätigung per E-Mail.
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

        <Button color="primary" onClick={handleSubmit}>
          Bestätigen
        </Button>
      </Stack>
    </BaseModal>
  );
}
