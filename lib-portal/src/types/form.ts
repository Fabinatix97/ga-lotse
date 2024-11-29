/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { FormikHelpers } from "formik";
import { ReactNode } from "react";

export type OptionalFieldValue<TValue> = TValue | "";
export type NullableFieldValue<TValue> = TValue | null;

export interface FormProps<TFormValues> {
  initialValues: TFormValues;
  onSubmit: (formValues: TFormValues) => Promise<unknown>;
}

export interface NestedFormProps {
  name: string;
}

export interface FieldProps<TValue> extends ValidationRules<TValue> {
  name: string;
  label: string | ReactNode;
  hint?: string;
}

export interface ValidationRules<TValue> {
  required?: string;
  validate?: Validator<TValue>;
}

export type Validator<TValue> = (value: TValue) => string | undefined;

/**
 * Relaxes types on values used as input to server actions
 *
 * This enables passing validated but not strictly-typed values
 * from forms to server actions without using type-casts.
 */
export type Unvalidated<TValue> = TValue extends string | number
  ? TValue | "" // string union --> string union | "", number --> number | ""
  : TValue extends (infer TItem)[]
    ? Unvalidated<TItem>[] // Item[] -> Unvalidated<Item>[]
    : TValue extends object
      ?
          | {
              [TKey in keyof TValue]: Unvalidated<TValue[TKey]>;
            }
          | null // object --> Unvalidated<object> | null
      : TValue;

export type SetFieldValueHelper<TValues = unknown> =
  FormikHelpers<TValues>["setFieldValue"];
