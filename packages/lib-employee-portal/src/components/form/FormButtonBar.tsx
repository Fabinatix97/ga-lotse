/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Button, ButtonProps } from "@mui/joy";
import { ReactNode } from "react";
import { isDefined } from "remeda";

import { InternalLinkButton, SubmitButton } from "@eshg/lib-portal";

import { ButtonBar } from "../buttons/ButtonBar";

function createLinkOrButton(
  label: string,
  onClick: RouteOrHandler,
  buttonProps: Pick<ButtonProps, "variant" | "color" | "size">,
) {
  if (typeof onClick === "string") {
    return (
      <InternalLinkButton {...buttonProps} key={label} href={onClick}>
        {label}
      </InternalLinkButton>
    );
  } else {
    return (
      <Button {...buttonProps} key={label} onClick={onClick}>
        {label}
      </Button>
    );
  }
}

interface FormButtonBarProps {
  left?: ReactNode | ReactNode[];
  submitLabel: string;
  submitAriaLabel?: string;
  cancelLabel?: string;
  cancelVariant?: ButtonProps["variant"];
  cancelColor?: ButtonProps["color"];
  submitting: boolean;
  submitDisabled?: boolean;
  onCancel?: RouteOrHandler;
  onFinish?: RouteOrHandler;
  size?: ButtonProps["size"];
}

type RouteOrHandler = string | (() => void);

export function FormButtonBar({
  cancelLabel = "Abbrechen",
  ...props
}: FormButtonBarProps) {
  const rightButtons: ReactNode[] = [];

  if (isDefined(props.onCancel)) {
    rightButtons.push(
      createLinkOrButton(cancelLabel, props.onCancel, {
        color: props.cancelColor ?? "neutral",
        variant: props.cancelVariant ?? "soft",
        size: props.size,
      }),
    );
  }

  if (isDefined(props.onFinish)) {
    rightButtons.push(
      createLinkOrButton("Fertig", props.onFinish, {
        color: "primary",
        size: props.size,
      }),
    );
  } else {
    rightButtons.push(
      <SubmitButton
        key={props.submitLabel}
        aria-label={props.submitAriaLabel}
        submitting={props.submitting}
        disabled={props.submitDisabled}
        size={props.size}
      >
        {props.submitLabel}
      </SubmitButton>,
    );
  }

  return <ButtonBar left={props.left} right={rightButtons} />;
}
