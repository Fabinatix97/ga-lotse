/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { SubmitButton } from "@eshg/lib-portal/components/buttons/SubmitButton";
import { InternalLinkButton } from "@eshg/lib-portal/components/navigation/InternalLinkButton";
import { Button, ButtonProps } from "@mui/joy";
import { ReactNode } from "react";
import { isDefined } from "remeda";

import { ButtonBar } from "@/lib/shared/components/buttons/ButtonBar";

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
  submitting: boolean;
  submitDisabled?: boolean;
  onCancel?: RouteOrHandler;
  onFinish?: RouteOrHandler;
  size?: ButtonProps["size"];
}

type RouteOrHandler = string | (() => void);

export function FormButtonBar(props: FormButtonBarProps) {
  const rightButtons: ReactNode[] = [];

  if (isDefined(props.onCancel)) {
    rightButtons.push(
      createLinkOrButton("Abbrechen", props.onCancel, {
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
        submitting={props.submitting}
        disabled={props.submitDisabled}
        key={props.submitLabel}
        size={props.size}
      >
        {props.submitLabel}
      </SubmitButton>,
    );
  }

  return <ButtonBar left={props.left} right={rightButtons} />;
}
