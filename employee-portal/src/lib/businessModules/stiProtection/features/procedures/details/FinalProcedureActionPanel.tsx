/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ContentPanel } from "@eshg/lib-employee-portal";
import { ApiStiProtectionProcedure } from "@eshg/sti-protection-api";
import { Button } from "@mui/joy";
import { ReactEventHandler } from "react";

import { isProcedureOpen } from "@/lib/businessModules/stiProtection/shared/helpers";
import { useSearchParam } from "@/lib/shared/hooks/searchParams/useSearchParam";

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
        onClose={abortFinalize}
        onConfirm={handleFinalizeProcedure}
        procedure={procedure}
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
    <Button onClick={onClick} color="danger">
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
    <Button onClick={onClick} variant="soft">
      Folgevorgang anlegen
    </Button>
  );
}
