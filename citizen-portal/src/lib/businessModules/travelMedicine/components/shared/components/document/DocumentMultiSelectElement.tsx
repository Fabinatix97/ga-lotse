/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiMedicalHistorySectionElement,
  ApiMedicalHistorySubElementMultiSelect,
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
  element: ApiMedicalHistorySectionElement;
  sectionIndex: number;
  elementIndex: number;
  name: string;
}

export function DocumentMultiSelectElement({
  element,
  sectionIndex,
  elementIndex,
  ...restProps
}: Readonly<DocumentMultiSelectElementProps>) {
  const { t } = useTranslation(["travelMedicine/document"]);
  const { input, helpers } = useBaseField<
    ApiMedicalHistorySubElementMultiSelect[]
  >({ ...restProps });

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
      style={{
        marginLeft: "20px",
        marginRight: "20px",
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
        {element.elementData.subElementMultiSelect.map(
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
                name={
                  "sections[" +
                  sectionIndex +
                  "].sectionElements[" +
                  elementIndex +
                  "].elementData.subElementMultiSelect[" +
                  index +
                  "].answer"
                }
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
