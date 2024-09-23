/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiCLCheckboxContext } from "@eshg/employee-portal-api/inspection";
import { DeveloperModeRounded } from "@mui/icons-material";
import { Box, Radio, Stack, Typography } from "@mui/joy";
import { useState } from "react";

import { ChecklistDefinitionElementInnerProps } from "@/lib/businessModules/inspection/components/checklistDefinition/elements/inner/ChecklistDefinitionElementInner";
import { InputWithDeleteButton } from "@/lib/businessModules/inspection/components/checklistDefinition/helpers/InputWithDeleteButton";
import { ToggleButton } from "@/lib/shared/components/buttons/ToggleButton";

export function ChecklistDefinitionElementCheckboxInner({
  readOnlyMode = true,
  element,
  setElement,
}: Readonly<ChecklistDefinitionElementInnerProps<ApiCLCheckboxContext>>) {
  const [showTextModuleTrue, setShowTextModuleTrue] = useState(
    !!element.textModuleTrue,
  );
  const [showTextModuleFalse, setShowTextModuleFalse] = useState(
    !!element.textModuleFalse,
  );

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
      <Stack
        spacing={2}
        direction="row"
        style={{ marginTop: 12 }}
        alignItems={"center"}
      >
        <Typography>Antwortmöglichkeiten: </Typography>
        <Box
          style={{
            backgroundColor: "white",
            padding: 16,
            borderRadius: 12,

            flex: 1,
          }}
          display={"flex"}
          alignItems={"center"}
        >
          <Radio disabled label="Ja" />
        </Box>
        <Box
          style={{
            backgroundColor: "white",
            padding: 16,
            borderRadius: 12,
            flex: 1,
          }}
          display={"flex"}
          alignItems={"center"}
        >
          <Radio disabled label="Nein" />
        </Box>
        {!readOnlyMode && (
          <ToggleButton
            asIcon={true}
            title="Textbausteine"
            aria-label="Textbausteine"
            aria-pressed={showTextModuleTrue || showTextModuleFalse}
            onToggle={(pressed) => {
              setShowTextModuleTrue(pressed);
              setShowTextModuleFalse(pressed);
              if (!pressed) {
                setTextModuleTrue("");
                setTextModuleFalse("");
              }
            }}
          >
            <DeveloperModeRounded />
          </ToggleButton>
        )}
      </Stack>
      {showTextModuleTrue && (
        <InputWithDeleteButton
          disabled={readOnlyMode}
          style={{ marginLeft: 16 }}
          title={`Textbaustein Ja`}
          multiline
          placeholder="Textbaustein eingeben"
          defaultValue={element.textModuleTrue}
          onBlur={setTextModuleTrue}
          onDelete={() => {
            setShowTextModuleTrue(false);
            setTextModuleTrue("");
          }}
          hideAddButton
        />
      )}
      {showTextModuleFalse && (
        <InputWithDeleteButton
          disabled={readOnlyMode}
          style={{ marginLeft: 16 }}
          title={`Textbaustein Nein`}
          multiline
          placeholder="Textbaustein eingeben"
          defaultValue={element.textModuleFalse}
          onBlur={setTextModuleFalse}
          onDelete={() => {
            setShowTextModuleFalse(false);
            setTextModuleFalse("");
          }}
          hideAddButton
        />
      )}
    </Stack>
  );
}
