/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Box, Card, Grid, IconButton, Stack, styled } from "@mui/joy";
import { useId } from "react";

import { InputField } from "@eshg/lib-portal";

import { validateLabelText } from "@/lib/businessModules/travelMedicine/shared/templateEditor/templateFieldValidation";

export function SubQuestion({
  subElementTextFormikPath,
  subQuestionDeleteHandler,
  multiSelectLength,
  label,
  setInputElementRef,
}: Readonly<{
  subElementTextFormikPath: string;
  subQuestionDeleteHandler: () => void;
  multiSelectLength: number;
  label: string;
  setInputElementRef: (el: HTMLInputElement) => void;
}>) {
  const detailsId = useId();
  return (
    <Box display="contents" role="group" aria-label={label}>
      <Grid container spacing={1}>
        <Grid id={detailsId} xs={12}>
          {multiSelectLength > 0
            ? `Antwort ${multiSelectLength + 1}: Freifeldtext `
            : "Textfeld wird nur bei Ja angezeigt"}
        </Grid>
        <Grid xs={12}>
          <Stack direction="row" spacing={1} alignItems="flex-start">
            <InputField
              ref={setInputElementRef}
              label
              aria-label={
                multiSelectLength > 0
                  ? `${label}, Antwort ${multiSelectLength + 1}, Freifeldtext, Label`
                  : `${label}, Label`
              }
              aria-details={detailsId}
              name={`${subElementTextFormikPath}.questionText`}
              placeholder="Label"
              sx={{ flex: 1 }}
              validate={validateLabelText()}
              data-testid="element-subelement-text"
            />
            <Stack alignItems="center" paddingTop="6px">
              <IconButton
                aria-label="Entfernen"
                color="warning"
                variant="outlined"
                title="Unterfrage löschen"
                onClick={subQuestionDeleteHandler}
              >
                <DeleteOutlineIcon />
              </IconButton>
            </Stack>
          </Stack>
        </Grid>
        <Grid xs={11.63}>
          <ReadOnlyInputField>Textfeld</ReadOnlyInputField>
        </Grid>
      </Grid>
    </Box>
  );
}

// use a Card to make something that looks like a text input
const ReadOnlyInputField = styled(Card)(({ theme }) => ({
  height: 36,
  padding: "0 0.75rem",
  lineHeight: "2.125rem",
  color: theme.palette.neutral.solidDisabledColor,
  borderColor: theme.palette.neutral.outlinedDisabledBorder,
}));
