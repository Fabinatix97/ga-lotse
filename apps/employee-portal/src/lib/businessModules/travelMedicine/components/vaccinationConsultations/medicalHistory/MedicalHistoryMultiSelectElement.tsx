/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Checkbox, List, ListItem, Stack } from "@mui/joy";
import { ChangeEvent } from "react";

import { BaseFieldProps, useBaseField } from "@eshg/lib-portal";
import {
  ApiDocumentSectionElement,
  ApiDocumentSubElementMultiSelect,
} from "@eshg/travel-medicine-api";

interface MedicalHistoryMultiSelectElementProps extends Omit<
  BaseFieldProps,
  "required" | "children"
> {
  element: ApiDocumentSectionElement;
  sectionIndex: number;
  elementIndex: number;
  name: string;
  readOnly?: boolean;
}

export function MedicalHistoryMultiSelectElement({
  element,
  sectionIndex,
  elementIndex,
  readOnly = false,
  ...restProps
}: Readonly<MedicalHistoryMultiSelectElementProps>) {
  const { input, helpers } = useBaseField<ApiDocumentSubElementMultiSelect[]>({
    ...restProps,
  });

  async function handleCheckboxChange(
    event: ChangeEvent<HTMLInputElement>,
    questionText: string,
  ) {
    const checked = event.target?.checked;
    if (checked) {
      input.value.map((option) => {
        if (option.questionText === questionText) {
          option.answer = true;
        }
      });
      const newArray = [...input.value];
      await helpers.setValue(newArray);
    } else if (!checked) {
      input.value.map((option) => {
        if (option.questionText === questionText) {
          option.answer = false;
        }
      });
      const newArray = [...input.value];
      await helpers.setValue(newArray);
    }
    input.onChange(event);
  }

  return (
    <Stack
      sx={{
        marginLeft: 2,
      }}
    >
      <List
        size="sm"
        role="group"
        aria-labelledby="checkbox-group"
        sx={{ rowGap: 1, marginBlock: "0.5rem" }}
      >
        {(readOnly
          ? element.anamnesisQuestion!.subElementMultiSelect.filter(
              (element) => element.answer,
            )
          : element.anamnesisQuestion!.subElementMultiSelect
        ).map(({ questionText }, index) => (
          <ListItem
            key={"multiselect" + elementIndex + "-" + index}
            sx={{
              "--ListItem-paddingY": 0,
              "--ListItem-minHeight": "1rem",
              "--ListItem-paddingLeft": 0,
            }}
          >
            <Checkbox
              size="sm"
              name={
                "medicalHistoryContent.sections[" +
                sectionIndex +
                "].sectionElements[" +
                elementIndex +
                "].anamnesisQuestion.subElementMultiSelect[" +
                index +
                "].answer"
              }
              checked={
                input.value.find(
                  (option) => option.questionText === questionText,
                )?.answer ?? false
              }
              label={questionText}
              disabled={readOnly}
              onChange={async (value) => {
                await handleCheckboxChange(value, questionText);
              }}
            />
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
