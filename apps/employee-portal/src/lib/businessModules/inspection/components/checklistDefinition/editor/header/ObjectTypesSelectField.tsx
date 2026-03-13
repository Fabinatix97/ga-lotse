/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiObjectType,
  ApiObjectTypeHierarchyTreeNode,
} from "@eshg/inspection-api";
import { SelectField } from "@eshg/lib-portal";

import { useIsNewFeatureEnabled } from "@/lib/businessModules/inspection/api/queries/feature";

interface ObjectTypesSelectFieldProps {
  name: string;
  objectTypes: ApiObjectType[] | ApiObjectTypeHierarchyTreeNode[];
  disabled?: boolean;
  onChange?: (value: string) => void;
}

function isApiObjectType(
  row: ApiObjectTypeHierarchyTreeNode | ApiObjectType,
): row is ApiObjectType {
  return !("subNodes" in row);
}

export function ObjectTypesSelectField({
  name,
  disabled,
  objectTypes,
  onChange,
}: Readonly<ObjectTypesSelectFieldProps>) {
  const featureToggleEnabled = useIsNewFeatureEnabled("OBJECT_TYPE_HIERARCHY");

  const objectTypeOptions = featureToggleEnabled
    ? []
    : objectTypes.filter(isApiObjectType).map((o) => ({
        value: o.id,
        label: o.name,
      }));

  return (
    <SelectField
      name={name}
      label="Objekttyp"
      required="Bitte einen Objekttyp auswählen."
      placeholder="Objekttyp auswählen"
      disabled={disabled}
      options={objectTypeOptions}
      groupedOptions={
        featureToggleEnabled ? transformData(objectTypes) : undefined
      }
      onChange={(objectType) => onChange?.(objectType)}
    />
  );
}

interface ObjectType {
  id: string;
  name: string;
}

interface DataNode {
  name: string;
  objectTypes?: ObjectType[];
  subNodes?: DataNode[];
}

interface GroupedOption {
  id: string;
  name: string;
}

export function transformData(
  data: DataNode | DataNode[],
): Record<string, GroupedOption[]> {
  const groups: Record<string, GroupedOption[]> = {};

  function traverse(node: DataNode): void {
    if (!node) return;

    if (node.name) {
      groups[node.name] = node.objectTypes ?? [];
    }

    if (node.subNodes && node.subNodes.length > 0) {
      node.subNodes.forEach((subNode) => traverse(subNode));
    }
  }

  if (Array.isArray(data)) {
    data.forEach((item) => traverse(item));
  } else {
    traverse(data);
  }

  return groups;
}
