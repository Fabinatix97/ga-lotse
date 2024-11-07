/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { IconButton, Stack } from "@mui/joy";

import { DataElementBox } from "@/lib/businessModules/travelMedicine/shared/templateEditor/sections/dataElements/DataElementBox";
import { DataElementHeading } from "@/lib/businessModules/travelMedicine/shared/templateEditor/sections/dataElements/DataElementHeading";
import { notEmptyFieldValidation } from "@/lib/businessModules/travelMedicine/shared/templateEditor/templateFieldValidation";

export interface TemplateConfirmationProps {
  sectionElementFormikPath: string;
  sectionElementDeleteHandler: () => void;
}
export function TemplateConfirmation(
  props: Readonly<TemplateConfirmationProps>,
) {
  return (
    <DataElementBox data-testid="section-element-confirmation">
      <DataElementHeading>Bestätigungsfeld</DataElementHeading>
      <Stack direction="row" spacing={1} alignItems={"flex-start"}>
        <InputField
          label
          name={`${props.sectionElementFormikPath}.confirmationTextField`}
          placeholder="Textfeld"
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
