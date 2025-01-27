/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiDocumentAnamnesisQuestion,
  ApiDocumentSubElementMultiSelect,
} from "@eshg/citizen-portal-api/travelMedicine";
import {
  BaseFieldProps,
  useBaseField,
} from "@eshg/lib-portal/components/formFields/BaseField";
import { Checkbox, List, ListItem, Stack, Typography } from "@mui/joy";
import { ChangeEvent } from "react";

import { useTranslation } from "@/lib/i18n/client";

interface DocumentMultiSelectElementProps
  extends Omit<BaseFieldProps, "required" | "children"> {
  anamnesisQuestion: ApiDocumentAnamnesisQuestion;
  elementIndex: number;
  name: string;
  parentPath: string;
}

export function DocumentMultiSelectElement({
  anamnesisQuestion,
  elementIndex,
  parentPath,
  ...restProps
}: Readonly<DocumentMultiSelectElementProps>) {
  const { t } = useTranslation(["travelMedicine/document"]);
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
        marginX: 2.5,
      }}
      gap={1}
    >
      <Typography level={"body-md"}>{t("multiSelectWhich")}</Typography>
      <List
        size="sm"
        role="group"
        aria-labelledby="checkbox-group"
        sx={{ rowGap: 4 }}
      >
        {anamnesisQuestion.subElementMultiSelect.map(
          ({ questionText }, index) => (
            <ListItem
              key={"multiselect" + elementIndex + "-" + index}
              sx={{
                "--ListItem-paddingY": 0,
                "--ListItem-minHeight": "1rem",
                "--ListItem-paddingLeft": 0,
              }}
            >
              <Checkbox
                size={"md"}
                name={`${parentPath}.subElementMultiSelect[${index}].answer`}
                checked={
                  input.value.find(
                    (option) => option.questionText === questionText,
                  )?.answer ?? false
                }
                onChange={async (value) => {
                  await handleCheckboxChange(value, questionText);
                }}
                label={questionText}
              />
            </ListItem>
          ),
        )}
      </List>
    </Stack>
  );
}
