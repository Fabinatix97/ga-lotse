/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Button } from "@mui/joy";
import { ReactEventHandler } from "react";

import { ContentPanel, useSearchParam } from "@eshg/lib-employee-portal";
import { ApiStiProtectionProcedure } from "@eshg/sti-protection-api";

import { isProcedureOpen } from "@/lib/businessModules/stiProtection/shared/helpers";

import {
  CloseConfirmationDialog,
  ReopenConfirmationDialog,
  useCloseAndReopenProcedure,
} from "./CloseAndReopenDialogs";
import { CreateFollowUpProcedureSidebar } from "./CreateFollowUpProcedureSidebar";

export function FinalProcedureActionPanel({
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

  const [_isOpen, setIsOpen] = useSearchParam(
    "create-follow-up-procedure",
    "boolean",
  );

  return (
    <ContentPanel>
      <FollowUpButton onClick={() => setIsOpen(true)} />
      <ActionButton onClick={() => requestFinalize(procedure)} />
      <ConfirmationDialog
        open={isRequestingFinalize}
        procedure={procedure}
        onClose={abortFinalize}
        onConfirm={handleFinalizeProcedure}
      />
      <CreateFollowUpProcedureSidebar procedure={procedure} />
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
    <Button color="danger" onClick={onClick}>
      Vorgang wiedereröffnen
    </Button>
  );
}

function FollowUpButton({
  onClick,
}: {
  onClick: ReactEventHandler<HTMLButtonElement>;
}) {
  return (
    <Button variant="soft" onClick={onClick}>
      Folgevorgang anlegen
    </Button>
  );
}
