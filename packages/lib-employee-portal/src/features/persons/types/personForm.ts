/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { FormikProps } from "formik";

export interface PersonFormProps<TValues> extends FormikProps<TValues> {
  title: string;
  subtitle?: string;
  submitLabel: string;
  onBack?: () => void;
  onCancel: () => void;
  onDelete?: () => void;
  addressRequired?: boolean;
  mode?: "edit" | "create";
}

export interface PersonFormValues {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
}
