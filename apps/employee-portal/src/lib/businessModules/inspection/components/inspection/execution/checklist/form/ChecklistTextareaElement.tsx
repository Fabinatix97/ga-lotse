/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Box } from "@mui/joy";
import { ReactNode, useId } from "react";

import { ApiInspectionFeature } from "@eshg/inspection-api";
import { TextareaField } from "@eshg/lib-portal";

import { useIsNewFeatureEnabled } from "@/lib/businessModules/inspection/api/queries/feature";
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
  const featureToggleChecklistRequirementRemovalEnabled =
    useIsNewFeatureEnabled(ApiInspectionFeature.ChecklistRequirementRemoval);

  const labelId = useId();

  if (element.type !== "TEXT") {
    return;
  }

  const isMandatory =
    !featureToggleChecklistRequirementRemovalEnabled &&
    element.context.mandatory;

  const requiredText = isMandatory ? "Bitte Text eingeben" : undefined;

  return (
    <Box display="contents" role="group" aria-labelledby={labelId}>
      <ChecklistLabel
        label-id={labelId}
        incident={incident}
        required={isMandatory}
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
    </Box>
  );
}
