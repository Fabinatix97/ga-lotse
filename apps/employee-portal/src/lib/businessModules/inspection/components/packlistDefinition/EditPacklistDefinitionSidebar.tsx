/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useSuspenseQueries } from "@tanstack/react-query";

import { SidebarWithFormRefProps } from "@eshg/lib-employee-portal";

import {
  useObjectTypeApi,
  usePacklistDefinitionApi,
} from "@/lib/businessModules/inspection/api/clients";
import { getObjectTypesQuery } from "@/lib/businessModules/inspection/api/queries/objectTypes";
import { getPacklistDefinitionRevisionQuery } from "@/lib/businessModules/inspection/api/queries/packlistDefinition";
import { EmbeddedCreateOrEditPacklistDefinitionSidebar } from "@/lib/businessModules/inspection/components/packlistDefinition/EmbeddedCreateOrEditPacklistDefinitionSidebar";

interface EditPacklistDefinitionSidebarProps extends SidebarWithFormRefProps {
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
  readonly,
  revisionId,
  ...props
}: Readonly<EditPacklistDefinitionSidebarProps>) {
  const objectTypeApi = useObjectTypeApi();
  const packlistDefinitionApi = usePacklistDefinitionApi();

  const [{ data: packlistRevision }, { data: objectTypes }] =
    useSuspenseQueries({
      queries: [
        getPacklistDefinitionRevisionQuery(packlistDefinitionApi, revisionId),
        getObjectTypesQuery(objectTypeApi),
      ],
    });

  return (
    <EmbeddedCreateOrEditPacklistDefinitionSidebar
      pldRevision={packlistRevision}
      readonly={readonly}
      title={
        readonly
          ? `Packlistendefinition ansehen: ${packlistRevision.name}`
          : `Packlistendefinition bearbeiten: ${packlistRevision.name}`
      }
      objectTypes={objectTypes}
      {...props}
    />
  );
}
