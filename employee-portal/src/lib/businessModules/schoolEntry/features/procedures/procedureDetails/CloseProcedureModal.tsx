/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ArrowForward } from "@mui/icons-material";
import { Button, Stack, Typography } from "@mui/joy";
import { ReactNode } from "react";
import { isDefined } from "remeda";

import {
  BaseModal,
  BaseModalPropsRequiredClose,
} from "@eshg/lib-portal/components/BaseModal";
import { InternalLinkButton } from "@eshg/lib-portal/components/navigation/InternalLinkButton";

import { ProcedureDetails } from "@/lib/businessModules/schoolEntry/api/models/ProcedureDetails";
import { useCloseProcedure } from "@/lib/businessModules/schoolEntry/api/mutations/schoolEntryApi";
import { routes } from "@/lib/businessModules/schoolEntry/shared/routes";

interface CloseProcedureModalProps
  extends Omit<BaseModalPropsRequiredClose, "children" | "modalTitle"> {
  procedure: ProcedureDetails;
}

export function CloseProcedureModal(props: CloseProcedureModalProps) {
  const { procedure, onClose } = props;
  const closeProcedure = useCloseProcedure(procedure.id);
  async function handleSubmit() {
    await closeProcedure.mutateAsync({ version: procedure.version });
    onClose();
  }

  return isDefined(props.procedure.schoolInfoLetterCreatedAt) ? (
    <BaseModalWithInfo
      modalTitle="Vorgang abschließen?"
      info="Nach Abschluss können keine Daten mehr geändert werden."
      button={<Button onClick={handleSubmit}>Abschließen</Button>}
      closeProcedureModalProps={props}
    />
  ) : (
    <BaseModalWithInfo
      modalTitle="Schulinfobrief erstellen"
      info="Der Vorgang kann nicht geschlossen werden. Sie müssen zuerst einen Schulinfobrief im Bereich „Untersuchung” erstellen."
      button={
        <InternalLinkButton
          href={routes.procedures.byId(props.procedure.id).examinations.index}
          endDecorator={<ArrowForward />}
        >
          Schulinfobrief erstellen
        </InternalLinkButton>
      }
      closeProcedureModalProps={props}
    />
  );
}

interface BaseModalWithProps {
  modalTitle: string;
  info: string;
  button: ReactNode;
  closeProcedureModalProps: CloseProcedureModalProps;
}

function BaseModalWithInfo(props: BaseModalWithProps) {
  return (
    <BaseModal
      modalTitle={props.modalTitle}
      {...props.closeProcedureModalProps}
    >
      <Typography level="body-md" marginBottom={3} data-testid="info-text">
        {props.info}
      </Typography>
      <Stack
        direction="row"
        gap={2}
        alignItems="center"
        justifyContent="flex-end"
      >
        <Button
          variant="outlined"
          color="neutral"
          onClick={props.closeProcedureModalProps.onClose}
        >
          Abbrechen
        </Button>
        {props.button}
      </Stack>
    </BaseModal>
  );
}
