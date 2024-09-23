/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useGetPacklistDefinitionRevision } from "@/lib/businessModules/inspection/api/queries/packlistDefinition";
import { CreateOrEditPacklistDefinitionSidebar } from "@/lib/businessModules/inspection/components/packlistDefinition/CreateOrEditPacklistDefinitionSidebar";

interface EditPacklistDefinitionSidebarProps {
  onClose: () => void;
  readonly?: boolean;
  revisionId: string;
  version: number;
  onClickNewRevision?: (
    defId: string,
    version: number,
    revisionId: string,
  ) => void;
}

export function EditPacklistDefinitionSidebar({
  onClose,
  readonly,
  revisionId,
  version,
  onClickNewRevision,
}: Readonly<EditPacklistDefinitionSidebarProps>) {
  const { data: packlistRevision } =
    useGetPacklistDefinitionRevision(revisionId);
  return (
    <CreateOrEditPacklistDefinitionSidebar
      open
      onClose={onClose}
      pldRevision={packlistRevision}
      readonly={readonly}
      title={
        readonly
          ? `Packlistendefinition ansehen: ${packlistRevision.name}`
          : `Packlistendefinition bearbeiten: ${packlistRevision.name}`
      }
      onClickNewRevision={onClickNewRevision}
      version={version}
    />
  );
}
