/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  BaseModal,
  BaseModalProps,
} from "@eshg/lib-portal/components/BaseModal";
import { ConfirmationDialogProps } from "@eshg/lib-portal/components/confirmationDialog/BaseConfirmationDialog";
import { BaseConfirmationDialogButtonBar } from "@eshg/lib-portal/components/confirmationDialog/BaseConfirmationDialogButtonBar";
import { isNonEmptyArray } from "@eshg/lib-portal/helpers/guards";
import {
  ApiAppointmentState,
  ApiDocument,
  ApiDocumentStatus,
  ApiEmployeeOmsProcedureDetails,
  ApiMedicalOpinionStatus,
  ApiWaitingStatus,
} from "@eshg/official-medical-service-api";
import { List, ListItem, Typography } from "@mui/joy";
import { ReactNode } from "react";
import { isDefined } from "remeda";

import { useCloseOpenProcedure } from "@/lib/businessModules/officialMedicalService/api/mutations/employeeOmsProcedureApi";

interface CloseProcedureModalProps
  extends Omit<BaseModalProps, "children" | "modalTitle" | "color"> {
  onClose: () => void;
  procedure: ApiEmployeeOmsProcedureDetails;
  allDocuments: ApiDocument[];
}

export function CloseProcedureModal(props: CloseProcedureModalProps) {
  const closeOpenProcedure = useCloseOpenProcedure();

  const requirements = getRequirements(props.procedure, props.allDocuments);

  return !isNonEmptyArray(requirements) ? (
    <BaseModalWithInfo
      modalTitle="Vorgang abschließen?"
      description="Nach Abschluss können keine Daten mehr geändert werden."
      onConfirm={async () => {
        await closeOpenProcedure.mutateAsync({ id: props.procedure.id });
      }}
      onCancel={props.onClose}
      color="primary"
      {...props}
    />
  ) : (
    <BaseModalWithInfo
      modalTitle="Vorgang abschließen nicht möglich"
      description="Der Vorgang muss folgende Bedingungen erfüllen, bevor Sie diesen abschließen können:"
      color="danger"
      {...props}
    >
      <List marker="disc" component="ul" sx={{ mb: 1 }}>
        {isNonEmptyArray(requirements) &&
          requirements.map((item, index) => (
            <ListItem key={index} sx={{ p: 0 }}>
              <Typography level="title-md" component="span" noWrap>
                {item}
              </Typography>
            </ListItem>
          ))}
      </List>
    </BaseModalWithInfo>
  );
}

function getRequirements(
  procedure: ApiEmployeeOmsProcedureDetails,
  documents: ApiDocument[],
) {
  const items: string[] = [];

  if (procedure.medicalOpinionStatus !== ApiMedicalOpinionStatus.Accomplished) {
    items.push("Der Gutachtenstatus muss auf “Fertig” gesetzt werden.");
  }

  if (
    procedure.appointments.some(
      (appointment) =>
        appointment.appointmentState !== ApiAppointmentState.Closed,
    )
  ) {
    items.push("Offene Termine müssen abgeschlossen oder abgesagt werden.");
  }

  if (
    documents.some(
      (document) =>
        document.mandatoryDocument &&
        document.documentStatus !== ApiDocumentStatus.Accepted,
    )
  ) {
    items.push("Pflichtdokumente müssen den Status “Akzeptiert” haben.");
  }

  if (
    procedure.waitingRoom.status === ApiWaitingStatus.WaitingForConsultation ||
    procedure.waitingRoom.status === ApiWaitingStatus.InConsultation
  ) {
    items.push(`Der Wartezimmerstatus muss auf "Fertig" gesetzt werden.`);
  }

  return items;
}

export type ButtonBarProps = Pick<
  ConfirmationDialogProps,
  "onClose" | "onConfirm" | "onCancel" | "color"
>;

interface BaseModalWithProps
  extends Omit<ButtonBarProps, "onConfirm">,
    CloseProcedureModalProps {
  modalTitle: string;
  description: string;
  children?: ReactNode;
  onConfirm?: () => Promise<void> | void;
}

function BaseModalWithInfo({ ...props }: BaseModalWithProps) {
  return (
    <BaseModal {...props}>
      <Typography level="body-md" data-testid="description-text">
        {props.description}
      </Typography>
      {isDefined(props.children) && props.children}
      {isDefined(props.onConfirm) && isDefined(props.onCancel) && (
        <BaseConfirmationDialogButtonBar
          onConfirm={props.onConfirm}
          handleCancel={props.onCancel}
          confirmLabel="Abschließen"
          cancelLabel="Abbrechen"
          {...props}
        />
      )}
    </BaseModal>
  );
}
