/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Box } from "@mui/joy";
import { ReactNode, useId } from "react";

import { ApiInspectionFeature } from "@eshg/inspection-api";
import { RadioButtonsField } from "@eshg/lib-portal";

import { useIsNewFeatureEnabled } from "@/lib/businessModules/inspection/api/queries/feature";
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
  const featureToggleChecklistRequirementRemovalEnabled =
    useIsNewFeatureEnabled(ApiInspectionFeature.ChecklistRequirementRemoval);

  const titleId = useId();
  if (element.type !== "CHECKBOX") {
    return;
  }

  const isMandatory =
    !featureToggleChecklistRequirementRemovalEnabled &&
    element.context.mandatory;

  const requiredText = isMandatory ? "Bitte eine Auswahl treffen" : undefined;

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
    </Box>
  );
}
