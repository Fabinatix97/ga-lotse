/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { SidebarWithFormRefProps } from "@eshg/lib-employee-portal";

import { useGetObjectTypes } from "@/lib/businessModules/inspection/api/queries/objectTypes";
import { EmbeddedCreateOrEditPacklistDefinitionSidebar } from "@/lib/businessModules/inspection/components/packlistDefinition/EmbeddedCreateOrEditPacklistDefinitionSidebar";

export function CreatePacklistDefinitionSidebar(
  props: Readonly<SidebarWithFormRefProps>,
) {
  const { data: objectTypes } = useGetObjectTypes();
  return (
    <EmbeddedCreateOrEditPacklistDefinitionSidebar
      title="Packliste erstellen"
      objectTypes={objectTypes}
      {...props}
    />
  );
}
