/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiCLCheckboxContext,
  ApiCLMultiSelectContext,
} from "@eshg/inspection-api";

import { ReadOnlyCLDElementProps } from "@/lib/businessModules/inspection/components/checklistDefinition/readOnly/elements/ReadOnlyCLDElement";
import { ReadOnlyCLDElementMultiSelect } from "@/lib/businessModules/inspection/components/checklistDefinition/readOnly/elements/inner/ReadOnlyCLDElementMultiSelect";

export function ReadOnlyCLDElementCheckbox({
  element,
  ...props
}: Readonly<ReadOnlyCLDElementProps<ApiCLCheckboxContext>>) {
  const multiSelectElement: ApiCLMultiSelectContext = {
    ...element,
    items: [
      {
        id: `${element.id}-true`,
        text: "Ja",
        textModuleTrue: element.textModuleTrue,
      },
      {
        id: `${element.id}-false`,
        text: "Nein",
        textModuleTrue: element.textModuleFalse,
      },
    ],
  };
  return (
    <ReadOnlyCLDElementMultiSelect element={multiSelectElement} {...props} />
  );
}
