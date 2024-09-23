/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { CreateOrEditPacklistDefinitionSidebar } from "@/lib/businessModules/inspection/components/packlistDefinition/CreateOrEditPacklistDefinitionSidebar";

interface CreatePacklistDefinitionSidebarProps {
  onClose: () => void;
}

export function CreatePacklistDefinitionSidebar({
  onClose,
}: Readonly<CreatePacklistDefinitionSidebarProps>) {
  return (
    <CreateOrEditPacklistDefinitionSidebar
      open
      onClose={onClose}
      title={"Packliste erstellen"}
    />
  );
}
