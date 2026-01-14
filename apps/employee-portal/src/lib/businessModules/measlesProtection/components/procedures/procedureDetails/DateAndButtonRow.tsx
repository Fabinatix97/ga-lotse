/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Button } from "@mui/joy";
import { MouseEventHandler } from "react";

import { DateField, DecoratedInputField, FieldProps } from "@eshg/lib-portal";

interface DateAndButtonRowProps extends FieldProps<string> {
  onButtonClick: MouseEventHandler;
  buttonLabel: string;
  readOnly?: boolean;
  disabled?: boolean;
}

export function DateAndButtonRow(props: Readonly<DateAndButtonRowProps>) {
  return (
    <DateField
      {...props}
      component={DecoratedInputField}
      disabled={props.disabled}
      readOnly={props.readOnly}
      fieldDecorator={
        <Button
          variant="soft"
          disabled={props.disabled}
          onClick={props.onButtonClick}
        >
          {props.buttonLabel}
        </Button>
      }
    />
  );
}
