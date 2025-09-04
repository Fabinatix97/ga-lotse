/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Box, IconButton, Stack } from "@mui/joy";
import { useId } from "react";

import { InputField } from "@eshg/lib-portal";

import { validateSubElementMultiselectOption } from "@/lib/businessModules/travelMedicine/shared/templateEditor/templateFieldValidation";

export function SubMultiSelectElement({
  multiSelectElementFormikPath,
  multiSelectDeleteHandler,
  subElementIndex,
  label,
  setInputElementRef,
}: Readonly<{
  multiSelectElementFormikPath: string;
  multiSelectDeleteHandler: () => void;
  subElementIndex: number;
  label: string;
  setInputElementRef: (el: HTMLInputElement) => void;
}>) {
  const id = useId();
  return (
    <Stack
      direction="row"
      spacing={1}
      alignItems="flex-start"
      role="group"
      aria-label={label}
    >
      <Box
        sx={{ paddingTop: "12px" }}
        id={id}
      >{`Antwort ${subElementIndex + 1}:`}</Box>

      <InputField
        ref={setInputElementRef}
        label
        aria-label={label}
        name={`${multiSelectElementFormikPath}.questionText`}
        placeholder="Antwortmöglichkeit eingeben"
        sx={{ flex: 1 }}
        validate={validateSubElementMultiselectOption()}
        data-testid={`element-multi-select-${subElementIndex}`}
      />
      <Stack alignItems="center" paddingTop="6px">
        <IconButton
          aria-label="Entfernen"
          color="warning"
          variant="outlined"
          title="Antwortmöglichkeit löschen"
          data-testid={`element-multi-select-delete-button-${subElementIndex}`}
          onClick={multiSelectDeleteHandler}
        >
          <DeleteOutlineIcon />
        </IconButton>
      </Stack>
    </Stack>
  );
}
