/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiAdminStagedEntityType } from "@eshg/service-directory-api";
import { FunctionComponent, ReactNode } from "react";

import { OverridableTableRowProps } from "@/lib/components/table/TableRow";

export interface StagedEntity {
  author: string;
  entity?: UniqueEntity;
  id: string;
  originalEntityId?: string;
  stagedEntityType: ApiAdminStagedEntityType;
}

export interface EditableEntity {
  _staged: StagedEntity[];
  author?: string;
}

export interface UniqueEntity {
  id: string;
  naturalId?: string;
}

export interface OverridableEntity<TData> {
  _override?: ReactNode | FunctionComponent<OverridableTableRowProps<TData>>;
}
