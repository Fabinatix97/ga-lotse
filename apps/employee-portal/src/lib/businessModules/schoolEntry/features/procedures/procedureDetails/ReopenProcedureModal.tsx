/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Button, Stack, Typography } from "@mui/joy";

import {
  BaseModal,
  BaseModalPropsRequiredClose,
  formatDate,
  formatPersonName,
} from "@eshg/lib-portal";

import { ProcedureDetails } from "@/lib/businessModules/schoolEntry/api/models/ProcedureDetails";
import { useReopenProcedure } from "@/lib/businessModules/schoolEntry/api/mutations/schoolEntryApi";
import { DataField } from "@/lib/shared/components/modal/DataField";

interface ReopenProcedureModalProps
  extends Omit<BaseModalPropsRequiredClose, "children" | "modalTitle"> {
  procedure: ProcedureDetails;
}

export function ReopenProcedureModal(props: ReopenProcedureModalProps) {
  const { procedure, onClose } = props;
  const reopenProcedure = useReopenProcedure(procedure.id);
  async function handleSubmit() {
    await reopenProcedure.mutateAsync({ version: procedure.version });
    // TODO: ISSUE-6052: move onClose into onSuccess(?)
    onClose();
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
