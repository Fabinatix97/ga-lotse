/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Button } from "@mui/joy";
import { MouseEventHandler } from "react";

import { DateField } from "@eshg/lib-portal/components/formFields/DateField";
import { DecoratedInputField } from "@eshg/lib-portal/components/formFields/DecoratedInputField";
import { FieldProps } from "@eshg/lib-portal/types/form";

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
