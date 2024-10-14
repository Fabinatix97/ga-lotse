/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiTemplateSubElementMultiSelect } from "@eshg/employee-portal-api/travelMedicine";
import { Stack } from "@mui/joy";

import { SubMultiSelectElement } from "@/lib/businessModules/travelMedicine/shared/templateEditor/sections/dataElements/subElements/SubMultiSelectElement";

export function SubMultiSelectList({
  multiSelectElementsFormikPath,
  multiSelectElements,
  removeMultiSelectElementHandler,
}: Readonly<{
  multiSelectElementsFormikPath: string;
  multiSelectElements: ApiTemplateSubElementMultiSelect[];
  removeMultiSelectElementHandler: (index: number) => void;
}>) {
  return (
    <Stack
      direction="column"
      spacing={1}
      sx={{ mt: 2, mb: 2 }}
      data-testid="multiselects"
    >
      {multiSelectElements.map((element, index) => (
        <SubMultiSelectElement
          key={index}
          elementIndex={index}
          multiSelectDeleteHandler={() =>
            removeMultiSelectElementHandler(index)
          }
          multiSelectElementFormikPath={`${multiSelectElementsFormikPath}[${index}]`}
        />
      ))}
    </Stack>
  );
}
