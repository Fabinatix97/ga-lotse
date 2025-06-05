/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ReactNode, useId } from "react";

import { TextareaField } from "@eshg/lib-portal";

import { ChecklistLabel } from "@/lib/businessModules/inspection/components/inspection/execution/checklist/form/ChecklistLabel";
import { CLFormElement } from "@/lib/businessModules/inspection/components/inspection/execution/checklist/form/helpers";

interface ChecklistTextareaElementProps {
  element: CLFormElement;
  label: string;
  name: string;
  incident?: boolean;
  labelEndDecorator?: ReactNode;
  readOnly?: boolean;
}

export function ChecklistTextareaElement({
  element,
  label,
  name,
  incident,
  labelEndDecorator,
  readOnly,
}: Readonly<ChecklistTextareaElementProps>) {
  const labelId = useId();

  if (element.type !== "TEXT") {
    return;
  }

  const requiredText = element.context.mandatory
    ? "Bitte Text eingeben"
    : undefined;

  return (
    <>
      <ChecklistLabel
        label-id={labelId}
        incident={incident}
        required={element.context.mandatory}
        tooltipText={element.context.help}
        endDecorator={labelEndDecorator}
        note={element.context.note}
      >
        {label}
      </ChecklistLabel>
      <TextareaField
        label-id={labelId}
        sxTextarea={{
          marginTop: "0.5rem",
          flex: 1,
          display: "flex",
          flexGrow: 1,
          width: "100%",
        }}
        sx={{ flex: 1, gap: 1 }}
        name={name}
        required={requiredText}
        readOnly={readOnly}
      />
    </>
  );
}
