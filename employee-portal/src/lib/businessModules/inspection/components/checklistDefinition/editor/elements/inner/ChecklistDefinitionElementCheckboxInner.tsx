/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { SubdirectoryArrowRight } from "@mui/icons-material";
import { Radio, Stack } from "@mui/joy";
import { useState } from "react";

import { ApiCLCheckboxContext } from "@eshg/inspection-api";

import { ChecklistDefinitionElementInnerProps } from "@/lib/businessModules/inspection/components/checklistDefinition/editor/elements/inner/ChecklistDefinitionElementInner";
import { FlexInputField } from "@/lib/businessModules/inspection/components/checklistDefinition/helpers/FlexInputField";
import { TextModuleToggle } from "@/lib/businessModules/inspection/components/checklistDefinition/helpers/TextModuleToggle";
import { countTextModules } from "@/lib/businessModules/inspection/components/checklistDefinition/helpers/helpers";

export function ChecklistDefinitionElementCheckboxInner({
  sectionIndex,
  elementIndex,
  element,
}: Readonly<ChecklistDefinitionElementInnerProps<ApiCLCheckboxContext>>) {
  const [showTextModules, setShowTextModules] = useState(false);

  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Radio disabled label="Ja" />
        <Radio disabled label="Nein" />
        <TextModuleToggle
          checked={showTextModules}
          count={countTextModules(element)}
          onToggle={(pressed) => setShowTextModules(pressed)}
        />
      </Stack>
      {showTextModules && (
        <>
          <FlexInputField
            name={`context.sections.${sectionIndex}.elements.${elementIndex}.textModuleTrue`}
            label="Textbaustein für Antwort Ja"
            multiline
            placeholder="Textbaustein eingeben"
            startDecorator={<SubdirectoryArrowRight />}
          />
          <FlexInputField
            name={`context.sections.${sectionIndex}.elements.${elementIndex}.textModuleFalse`}
            label="Textbaustein für Antwort Nein"
            multiline
            placeholder="Textbaustein eingeben"
            startDecorator={<SubdirectoryArrowRight />}
          />
        </>
      )}
    </Stack>
  );
}
