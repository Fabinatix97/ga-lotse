/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { IconButton, Select, SelectProps, SelectStaticProps } from "@mui/joy";
import { ReactNode, useRef } from "react";
import { isEmpty, isNonNullish } from "remeda";

export function ResettableSingleSelect({
  onResetSelect,
  otherEndDecorator,
  ...props
}: Omit<SelectProps<string, false>, "endDecorator"> & {
  onResetSelect: () => void;
  otherEndDecorator?: ReactNode;
}) {
  const action: SelectStaticProps["action"] = useRef(null);

  return (
    <Select
      action={action}
      {...props}
      endDecorator={
        <>
          {otherEndDecorator}
          {isNonNullish(props.value) && !isEmpty(props.value) ? (
            <ResetButton
              onReset={() => {
                onResetSelect();
                action.current?.focusVisible();
              }}
            />
          ) : undefined}
        </>
      }
    >
      {props.children}
    </Select>
  );
}

function ResetButton(props: { onReset: () => void }) {
  return (
    <IconButton
      variant="plain"
      color="neutral"
      aria-label="Zurücksetzen"
      onMouseDown={(event) => event.stopPropagation()}
      onClick={props.onReset}
    >
      <CloseRoundedIcon />
    </IconButton>
  );
}
