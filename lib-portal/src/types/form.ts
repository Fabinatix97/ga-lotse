/**
 * Copyright 2025 cronn GmbH
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

export type SetFieldValueHelper<TValues = unknown> =
  FormikHelpers<TValues>["setFieldValue"];
