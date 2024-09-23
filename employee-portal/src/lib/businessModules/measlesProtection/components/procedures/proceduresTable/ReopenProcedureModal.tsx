/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { Button, Grid, Stack, Typography, TypographyProps } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { useState } from "react";

import { multiLineEllipsis } from "@/lib/baseModule/theme/theme";
import { useReopenProcedure } from "@/lib/businessModules/measlesProtection/api/mutations/statusTransitionApi";
import { REOPEN_PROCEDURE_SUCCESS_MESSAGE } from "@/lib/businessModules/measlesProtection/components/procedures/procedureDetails/helpers";
import { useProceduresContext } from "@/lib/businessModules/measlesProtection/shared/ProceduresContext";
import { BaseModal } from "@/lib/shared/components/BaseModal";
import { OverlayBoundary } from "@/lib/shared/components/boundaries/OverlayBoundary";

interface ResponsiveTypographyProps extends TypographyProps {
  linesToShow?: number;
  sx?: SxProps;
  value: string;
}

function ResponsiveTypography({
  linesToShow = 1,
  sx,
  value,
  ...typographyProps
}: ResponsiveTypographyProps) {
  return (
    <Typography
      sx={
        {
          ...multiLineEllipsis(linesToShow),
          ...sx,
        } as SxProps
      }
      slotProps={{
        root: {
          title: value,
        },
      }}
      {...typographyProps}
    >
      {value}
    </Typography>
  );
}

function DataField({ label, value }: { label: string; value: string }) {
  return (
    <Grid container xxs={12}>
      <Grid xxs={12} sm={3}>
        <ResponsiveTypography level="body-md" sx={{ mr: 2 }} value={label} />
      </Grid>
      <Grid xxs={12} sm={9}>
        <ResponsiveTypography level="title-md" fontWeight="600" value={value} />
      </Grid>
    </Grid>
  );
}

export function ReopenProcedureModalContent() {
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
      onClose={handleClose}
      color="danger"
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
      <Stack direction={"row"} gap={2} justifyContent={"flex-end"}>
        <Button variant="outlined" color="neutral" onClick={handleClose}>
          Abbrechen
        </Button>
        <Button
          color="danger"
          onClick={handleReopen}
          loadingPosition="start"
          loading={isRequestingReopen}
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
