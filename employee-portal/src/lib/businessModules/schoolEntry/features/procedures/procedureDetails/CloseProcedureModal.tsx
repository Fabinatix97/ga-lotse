/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  BaseModal,
  BaseModalProps,
} from "@eshg/lib-portal/components/BaseModal";
import { InternalLinkButton } from "@eshg/lib-portal/components/navigation/InternalLinkButton";
import { ArrowForward } from "@mui/icons-material";
import { Button, Stack, Typography } from "@mui/joy";
import { ReactNode } from "react";
import { isDefined } from "remeda";

import { ProcedureDetails } from "@/lib/businessModules/schoolEntry/api/models/ProcedureDetails";
import { useCloseProcedure } from "@/lib/businessModules/schoolEntry/api/mutations/schoolEntryApi";
import { routes } from "@/lib/businessModules/schoolEntry/shared/routes";

interface CloseProcedureModalProps extends Omit<BaseModalProps, "children"> {
  procedure: ProcedureDetails;
}

export function CloseProcedureModal(props: CloseProcedureModalProps) {
  const closeProcedure = useCloseProcedure();
  async function handleSubmit() {
    await closeProcedure.mutateAsync({
      procedureId: props.procedure.id,
      apiCloseProcedureRequest: {
        version: props.procedure.version,
      },
    });
    props.onClose();
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
      info="Der Vorgang kann nicht geschlossen werden. Sie müssen zuerst einen Schulinfobrief im Bereich “Untersuchung” erstellen."
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
