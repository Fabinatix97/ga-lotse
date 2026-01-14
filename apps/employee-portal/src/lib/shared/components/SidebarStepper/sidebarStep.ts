/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { FormikErrors, FormikValues } from "formik";
import { ReactElement } from "react";

export type SidebarStep<
  TStepFormModel extends FormikValues,
  TStepperFormModel,
> = (prevStepsValues: TStepperFormModel) => SidebarStepProps<TStepFormModel>;

interface SidebarStepProps<TStepFormModel extends FormikValues> {
  title: string;
  content: (values: TStepFormModel) => ReactElement;
  initialValues: TStepFormModel;
  validator?: (model: TStepFormModel) => FormikErrors<object> | undefined;
}

export interface SidebarStepContentProps<T extends FormikValues> {
  values: T;
  fieldName: (fieldName: string & keyof T) => string;
}
