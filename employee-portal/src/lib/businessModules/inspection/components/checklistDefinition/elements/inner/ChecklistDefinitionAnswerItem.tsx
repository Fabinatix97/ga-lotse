/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiCLFieldOptionContext } from "@eshg/employee-portal-api/inspection";
import { Stack } from "@mui/joy";
import { useState } from "react";

import { InputWithDeleteButton } from "@/lib/businessModules/inspection/components/checklistDefinition/helpers/InputWithDeleteButton";

interface ChecklistDefinitionAnswerItemProps {
  itemIndex: number;
  item: ApiCLFieldOptionContext;
  setItem: (item: ApiCLFieldOptionContext) => void;
  onDelete: () => void;
  hideDeleteButton?: boolean;
  readOnlyMode?: boolean;
}

export function ChecklistDefinitionAnswerItem({
  itemIndex,
  item,
  setItem,
  onDelete,
  hideDeleteButton = false,
  readOnlyMode = false,
}: Readonly<ChecklistDefinitionAnswerItemProps>) {
  const [showTextModuleInputTrue, setShowTextModuleInputTrue] = useState(
    !!item?.textModuleTrue,
  );
  const [showTextModuleInputFalse, setShowTextModuleInputFalse] = useState(
    !!item?.textModuleFalse,
  );

  function updateItem(partialItem: Partial<ApiCLFieldOptionContext>) {
    setItem({
      ...item,
      ...partialItem,
    });
  }

  function setText(text: string) {
    updateItem({ text });
  }

  function setTextModuleTrue(textModuleTrue: string) {
    updateItem({ textModuleTrue });
  }

  function setTextModuleFalse(textModuleFalse: string) {
    updateItem({ textModuleFalse });
  }

  return (
    <Stack spacing={1}>
      <InputWithDeleteButton
        disabled={readOnlyMode}
        title={`Antwort ${itemIndex + 1}`}
        placeholder="Antwort eingeben"
        defaultValue={item?.text}
        onBlur={setText}
        onDelete={onDelete}
        onToggleTextModule={(show) => {
          setShowTextModuleInputTrue(show);
          setShowTextModuleInputFalse(show);
          if (!show) {
            setTextModuleFalse("");
            setTextModuleTrue("");
          }
        }}
        toggleTextModuleActive={
          showTextModuleInputTrue || showTextModuleInputFalse
        }
        showTextModule
        hideAddButton
        hideDeleteButton={hideDeleteButton}
      />
      {showTextModuleInputTrue && (
        <InputWithDeleteButton
          disabled={readOnlyMode}
          style={{ marginLeft: 16 }}
          multiline
          title={`Textbaustein ${itemIndex + 1} Ja`}
          placeholder="Textbaustein eingeben"
          defaultValue={item?.textModuleTrue}
          onBlur={setTextModuleTrue}
          onDelete={() => {
            setShowTextModuleInputTrue(false);
            setTextModuleTrue("");
          }}
          hideAddButton
        />
      )}
      {showTextModuleInputFalse && (
        <InputWithDeleteButton
          disabled={readOnlyMode}
          style={{ marginLeft: 16 }}
          multiline
          title={`Textbaustein ${itemIndex + 1} Nein`}
          placeholder="Textbaustein eingeben"
          defaultValue={item?.textModuleFalse}
          onBlur={setTextModuleFalse}
          onDelete={() => {
            setShowTextModuleInputFalse(false);
            setTextModuleFalse("");
          }}
          hideAddButton
        />
      )}
    </Stack>
  );
}
