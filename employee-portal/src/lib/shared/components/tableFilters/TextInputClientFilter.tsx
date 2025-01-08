/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Input } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import {
  Dispatch,
  HTMLInputTypeAttribute,
  SetStateAction,
  useState,
} from "react";

interface TextInputClientFilterProps {
  placeholder: string;
  type: HTMLInputTypeAttribute;
  setInputField: Dispatch<SetStateAction<string>>;
  sx?: SxProps;
}

export function TextInputClientFilter(
  props: Readonly<TextInputClientFilterProps>,
) {
  const [inputType, setInputType] = useState<HTMLInputTypeAttribute>("search");

  return (
    <Input
      variant="outlined"
      placeholder={props.placeholder}
      aria-label={props.placeholder}
      type={inputType}
      onChange={(event) => {
        props.setInputField(event.target.value);
      }}
      onFocus={() => setInputType(props.type)}
      onBlur={(event) => {
        if (event.target.value == "") {
          setInputType("search");
        }
      }}
      size="sm"
      sx={{
        width: 140,
        ...props.sx,
      }}
      slotProps={{
        input: {
          role: "searchbox",
        },
      }}
    />
  );
}
