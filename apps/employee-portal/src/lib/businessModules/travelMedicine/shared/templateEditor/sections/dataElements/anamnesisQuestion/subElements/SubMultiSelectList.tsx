/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Box, Stack } from "@mui/joy";

import { ApiTemplateSubElementMultiSelect } from "@eshg/travel-medicine-api";

import { SubMultiSelectElement } from "@/lib/businessModules/travelMedicine/shared/templateEditor/sections/dataElements/anamnesisQuestion/subElements/SubMultiSelectElement";

export function SubMultiSelectList({
  multiSelectElementsFormikPath,
  multiSelectElements,
  removeMultiSelectElementHandler,
  sectionIndex,
  elementIndex,
  setInputElementRef,
}: Readonly<{
  multiSelectElementsFormikPath: string;
  multiSelectElements: ApiTemplateSubElementMultiSelect[];
  removeMultiSelectElementHandler: (index: number) => void;
  sectionIndex: number;
  elementIndex: number;
  setInputElementRef: (el: HTMLInputElement, index: number) => void;
}>) {
  return (
    <Stack
      direction="column"
      spacing={1}
      sx={{ mt: 2, mb: 2 }}
      data-testid="element-multi-select-list"
      role="list"
    >
      {multiSelectElements.map((element, index) => (
        <Box key={index} role="listitem" display="contents">
          <SubMultiSelectElement
            setInputElementRef={(el) => setInputElementRef(el, index)}
            subElementIndex={index}
            multiSelectDeleteHandler={() =>
              removeMultiSelectElementHandler(index)
            }
            multiSelectElementFormikPath={`${multiSelectElementsFormikPath}[${index}]`}
            label={`${sectionIndex + 1}. Sektion, ${elementIndex + 1}. Element, ${index + 1}. Antwort`}
          />
        </Box>
      ))}
    </Stack>
  );
}
