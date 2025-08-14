/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Box } from "@mui/joy";
import { ReactNode, useId } from "react";

import { RadioButtonsField } from "@eshg/lib-portal";

import { ChecklistLabel } from "@/lib/businessModules/inspection/components/inspection/execution/checklist/form/ChecklistLabel";
import { CLFormElement } from "@/lib/businessModules/inspection/components/inspection/execution/checklist/form/helpers";

interface ChecklistRadioButtonElementProps {
  element: CLFormElement;
  label: string;
  name: string;
  incident?: boolean;
  labelEndDecorator?: ReactNode;
  readOnly?: boolean;
}

export function ChecklistRadioButtonElement({
  element,
  label,
  name,
  incident,
  labelEndDecorator,
  readOnly,
}: Readonly<ChecklistRadioButtonElementProps>) {
  const titleId = useId();
  if (element.type !== "SINGLE_SELECT") {
    return;
  }

  const requiredText = element.context.mandatory
    ? "Bitte eine Auswahl treffen"
    : undefined;

  return (
    <Box display="contents" role="group" aria-labelledby={titleId}>
      <ChecklistLabel
        incident={incident}
        required={element.context.mandatory}
        tooltipText={element.context.help}
        endDecorator={labelEndDecorator}
        note={element.context.note}
        label-id={titleId}
      >
        {label}
      </ChecklistLabel>
      <RadioButtonsField
        name={name}
        orientation="vertical"
        required={requiredText}
        options={
          element.context.items?.map((item) => {
            return {
              value: item.text,
              label: item.text,
            };
          }) ?? []
        }
        sx={{ gap: 1 }}
        readOnly={readOnly}
      />
    </Box>
  );
}
