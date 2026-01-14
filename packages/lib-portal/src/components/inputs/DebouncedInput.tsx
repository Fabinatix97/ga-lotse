/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { Input, InputProps } from "@mui/joy";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useDebounce } from "use-debounce";

interface DebounceProps {
  onChange: (value: string | number | undefined) => void;
  label?: string;
  value?: string | number | undefined;
  defaultValue?: string | number | undefined;
}

export function DebouncedInput(
  props: Omit<InputProps, "onChange"> & DebounceProps,
) {
  const { onChange, label, value, defaultValue, ...rest } = props;

  const [inputValue, setInputValue] = useState(value ?? defaultValue ?? "");
  const [debouncedValue] = useDebounce(inputValue, 500);
  const previousValue = useRef(debouncedValue);

  useEffect(() => {
    if (previousValue.current !== debouncedValue) {
      onChange(debouncedValue);
      previousValue.current = debouncedValue;
    }
  }, [debouncedValue, onChange]);

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    setInputValue(event.target.value);
  }

  return (
    <Input
      {...rest}
      value={inputValue}
      aria-labelledby={label}
      onChange={handleInputChange}
    />
  );
}
