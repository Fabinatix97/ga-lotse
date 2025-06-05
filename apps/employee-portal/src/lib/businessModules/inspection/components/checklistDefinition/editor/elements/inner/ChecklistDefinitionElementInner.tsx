/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type { FC } from "react";

import { ApiCLSectionContextElementsInner } from "@eshg/inspection-api";

import { ChecklistDefinitionElementCheckboxInner } from "@/lib/businessModules/inspection/components/checklistDefinition/editor/elements/inner/ChecklistDefinitionElementCheckboxInner";
import { ChecklistDefinitionElementMultiInner } from "@/lib/businessModules/inspection/components/checklistDefinition/editor/elements/inner/ChecklistDefinitionElementMultiInner";

export interface ChecklistDefinitionElementInnerProps<
  TElement = ApiCLSectionContextElementsInner,
> {
  sectionIndex: number;
  elementIndex: number;
  element: { type: ApiCLSectionContextElementsInner["type"] } & TElement;
  setElement: (
    element: { type: ApiCLSectionContextElementsInner["type"] } & TElement,
  ) => void;
}

const typeComponentMap: Partial<
  Record<
    ApiCLSectionContextElementsInner["type"],
    FC<ChecklistDefinitionElementInnerProps> | null
  >
> = {
  CHECKBOX: ChecklistDefinitionElementCheckboxInner,
  MULTI_SELECT: ChecklistDefinitionElementMultiInner,
  SINGLE_SELECT: ChecklistDefinitionElementMultiInner,
  TEXT: null,
  IMAGE: null,
  AUDIO: null,
};

export function ChecklistDefinitionElementInner(
  props: ChecklistDefinitionElementInnerProps,
) {
  const type = props.element.type;
  const Component = typeComponentMap[type];

  if (!Component) {
    return;
  }

  return (
    <div data-testid="function-form">
      <Component {...props} />
    </div>
  );
}
