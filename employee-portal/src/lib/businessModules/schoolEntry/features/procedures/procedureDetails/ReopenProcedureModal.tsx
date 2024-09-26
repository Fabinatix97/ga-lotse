/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { formatPersonName } from "@eshg/lib-portal/formatters/person";
import { Button, Stack, Typography } from "@mui/joy";

import { ProcedureDetails } from "@/lib/businessModules/schoolEntry/api/models/ProcedureDetails";
import { useReopenProcedure } from "@/lib/businessModules/schoolEntry/api/mutations/schoolEntryApi";
import { BaseModal, BaseModalProps } from "@/lib/shared/components/BaseModal";
import { DataField } from "@/lib/shared/components/modal/DataField";

interface ReopenProcedureModalProps extends Omit<BaseModalProps, "children"> {
  procedure: ProcedureDetails;
}

export function ReopenProcedureModal(props: ReopenProcedureModalProps) {
  const reopenProcedure = useReopenProcedure();
  async function handleSubmit() {
    await reopenProcedure
      .mutateAsync({
        procedureId: props.procedure.id,
        apiReopenProcedureRequest: {
          version: props.procedure.version,
        },
      })
      .catch();
    props.onClose();
  }

  return (
    <BaseModal modalTitle="Vorgang wiedereröffnen?" {...props}>
      <Typography level="body-md" marginBottom={1}>
        Durch das Wiedereröffnen können bestehende Daten geändert werden.
      </Typography>
      <DataField label="Name" value={formatPersonName(props.procedure.child)} />
      <DataField
        label="Geburtsdatum"
        value={formatDate(props.procedure.child.dateOfBirth)}
      />
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
          Wiedereröffnen
        </Button>
      </Stack>
    </BaseModal>
  );
}
