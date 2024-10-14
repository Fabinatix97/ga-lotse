/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Box, IconButton, Stack } from "@mui/joy";

import { validateSelectField } from "@/lib/businessModules/travelMedicine/shared/templateEditor/templateFieldValidation";

export function SubMultiSelectElement({
  multiSelectElementFormikPath,
  multiSelectDeleteHandler,
  elementIndex,
}: Readonly<{
  multiSelectElementFormikPath: string;
  elementIndex: number;
  multiSelectDeleteHandler: () => void;
}>) {
  return (
    <Stack direction="row" spacing={1} alignItems="flex-start">
      <Box sx={{ paddingTop: "12px" }}>{`Antwort ${elementIndex + 1}:`}</Box>

      <InputField
        label
        name={`${multiSelectElementFormikPath}.questionText`}
        placeholder="Frage eingeben"
        sx={{ flex: 1 }}
        validate={validateSelectField}
        data-testid={`multiSelectQuestionText-${elementIndex}`}
      />
      <Stack alignItems="center" paddingTop={"6px"}>
        <IconButton
          onClick={multiSelectDeleteHandler}
          aria-label="Entfernen"
          color="warning"
          variant="outlined"
          title="Antwortmöglichkeit löschen"
          data-testid={`deleteMultiSelectQuestionText-${elementIndex}`}
        >
          <DeleteOutlineIcon />
        </IconButton>
      </Stack>
    </Stack>
  );
}
