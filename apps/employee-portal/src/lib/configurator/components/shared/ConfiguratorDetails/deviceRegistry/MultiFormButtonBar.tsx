/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Button, ColorPaletteProp } from "@mui/joy";
import { isDefined } from "remeda";

import { ButtonBar } from "@eshg/lib-employee-portal";

interface MultiFormButtonBarProps {
  onCancel?: () => void;
  onBack?: () => void;
  onDelete?: () => void;
  submitting: boolean;
  submitLabel: string | undefined;
  submitButtonColor?: ColorPaletteProp;
  submitButtonType?: "button" | "submit";
  onSubmitClick?: () => void;
}

export function MultiFormButtonBar(props: MultiFormButtonBarProps) {
  return (
    <ButtonBar
      left={
        isDefined(props.onDelete) ? (
          <Button variant="plain" color="danger" onClick={props.onDelete}>
            Löschen
          </Button>
        ) : (
          isDefined(props.onCancel) && (
            <Button variant="plain" color="primary" onClick={props.onCancel}>
              Abbrechen
            </Button>
          )
        )
      }
      right={
        <>
          {isDefined(props.onDelete) && isDefined(props.onCancel) && (
            <Button variant="plain" color="primary" onClick={props.onCancel}>
              Abbrechen
            </Button>
          )}
          {isDefined(props.submitLabel) && (
            <Button
              sx={{ minWidth: "fit-content" }}
              color={props.submitButtonColor ?? "primary"}
              type={props.submitButtonType ?? "submit"}
              loadingPosition="start"
              loading={props.submitting}
              disabled={props.submitting}
              onClick={props.onSubmitClick}
            >
              {props.submitLabel}
            </Button>
          )}
        </>
      }
    />
  );
}
