/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { FormikErrors } from "formik";
import { ReactElement } from "react";

export type SidebarStep<T> = StandardSidebarStep<T> | BranchingSidebarStep<T>;

interface SidebarStepProps<T> {
  title: string;
  content: ReactElement;
  validator?: (model: T) => FormikErrors<object> | undefined;
  disableContinue?: ((model: T) => boolean) | boolean;
}

export interface StandardSidebarStep<T> {
  type: "StandardStep";
  step: SidebarStepProps<T>;
}

export interface BranchingSidebarStep<T> {
  type: "BranchingStep";
  branch: (model: T) => SidebarStepProps<T>;
}
