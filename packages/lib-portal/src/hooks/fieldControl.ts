/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { FieldHelperProps } from "formik";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

import {
  UseBaseFieldProps,
  useBaseField,
} from "../components/formFields/BaseField";

export interface FieldControl<TValue> {
  value: TValue;
  required: boolean;
  error: boolean;
  helperText?: string;
  setValue: FieldHelperProps<TValue>["setValue"];
  setTouched: FieldHelperProps<TValue>["setTouched"];
}

export function useFieldControl<TValue>(
  props: UseBaseFieldProps<TValue>,
): FieldControl<TValue> {
  const field = useBaseField(props);

  return {
    value: field.input.value,
    required: field.required,
    helperText: field.helperText,
    error: field.error,
    setValue: field.helpers.setValue,
    setTouched: field.helpers.setTouched,
  };
}

export function useDebouncedFieldControl<TValue>(
  props: UseBaseFieldProps<TValue>,
): FieldControl<TValue> {
  const field = useBaseField(props);
  const [liveValue, setLiveValue] = useState(field.input.value);
  const debouncedSetValue = useDebouncedCallback(
    (newValue: TValue) => field.helpers.setValue(newValue),
    250,
    { trailing: true },
  );

  useEffect(() => {
    setLiveValue(field.input.value);
  }, [field.input.value]);

  return {
    value: liveValue,
    required: field.required,
    helperText: field.helperText,
    error: field.error,
    setValue: async (newValue: TValue) => {
      setLiveValue(newValue);
      await debouncedSetValue(newValue);
    },
    setTouched: async () => {
      await debouncedSetValue.flush();
      await field.helpers.setTouched(true);
    },
  };
}
