/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";
import { PropsWithChildren } from "react";

import { ReadOnlyCLDElementProps } from "@/lib/businessModules/inspection/components/checklistDefinition/readOnly/elements/ReadOnlyCLDElement";
import { ChecklistLabel } from "@/lib/businessModules/inspection/components/inspection/execution/checklist/form/ChecklistLabel";

export function ReadOnlyCLDElementWrapper({
  element,
  sectionIndex,
  elementIndex,
  children,
}: Readonly<PropsWithChildren<ReadOnlyCLDElementProps>>) {
  const elementTitle = `${sectionIndex + 1}.${elementIndex + 1}. ${element.text}`;
  return (
    <Stack
      spacing={1}
      role="region"
      aria-label={`Element ${sectionIndex + 1}.${elementIndex + 1}`}
      data-element-type={element.type}
    >
      <ChecklistLabel
        required={element.mandatory}
        note={element.note === "" ? undefined : element.note}
        tooltipText={element.help === "" ? undefined : element.help}
        label-id={`${element.id}-label`}
      >
        {elementTitle}
      </ChecklistLabel>
      {children}
    </Stack>
  );
}
