/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Typography, styled } from "@mui/joy";
import { useState } from "react";

import {
  APPOINTMENT_TYPES,
  ConfirmationDialog,
} from "@eshg/lib-employee-portal";
import {
  ApiAppointmentHistoryEntry,
  ApiStiProtectionProcedure,
  ApiStiProtectionProcedureOverview,
} from "@eshg/sti-protection-api";

import {
  useCloseProcedure,
  useReopenProcedure,
} from "@/lib/businessModules/stiProtection/api/mutations/procedures";
import { useStiProcedureQuery } from "@/lib/businessModules/stiProtection/api/queries/procedures";
import { isProcedureOpen } from "@/lib/businessModules/stiProtection/shared/helpers";

import { formatAppointmentTime } from "./AdditionalDataSection";

type Procedure = ApiStiProtectionProcedure | ApiStiProtectionProcedureOverview;

interface CloseAndReopenConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  procedure: Procedure | undefined;
}

interface CloseWithOpenAppointmentsConfirmationDialogProps
  extends Omit<CloseAndReopenConfirmationDialogProps, "procedure"> {
  openAppointment: ApiAppointmentHistoryEntry;
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
  procedure,
}: CloseAndReopenConfirmationDialogProps) {
  const { data: appointmentDetails } = useStiProcedureQuery(procedure?.id);
  const openAppointment = appointmentDetails.appointmentHistory.find(
    (t) => t.appointmentStatus === "OPEN",
  );
  if (openAppointment) {
    return (
      <CloseWithOpenAppointmentConfirmationDialog
        openAppointment={openAppointment}
        open={open}
        onClose={onClose}
        onConfirm={onConfirm}
      />
    );
  }

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

function CloseWithOpenAppointmentConfirmationDialog({
  open,
  onClose,
  onConfirm,
  openAppointment,
}: CloseWithOpenAppointmentsConfirmationDialogProps) {
  return (
    <ConfirmationDialog
      title="Vorgang abschließen nur mit Terminstornierung möglich"
      description="Der Vorgang enthält einen offenen Termin. Um den Vorgang zu schließen, müssen Sie folgenden Termin stornieren."
      confirmLabel="Stornieren & Abschließen"
      color="danger"
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
    >
      <Typography level="body-md" fontWeight={600}>
        <time dateTime={openAppointment.appointmentStart.toISOString()}>
          {formatAppointmentTime(openAppointment.appointmentStart)}
        </time>
        <br />
        {APPOINTMENT_TYPES[openAppointment.appointmentType]}
      </Typography>
    </ConfirmationDialog>
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
      title="Vorgang wiedereröffnen?"
      confirmLabel="Wiedereröffnen"
      description="Durch das wiedereröffnen können existierende Daten geändert werden."
      color="danger"
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
    >
      <DetailsTable>
        <tbody>
          <tr>
            <th scope="row">Geburtsjahr</th>
            <td>{personDetails.yearOfBirth}</td>
          </tr>
        </tbody>
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
