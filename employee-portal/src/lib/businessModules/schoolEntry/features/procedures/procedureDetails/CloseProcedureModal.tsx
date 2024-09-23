/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Button, Stack, Typography } from "@mui/joy";

import { ProcedureDetails } from "@/lib/businessModules/schoolEntry/api/models/ProcedureDetails";
import { useCloseProcedure } from "@/lib/businessModules/schoolEntry/api/mutations/schoolEntryApi";
import { BaseModal, BaseModalProps } from "@/lib/shared/components/BaseModal";

interface CloseProcedureModalProps extends Omit<BaseModalProps, "children"> {
  procedure: ProcedureDetails;
}

export function CloseProcedureModal(props: CloseProcedureModalProps) {
  const closeProcedure = useCloseProcedure();
  async function handleSubmit() {
    await closeProcedure.mutateAsync({
      procedureId: props.procedure.id,
      apiCloseProcedureRequest: {
        version: props.procedure.version,
      },
    });
    props.onClose();
  }

  return (
    <BaseModal modalTitle="Vorgang abschließen?" {...props}>
      <Typography level="body-md" marginBottom={3}>
        Nach Abschluss können keine Daten mehr geändert werden.
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

        <Button onClick={handleSubmit}>Abschließen</Button>
      </Stack>
    </BaseModal>
  );
}
