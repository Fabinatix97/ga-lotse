/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  Box,
  Checkbox,
  FormControl,
  FormHelperText,
  List,
  ListItem,
} from "@mui/joy";
import { ChangeEvent, ReactNode, useId } from "react";

import { ApiInspectionFeature } from "@eshg/inspection-api";
import { useBaseField } from "@eshg/lib-portal";

import { useIsNewFeatureEnabled } from "@/lib/businessModules/inspection/api/queries/feature";
import { ChecklistLabel } from "@/lib/businessModules/inspection/components/inspection/execution/checklist/form/ChecklistLabel";
import { CLFormElement } from "@/lib/businessModules/inspection/components/inspection/execution/checklist/form/helpers";

interface ChecklistMultiSelectElementProps {
  element: CLFormElement;
  name: string;
  label: string;
  incident?: boolean;
  labelEndDecorator?: ReactNode;
  readOnly?: boolean;
}

/**
 * A multi-select component, displaying a checkbox for each option, in a
 * vertical layout.
 *
 * Note that, unfortunately, this component cannot make use of `<BaseField>` or
 * `<FormComponent>`, because Joy UI doesn't allow to add <i>multiple</i>
 * checkboxes below a `<FormComponent>`. The `<FormGroup>` component of
 * <i>Material UI</i> would be the correct solution, but it is not available
 * in Joy UI.
 *
 * TBD: extract the generic parts of this component into a base component
 */
export function ChecklistMultiSelectElement({
  element,
  label,
  incident,
  labelEndDecorator,
  readOnly,
  ...restProps
}: Readonly<ChecklistMultiSelectElementProps>) {
  const featureToggleChecklistRequirementRemovalEnabled =
    useIsNewFeatureEnabled(ApiInspectionFeature.ChecklistRequirementRemoval);

  const isMandatory =
    !featureToggleChecklistRequirementRemovalEnabled &&
    element.context.mandatory;

  const titleId = useId();
  const { input, meta, helpers, helperText } = useBaseField<string[]>({
    validate: (value: string[]) => {
      if (isMandatory && value.length === 0)
        return "Bitte mindestens eine Auswahl treffen";
      else return undefined;
    },
    ...restProps,
  });

  if (element.type !== "MULTI_SELECT") {
    return;
  }

  async function handleCheckboxChange(
    event: ChangeEvent<HTMLInputElement>,
    text: string,
  ) {
    if (readOnly) {
      return;
    }
    const checked = event.target.checked;
    if (checked && !input.value.includes(text)) {
      const newArray = [...input.value, text];
      await helpers.setValue(newArray);
    } else if (!checked) {
      const newArray = input.value.filter((a) => a !== text);
      await helpers.setValue(newArray);
    }
    input.onChange(event);
  }

  return (
    <Box display="contents" role="group" aria-labelledby={titleId}>
      <ChecklistLabel
        incident={incident}
        required={isMandatory}
        tooltipText={element.context.help}
        endDecorator={labelEndDecorator}
        note={element.context.note}
        label-id={titleId}
      >
        {label}
      </ChecklistLabel>
      <List
        size="sm"
        role="list"
        aria-labelledby="checkbox-group"
        sx={{ rowGap: 2 }}
      >
        {element.context.items?.map(({ id, text }) => (
          <ListItem
            key={id}
            sx={{
              "--ListItem-paddingY": 0,
              "--ListItem-minHeight": "1rem",
              "--ListItem-paddingLeft": 0,
            }}
          >
            <Checkbox
              size="sm"
              label={text}
              checked={input.value.includes(text)}
              readOnly={readOnly}
              onChange={(e) => handleCheckboxChange(e, text)}
            />
          </ListItem>
        ))}
      </List>
      {/* FormHelperText needs to be inside a FormControl to make it go red on error.
         See Component description to see why we can't use BaseField here */}
      <FormControl error={!!meta.error}>
        <FormHelperText>{helperText}</FormHelperText>
      </FormControl>
    </Box>
  );
}
