/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Grid, IconButton, Stack } from "@mui/joy";

import { notEmptyFieldValidation } from "@/lib/businessModules/travelMedicine/shared/templateEditor/templateFieldValidation";

export function SubQuestion({
  subElementTextFormikPath,
  subQuestionDeleteHandler,
  multiSelectLength,
  label,
}: Readonly<{
  subElementTextFormikPath: string;
  subQuestionDeleteHandler: () => void;
  multiSelectLength: number;
  label: string;
}>) {
  return (
    <Grid container spacing={1}>
      <Grid xs={12}>
        {multiSelectLength > 0
          ? `Antwort ${multiSelectLength + 1}: Freifeldtext `
          : "Textfeld wird nur bei Ja angezeigt"}
      </Grid>
      <Grid xs={12}>
        <Stack direction="row" spacing={1} alignItems={"flex-start"}>
          <InputField
            label
            aria-label={
              multiSelectLength > 0
                ? `${label}, Antwort ${multiSelectLength + 1}, Freifeldtext, Label`
                : `${label}, Label`
            }
            name={`${subElementTextFormikPath}.questionText`}
            placeholder="Label"
            sx={{ flex: 1 }}
            validate={notEmptyFieldValidation}
            data-testid="element-subelement-text"
          />
          <Stack alignItems="center" paddingTop={"6px"}>
            <IconButton
              aria-label="Entfernen"
              color="warning"
              variant="outlined"
              onClick={subQuestionDeleteHandler}
              title="Unterfrage löschen"
            >
              <DeleteOutlineIcon />
            </IconButton>
          </Stack>
        </Stack>
      </Grid>
      <Grid xs={11.63}>
        <InputField
          label
          aria-label={
            multiSelectLength > 0
              ? `${label}, Antwort ${multiSelectLength + 1}, Freifeldtext, Textfeld`
              : `${label}, Textfeld`
          }
          disabled
          name="SubTextAnswer"
          placeholder="Textfeld"
        />
      </Grid>
    </Grid>
  );
}
