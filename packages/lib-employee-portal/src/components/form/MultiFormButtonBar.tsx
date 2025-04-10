/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { SubmitButton } from "@eshg/lib-portal/components/buttons/SubmitButton";
import { Button, ColorPaletteProp } from "@mui/joy";
import { isDefined } from "remeda";

import { ButtonBar } from "@/components/buttons/ButtonBar";

interface MultiFormButtonBarProps {
  onCancel?: () => void;
  onBack?: () => void;
  onDelete?: () => void;
  onReject?: () => void;
  submitting: boolean;
  submitLabel: string | undefined;
  submitButtonColor?: ColorPaletteProp;
}

export function MultiFormButtonBar(props: MultiFormButtonBarProps) {
  return (
    <ButtonBar
      left={
        isDefined(props.onCancel) && (
          <Button variant={"plain"} color={"primary"} onClick={props.onCancel}>
            Abbrechen
          </Button>
        )
      }
      right={
        <>
          {isDefined(props.onBack) && (
            <Button
              variant={"soft"}
              color={"neutral"}
              onClick={() => props.onBack?.()}
            >
              Zurück
            </Button>
          )}
          {isDefined(props.onDelete) && (
            <Button variant="plain" color="danger" onClick={props.onDelete}>
              Entfernen
            </Button>
          )}
          {isDefined(props.onReject) && (
            <Button variant="plain" color="danger" onClick={props.onReject}>
              Ablehnen
            </Button>
          )}
          {isDefined(props.submitLabel) && (
            <SubmitButton
              submitting={props.submitting}
              sx={{ minWidth: "fit-content" }}
              color={props.submitButtonColor ?? "primary"}
            >
              {props.submitLabel}
            </SubmitButton>
          )}
        </>
      }
    />
  );
}
