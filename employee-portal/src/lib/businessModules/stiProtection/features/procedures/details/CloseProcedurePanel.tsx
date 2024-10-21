/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiStiProtectionProcedure } from "@eshg/employee-portal-api/stiProtection";
import { Button } from "@mui/joy";
import { ReactEventHandler } from "react";

import { isProcedureOpen } from "@/lib/businessModules/stiProtection/shared/helpers";
import { ContentPanel } from "@/lib/shared/components/contentPanel/ContentPanel";

import {
  CloseConfirmationDialog,
  ReopenConfirmationDialog,
  useCloseAndReopenProcedure,
} from "./CloseAndReopenDialogs";

export function CloseAndReopenProcedurePanel({
  procedure,
}: Readonly<{ procedure: ApiStiProtectionProcedure }>) {
  const {
    isRequestingFinalize,
    requestFinalize,
    abortFinalize,
    handleFinalizeProcedure,
  } = useCloseAndReopenProcedure();

  const isOpen = isProcedureOpen(procedure);

  const ActionButton = isOpen ? CloseButton : ReopenButton;
  const ConfirmationDialog = isOpen
    ? CloseConfirmationDialog
    : ReopenConfirmationDialog;

  return (
    <ContentPanel>
      <ActionButton onClick={() => requestFinalize(procedure)} />
      <ConfirmationDialog
        open={isRequestingFinalize}
        onClose={abortFinalize}
        onConfirm={handleFinalizeProcedure}
        procedure={procedure}
      />
    </ContentPanel>
  );
}

function CloseButton({
  onClick,
}: {
  onClick: ReactEventHandler<HTMLButtonElement>;
}) {
  return <Button onClick={onClick}>Vorgang abschließen</Button>;
}

function ReopenButton({
  onClick,
}: {
  onClick: ReactEventHandler<HTMLButtonElement>;
}) {
  return (
    <Button onClick={onClick} color="danger">
      Vorgang wiedereröffnen
    </Button>
  );
}
