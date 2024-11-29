/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiTemplateSubElementMultiSelect } from "@eshg/employee-portal-api/travelMedicine";
import { Stack } from "@mui/joy";

import { SubMultiSelectElement } from "@/lib/businessModules/travelMedicine/shared/templateEditor/sections/dataElements/anamnesisQuestion/subElements/SubMultiSelectElement";

export function SubMultiSelectList({
  multiSelectElementsFormikPath,
  multiSelectElements,
  removeMultiSelectElementHandler,
  sectionIndex,
  elementIndex,
}: Readonly<{
  multiSelectElementsFormikPath: string;
  multiSelectElements: ApiTemplateSubElementMultiSelect[];
  removeMultiSelectElementHandler: (index: number) => void;
  sectionIndex: number;
  elementIndex: number;
}>) {
  return (
    <Stack
      direction="column"
      spacing={1}
      sx={{ mt: 2, mb: 2 }}
      data-testid="element-multi-select-list"
    >
      {multiSelectElements.map((element, index) => (
        <SubMultiSelectElement
          key={index}
          subElementIndex={index}
          multiSelectDeleteHandler={() =>
            removeMultiSelectElementHandler(index)
          }
          multiSelectElementFormikPath={`${multiSelectElementsFormikPath}[${index}]`}
          label={`${sectionIndex + 1}. Sektion, ${elementIndex + 1}. Element, ${index + 1}. Antwort`}
        />
      ))}
    </Stack>
  );
}
