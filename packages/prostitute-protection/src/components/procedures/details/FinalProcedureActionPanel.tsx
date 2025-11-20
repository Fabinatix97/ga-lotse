/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Button } from "@mui/joy";
import { ReactEventHandler, useState } from "react";

import { ApiProcedureStatus, ApiUserRole } from "@eshg/base-api";
import { ContentPanel, useHasUserRoleCheck } from "@eshg/lib-employee-portal";

import { ApiProstituteProtectionProcedure } from "../../../mock";
import {
  isProcedureClosed,
  isProcedureFinalized,
} from "../../../shared/helpers";

import {
  CancelConfirmationDialog,
  CloseConfirmationDialog,
} from "./ProcedureDialogs";

export function FinalProcedureActionPanel({
  procedure,
}: Readonly<{ procedure: ApiProstituteProtectionProcedure }>) {
  const isLeader = useHasUserRoleCheck(ApiUserRole.ProstituteProtectionLeader);

  if (procedure.procedureStatus === ApiProcedureStatus.Aborted) {
    return null;
  }

  if (isProcedureClosed(procedure) && !isLeader) {
    return null;
  }

  return (
    <ContentPanel dense>
      <OpenProcedureActions procedure={procedure} />
    </ContentPanel>
  );
}

const FinalAction = {
  Cancel: "CANCEL",
  Close: "CLOSE",
};

type FinalAction = (typeof FinalAction)[keyof typeof FinalAction];

function OpenProcedureActions({
  procedure,
}: Readonly<{ procedure: ApiProstituteProtectionProcedure }>) {
  const [action, setAction] = useState<FinalAction | undefined>();

  if (isProcedureFinalized(procedure)) {
    return null;
  }

  function handleCloseDialog() {
    setAction(undefined);
  }

  return (
    <>
      <CancelButton onClick={() => setAction(FinalAction.Cancel)} />
      <CloseButton onClick={() => setAction(FinalAction.Close)} />
      <CancelConfirmationDialog
        open={action === FinalAction.Cancel}
        onClose={handleCloseDialog}
        onConfirm={() => {
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve();
            }, 1000);
          });
        }}
      />
      <CloseConfirmationDialog
        procedure={procedure}
        open={action === FinalAction.Close}
        onClose={handleCloseDialog}
        onConfirm={() => {
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve();
            }, 1000);
          });
        }}
      />
    </>
  );
}

function CancelButton({
  onClick,
}: {
  onClick: ReactEventHandler<HTMLButtonElement>;
}) {
  return (
    <Button variant="soft" color="danger" onClick={onClick}>
      Vorgang abbrechen
    </Button>
  );
}

function CloseButton({
  onClick,
}: {
  onClick: ReactEventHandler<HTMLButtonElement>;
}) {
  return <Button onClick={onClick}>Vorgang abschließen</Button>;
}
