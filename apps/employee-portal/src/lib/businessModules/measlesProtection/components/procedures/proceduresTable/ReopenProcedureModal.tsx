/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Button, Stack } from "@mui/joy";
import { useState } from "react";

import { OverlayBoundary } from "@eshg/lib-employee-portal";
import { BaseModal, formatDate, useSnackbar } from "@eshg/lib-portal";

import { useReopenProcedure } from "@/lib/businessModules/measlesProtection/api/mutations/statusTransitionApi";
import { REOPEN_PROCEDURE_SUCCESS_MESSAGE } from "@/lib/businessModules/measlesProtection/components/procedures/procedureDetails/helpers";
import { useProceduresContext } from "@/lib/businessModules/measlesProtection/shared/ProceduresContext";
import {
  DataField,
  ResponsiveTypography,
} from "@/lib/shared/components/modal/DataField";

function ReopenProcedureModalContent() {
  const snackbar = useSnackbar();
  const proceduresContext = useProceduresContext();
  const { procedureForReopen } = proceduresContext.state;
  const { closeProcedureReopenModal } = proceduresContext.action;
  const [isRequestingReopen, setIsRequestingReopen] = useState(false);
  const reopenProcedure = useReopenProcedure({
    onSuccess: () => {
      snackbar.confirmation(REOPEN_PROCEDURE_SUCCESS_MESSAGE);
    },
  });

  function handleClose() {
    closeProcedureReopenModal();
  }

  async function handleReopen() {
    if (!procedureForReopen) return;

    setIsRequestingReopen(true);
    await reopenProcedure.mutateAsync({ procedureId: procedureForReopen.id });
    setIsRequestingReopen(false);
    closeProcedureReopenModal();
  }

  return (
    <BaseModal
      modalTitle="Vorgang wiedereröffnen?"
      open={!!procedureForReopen}
      color="danger"
      onClose={handleClose}
    >
      <ResponsiveTypography
        textColor="text.secondary"
        linesToShow={3}
        value="Durch das wiedereröffnen können existierende Daten geändert werden."
      />
      <DataField
        label="Name"
        value={`${procedureForReopen?.affectedPerson.firstName} ${procedureForReopen?.affectedPerson.lastName}`}
      />
      <DataField
        label="Geburtsdatum"
        value={formatDate(procedureForReopen?.affectedPerson.dateOfBirth)}
      />
      <Stack direction="row" gap={2} justifyContent="flex-end">
        <Button variant="outlined" color="neutral" onClick={handleClose}>
          Abbrechen
        </Button>
        <Button
          color="danger"
          loadingPosition="start"
          loading={isRequestingReopen}
          onClick={handleReopen}
        >
          Wiedereröffnen
        </Button>
      </Stack>
    </BaseModal>
  );
}

export function ReopenProcedureModal() {
  return (
    <OverlayBoundary>
      <ReopenProcedureModalContent />
    </OverlayBoundary>
  );
}
