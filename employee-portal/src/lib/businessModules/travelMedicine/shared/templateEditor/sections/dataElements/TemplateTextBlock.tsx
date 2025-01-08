/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { IconButton, Stack } from "@mui/joy";

import { DataElementBox } from "@/lib/businessModules/travelMedicine/shared/templateEditor/sections/dataElements/DataElementBox";
import { DataElementHeading } from "@/lib/businessModules/travelMedicine/shared/templateEditor/sections/dataElements/DataElementHeading";
import { notEmptyFieldValidation } from "@/lib/businessModules/travelMedicine/shared/templateEditor/templateFieldValidation";
import { TextareaField } from "@/lib/shared/components/formFields/TextareaField";

export interface TemplateTextBlockProps {
  sectionElementFormikPath: string;
  sectionElementDeleteHandler: () => void;
  label: string;
}

export function TemplateTextBlock(props: Readonly<TemplateTextBlockProps>) {
  return (
    <DataElementBox data-testid="section-element-textbox">
      <DataElementHeading>Textblock</DataElementHeading>
      <Stack direction="row" spacing={1} alignItems={"flex-start"}>
        <TextareaField
          label
          aria-label={props.label}
          name={`${props.sectionElementFormikPath}.textField`}
          placeholder="Text"
          sx={{ flex: 1 }}
          validate={notEmptyFieldValidation}
          data-testid="element-main-text"
        />
        <Stack alignItems="center" paddingTop={"6px"}>
          <IconButton
            onClick={props.sectionElementDeleteHandler}
            aria-label="Entfernen"
            color="warning"
            variant="outlined"
            title="Entfernen"
            data-testid="element-delete-button"
          >
            <DeleteOutlineIcon />
          </IconButton>
        </Stack>
      </Stack>
    </DataElementBox>
  );
}
