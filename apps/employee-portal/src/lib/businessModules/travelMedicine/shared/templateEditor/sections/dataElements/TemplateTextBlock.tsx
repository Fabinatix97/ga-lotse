/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { IconButton, Stack } from "@mui/joy";

import { TextareaField } from "@eshg/lib-portal";

import { DataElementBox } from "@/lib/businessModules/travelMedicine/shared/templateEditor/sections/dataElements/DataElementBox";
import { DataElementHeading } from "@/lib/businessModules/travelMedicine/shared/templateEditor/sections/dataElements/DataElementHeading";
import { validateTextBlock } from "@/lib/businessModules/travelMedicine/shared/templateEditor/templateFieldValidation";

interface TemplateTextBlockProps {
  sectionElementFormikPath: string;
  sectionElementDeleteHandler: () => void;
  label: string;
  setInputElementRef: (el: HTMLInputElement) => void;
  showDeleteButton: boolean;
}

export function TemplateTextBlock(props: Readonly<TemplateTextBlockProps>) {
  return (
    <DataElementBox
      data-testid="section-element-textbox"
      role="group"
      aria-label={props.label}
    >
      <DataElementHeading>Textblock</DataElementHeading>
      <Stack direction="row" spacing={1} alignItems="flex-start">
        <TextareaField
          ref={props.setInputElementRef}
          label
          aria-label={props.label}
          name={`${props.sectionElementFormikPath}.textField`}
          placeholder="Text"
          sx={{ flex: 1 }}
          validate={validateTextBlock()}
          data-testid="element-main-text"
        />
        {props.showDeleteButton && (
          <Stack alignItems="center" paddingTop="6px">
            <IconButton
              aria-label="Entfernen"
              color="warning"
              variant="outlined"
              title="Entfernen"
              data-testid="element-delete-button"
              onClick={props.sectionElementDeleteHandler}
            >
              <DeleteOutlineIcon />
            </IconButton>
          </Stack>
        )}
      </Stack>
    </DataElementBox>
  );
}
