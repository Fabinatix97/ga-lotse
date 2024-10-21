/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiStiProtectionProcedure,
  ApiStiProtectionProcedureOverview,
} from "@eshg/employee-portal-api/stiProtection";
import { styled } from "@mui/joy";
import { useState } from "react";

import {
  useCloseProcedure,
  useReopenProcedure,
} from "@/lib/businessModules/stiProtection/api/mutations/procedures";
import { COUNTRY_CODE_LABELS } from "@/lib/businessModules/stiProtection/shared/countryCodes";
import { isProcedureOpen } from "@/lib/businessModules/stiProtection/shared/helpers";
import { ConfirmationDialog } from "@/lib/shared/components/confirmationDialog/ConfirmationDialog";

type Procedure = ApiStiProtectionProcedure | ApiStiProtectionProcedureOverview;
interface CloseAndReopenConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  procedure: Procedure | undefined;
}

export interface UseCloseAndReopenConfirmationDialog {
  isRequestingFinalize: boolean;
  requestFinalize: (s: Procedure) => void;
  abortFinalize: () => void;
  handleFinalizeProcedure: () => Promise<void>;
  procedure: Procedure | undefined;
}

export function useCloseAndReopenProcedure(): UseCloseAndReopenConfirmationDialog {
  const [procedureToFinalize, requestFinalize] = useState<
    Procedure | undefined
  >();

  const closeProcedure = useCloseProcedure({
    onSuccess() {
      requestFinalize(undefined);
    },
  });
  const reopenProcedure = useReopenProcedure({
    onSuccess() {
      requestFinalize(undefined);
    },
  });

  async function handleFinalizeProcedure() {
    if (!procedureToFinalize) {
      throw Error("No procedure set");
    }
    const isOpen = isProcedureOpen(procedureToFinalize);
    if (isOpen) {
      await closeProcedure.mutateAsync(procedureToFinalize.id);
    } else {
      await reopenProcedure.mutateAsync(procedureToFinalize.id);
    }
    requestFinalize(undefined);
  }

  return {
    isRequestingFinalize: !!procedureToFinalize,
    requestFinalize,
    abortFinalize: () => requestFinalize(undefined),
    handleFinalizeProcedure,
    procedure: procedureToFinalize,
  };
}

export function CloseConfirmationDialog({
  open,
  onClose,
  onConfirm,
}: CloseAndReopenConfirmationDialogProps) {
  return (
    <ConfirmationDialog
      title="Vorgang abschließen?"
      description="Möchten Sie diesen Vorgang wirklich abschließen?"
      confirmLabel="Abschließen"
      color="primary"
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
    />
  );
}

export function ReopenConfirmationDialog({
  open,
  onClose,
  onConfirm,
  procedure,
}: CloseAndReopenConfirmationDialogProps) {
  if (!procedure) {
    return null;
  }
  const personDetails = "person" in procedure ? procedure.person : procedure;
  return (
    <ConfirmationDialog
      title={"Vorgang wiedereröffnen?"}
      confirmLabel="Wiedereröffnen"
      description="Durch das wiedereröffnen können existierende Daten geändert werden."
      color="danger"
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
    >
      <DetailsTable>
        <tr>
          <th scope="row">Aktenzeichen</th>
          <td>-</td>
        </tr>
        <tr>
          <th scope="row">Geburtsjahr</th>
          <td>{personDetails.yearOfBirth}</td>
        </tr>
        <tr>
          <th scope="row">Geburtsland</th>
          <td>
            {personDetails.countryOfBirth &&
              COUNTRY_CODE_LABELS[personDetails.countryOfBirth]}
          </td>
        </tr>
      </DetailsTable>
    </ConfirmationDialog>
  );
}

const DetailsTable = styled("table")`
  width: max-content;
  text-align: left;
  & th {
    font-weight: 400;
    padding-right: ${({ theme }) => theme.spacing(4)};
  }
  & td {
    font-weight: ${({ theme }) => theme.fontWeight.lg};
  }
`;
