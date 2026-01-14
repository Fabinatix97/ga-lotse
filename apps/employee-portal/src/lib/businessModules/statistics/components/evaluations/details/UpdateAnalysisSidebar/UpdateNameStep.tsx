/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";
import { PropsWithChildren } from "react";

import { InputField } from "@eshg/lib-portal";

import { SidebarStepContentProps } from "@/lib/shared/components/SidebarStepper/sidebarStep";

export interface UpdateNameStepFormModel {
  name: string;
}

export function UpdateAnalysisStep({
  children,
  ...props
}: PropsWithChildren<SidebarStepContentProps<UpdateNameStepFormModel>>) {
  return (
    <Stack gap={3}>
      <InputField
        autoFocus
        name={props.fieldName("name")}
        label="Name der Analyse"
        required="Bitte Name angeben."
      />
      {children}
    </Stack>
  );
}
