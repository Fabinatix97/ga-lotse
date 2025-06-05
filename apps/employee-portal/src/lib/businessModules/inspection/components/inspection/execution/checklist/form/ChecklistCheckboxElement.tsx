/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ReactNode } from "react";

import { RadioButtonsField } from "@eshg/lib-portal";

import { ChecklistLabel } from "@/lib/businessModules/inspection/components/inspection/execution/checklist/form/ChecklistLabel";
import { CLFormElement } from "@/lib/businessModules/inspection/components/inspection/execution/checklist/form/helpers";

interface ChecklistCheckboxElementProps {
  element: CLFormElement;
  name: string;
  label: string;
  incident?: boolean;
  labelEndDecorator?: ReactNode;
  readOnly?: boolean;
}

export function ChecklistCheckboxElement({
  element,
  name,
  label,
  incident,
  labelEndDecorator,
  readOnly,
}: Readonly<ChecklistCheckboxElementProps>) {
  if (element.type !== "CHECKBOX") {
    return;
  }

  const requiredText = element.context.mandatory
    ? "Bitte eine Auswahl treffen"
    : undefined;

  return (
    <>
      <ChecklistLabel
        incident={incident}
        required={element.context.mandatory}
        tooltipText={element.context.help}
        endDecorator={labelEndDecorator}
        note={element.context.note}
      >
        {label}
      </ChecklistLabel>
      <RadioButtonsField
        name={name}
        options={[
          { value: "true", label: "Ja" },
          { value: "false", label: "Nein" },
        ]}
        required={requiredText}
        sx={{ gap: 1 }}
        readOnly={readOnly}
      />
    </>
  );
}
