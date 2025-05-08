/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Button, ButtonProps } from "@mui/joy";
import { ReactNode } from "react";
import { isDefined } from "remeda";

import { SubmitButton } from "@eshg/lib-portal/components/buttons/SubmitButton";
import { InternalLinkButton } from "@eshg/lib-portal/components/navigation/InternalLinkButton";

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
  cancelLabel?: string;
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
        color: "neutral",
        variant: "soft",
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
