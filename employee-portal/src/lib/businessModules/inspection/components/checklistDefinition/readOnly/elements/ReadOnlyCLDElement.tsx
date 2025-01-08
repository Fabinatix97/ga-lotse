/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiCLSectionContextElementsInner } from "@eshg/employee-portal-api/inspection";
import { Divider } from "@mui/joy";

import { ReadOnlyCLDElementCheckbox } from "@/lib/businessModules/inspection/components/checklistDefinition/readOnly/elements/inner/ReadOnlyCLDElementCheckbox";
import { ReadOnlyCLDElementFile } from "@/lib/businessModules/inspection/components/checklistDefinition/readOnly/elements/inner/ReadOnlyCLDElementFile";
import { ReadOnlyCLDElementMultiSelect } from "@/lib/businessModules/inspection/components/checklistDefinition/readOnly/elements/inner/ReadOnlyCLDElementMultiSelect";
import { ReadOnlyCLDElementText } from "@/lib/businessModules/inspection/components/checklistDefinition/readOnly/elements/inner/ReadOnlyCLDElementText";

export interface ReadOnlyCLDElementProps<
  TElement extends Omit<ApiCLSectionContextElementsInner, "type"> = Omit<
    Exclude<
      ApiCLSectionContextElementsInner,
      | { type: "SEPARATOR" }
      | { type: "CLSeparatorContext" }
      | { type: "CLAudioContext" }
      | { type: "CLCheckboxContext" }
      | { type: "CLImageContext" }
      | { type: "CLMultiSelectContext" }
      | { type: "CLSingleSelectContext" }
      | { type: "CLTextElementContext" }
    >,
    "type"
  > & {
    type: string;
  },
> {
  element: TElement;
  sectionIndex: number;
  elementIndex: number;
}

export function ReadOnlyCLDElement(
  props: Readonly<ReadOnlyCLDElementProps<ApiCLSectionContextElementsInner>>,
) {
  switch (props.element.type) {
    case "SEPARATOR":
      return <Divider />;
    case "TEXT":
      return <ReadOnlyCLDElementText {...props} />;
    case "CHECKBOX":
      return <ReadOnlyCLDElementCheckbox {...props} />;
    case "MULTI_SELECT":
    case "SINGLE_SELECT":
      return <ReadOnlyCLDElementMultiSelect {...props} />;
    case "IMAGE":
    case "AUDIO":
      return <ReadOnlyCLDElementFile {...props} />;
  }
}
