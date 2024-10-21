/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useGetObjectTypes } from "@/lib/businessModules/inspection/api/queries/objectTypes";
import { CreateOrEditPacklistDefinitionSidebar } from "@/lib/businessModules/inspection/components/packlistDefinition/CreateOrEditPacklistDefinitionSidebar";

interface CreatePacklistDefinitionSidebarProps {
  onClose: () => void;
}

export function CreatePacklistDefinitionSidebar({
  onClose,
}: Readonly<CreatePacklistDefinitionSidebarProps>) {
  const { data: objectTypes } = useGetObjectTypes();
  return (
    <CreateOrEditPacklistDefinitionSidebar
      open
      onClose={onClose}
      title={"Packliste erstellen"}
      objectTypes={objectTypes}
    />
  );
}
