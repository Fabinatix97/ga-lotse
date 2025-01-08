/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Input, InputProps } from "@mui/joy";
import { ChangeEvent, useEffect, useRef, useState } from "react";

interface DebounceProps {
  onChange: (value: string) => void;
  timeoutMs: number;
  label: string;
}

export function DebouncedInput(
  props: Omit<InputProps, "onChange"> & DebounceProps,
) {
  const { onChange, timeoutMs, label, value, defaultValue, ...rest } = props;
  const [stateValue, setStateValue] = useState(value ?? defaultValue);

  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (!timerRef.current) setStateValue(value);
  }, [value]);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setStateValue(event.target.value);
    const value = event.target.value;
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onChange(value);
      timerRef.current = undefined;
    }, timeoutMs);
  }

  return (
    <Input
      {...rest}
      value={stateValue}
      onChange={handleChange}
      aria-labelledby={label}
    />
  );
}
