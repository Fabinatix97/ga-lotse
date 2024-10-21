/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiCLCheckboxContext } from "@eshg/employee-portal-api/inspection";
import {
  DeveloperModeRounded,
  SubdirectoryArrowRight,
} from "@mui/icons-material";
import { Radio, Stack } from "@mui/joy";
import { useState } from "react";

import { ChecklistDefinitionElementInnerProps } from "@/lib/businessModules/inspection/components/checklistDefinition/elements/inner/ChecklistDefinitionElementInner";
import { InputWithDeleteButton } from "@/lib/businessModules/inspection/components/checklistDefinition/helpers/InputWithDeleteButton";
import { ToggleButton } from "@/lib/shared/components/buttons/ToggleButton";

export function ChecklistDefinitionElementCheckboxInner({
  readOnlyMode = true,
  sectionIndex,
  elementIndex,
  element,
  setElement,
}: Readonly<ChecklistDefinitionElementInnerProps<ApiCLCheckboxContext>>) {
  const [showTextModuleTrue, setShowTextModuleTrue] = useState(
    !!element.textModuleTrue,
  );
  const [showTextModuleFalse, setShowTextModuleFalse] = useState(
    !!element.textModuleFalse,
  );
  const showTextModules = showTextModuleTrue || showTextModuleFalse;

  function setTextModuleTrue(textModuleTrue: string) {
    setElement({
      ...element,
      textModuleTrue,
    });
  }

  function setTextModuleFalse(textModuleFalse: string) {
    setElement({
      ...element,
      textModuleFalse,
    });
  }

  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={2} mt={1} alignItems={"center"}>
        <Radio disabled label="Ja" />
        <Radio disabled label="Nein" />
        {!readOnlyMode && (
          <ToggleButton
            asIcon={true}
            title="Textbausteine"
            aria-label="Textbausteine"
            aria-pressed={showTextModules}
            defaultChecked={showTextModules}
            onToggle={(pressed) => {
              setShowTextModuleTrue(pressed);
              setShowTextModuleFalse(pressed);
            }}
          >
            <DeveloperModeRounded />
          </ToggleButton>
        )}
      </Stack>
      {showTextModules && (
        <Stack direction="row" spacing={2} alignItems="flex-start">
          <SubdirectoryArrowRight sx={{ mt: "1.8rem" }} />
          <InputWithDeleteButton
            name={`context.sections.${sectionIndex}.elements.${elementIndex}.textModuleTrue`}
            disabled={readOnlyMode}
            label="Textbaustein für Antwort Ja"
            multiline
            placeholder="Textbaustein eingeben"
            defaultValue={element.textModuleTrue}
            onDelete={() => setTextModuleTrue("")}
            hideAddButton
          />
        </Stack>
      )}
      {showTextModules && (
        <Stack direction="row" spacing={2} alignItems="flex-start">
          <SubdirectoryArrowRight sx={{ mt: "1.8rem" }} />
          <InputWithDeleteButton
            name={`context.sections.${sectionIndex}.elements.${elementIndex}.textModuleFalse`}
            disabled={readOnlyMode}
            label="Textbaustein für Antwort Nein"
            multiline
            placeholder="Textbaustein eingeben"
            defaultValue={element.textModuleFalse}
            onDelete={() => setTextModuleFalse("")}
            hideAddButton
          />
        </Stack>
      )}
    </Stack>
  );
}
