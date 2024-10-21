/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiCLFieldOptionContext } from "@eshg/employee-portal-api/inspection";
import { OptionalFieldValue } from "@eshg/lib-portal/types/form";
import { SubdirectoryArrowRight } from "@mui/icons-material";
import { Stack } from "@mui/joy";
import { useFormikContext } from "formik";
import { useState } from "react";

import { FormChecklistDefinitionVersion } from "@/lib/businessModules/inspection/api/mutations/checklistDefinition";
import { InputWithDeleteButton } from "@/lib/businessModules/inspection/components/checklistDefinition/helpers/InputWithDeleteButton";

interface ChecklistDefinitionAnswerItemProps {
  sectionIndex: number;
  elementIndex: number;
  itemIndex: number;
  item: ApiCLFieldOptionContext;
  setItem: (item: ApiCLFieldOptionContext) => void;
  onDelete: () => void;
  hideDeleteButton?: boolean;
  readOnlyMode?: boolean;
}

export function ChecklistDefinitionAnswerItem({
  sectionIndex,
  elementIndex,
  itemIndex,
  item,
  setItem,
  onDelete,
  hideDeleteButton = false,
  readOnlyMode = false,
}: Readonly<ChecklistDefinitionAnswerItemProps>) {
  const { values } = useFormikContext<FormChecklistDefinitionVersion>();
  const [showTextModuleTrue, setShowTextModuleTrue] = useState(
    !!item?.textModuleTrue,
  );
  const [showTextModuleFalse, setShowTextModuleFalse] = useState(
    !!item?.textModuleFalse,
  );
  const showTextModules = showTextModuleTrue || showTextModuleFalse;

  function updateItem(partialItem: Partial<ApiCLFieldOptionContext>) {
    setItem({
      ...item,
      ...partialItem,
    });
  }

  function setTextModuleTrue(textModuleTrue: string) {
    updateItem({ textModuleTrue });
  }

  function setTextModuleFalse(textModuleFalse: string) {
    updateItem({ textModuleFalse });
  }

  function validateMultipleAnswers(value: OptionalFieldValue<string>) {
    if (value === "") {
      return undefined;
    }

    switch (
      values.context.sections[sectionIndex]?.elements[elementIndex]?.type
    ) {
      case "MULTI_SELECT":
      case "CLMultiSelectContext":
      case "SINGLE_SELECT":
      case "CLSingleSelectContext": {
        const occurances = values.context.sections[sectionIndex]?.elements[
          elementIndex
        ].items!.filter((answer) => answer.text === value);
        if (occurances.length > 1) {
          return "Bitte unterschiedliche Werte eingeben.";
        } else {
          return undefined;
        }
      }
    }
  }

  return (
    <Stack spacing={1}>
      <InputWithDeleteButton
        name={`context.sections.${sectionIndex}.elements.${elementIndex}.items.${itemIndex}.text`}
        disabled={readOnlyMode}
        label={`Antwort ${itemIndex + 1}`}
        placeholder="Antwort eingeben"
        defaultValue={item?.text}
        onDelete={onDelete}
        validate={validateMultipleAnswers}
        required="Bitte geben Sie eine Antwort ein."
        onToggleTextModule={(show) => {
          setShowTextModuleTrue(show);
          setShowTextModuleFalse(show);
        }}
        toggleTextModuleActive={showTextModules}
        showTextModule
        hideAddButton
        hideDeleteButton={hideDeleteButton}
      />
      {showTextModules && (
        <Stack direction="row" spacing={2} alignItems="flex-start">
          <SubdirectoryArrowRight sx={{ mt: "1.8rem" }} />
          <InputWithDeleteButton
            name={`context.sections.${sectionIndex}.elements.${elementIndex}.items.${itemIndex}.textModuleTrue`}
            disabled={readOnlyMode}
            multiline
            label={`Textbaustein für Antwort ${itemIndex + 1} (ausgewählt)`}
            placeholder="Textbaustein eingeben"
            defaultValue={item?.textModuleTrue}
            onDelete={() => setTextModuleTrue("")}
            hideAddButton
          />
        </Stack>
      )}
      {showTextModules && (
        <Stack direction="row" spacing={2} alignItems="flex-start">
          <SubdirectoryArrowRight sx={{ mt: "1.8rem" }} />
          <InputWithDeleteButton
            name={`context.sections.${sectionIndex}.elements.${elementIndex}.items.${itemIndex}.textModuleFalse`}
            disabled={readOnlyMode}
            multiline
            label={`Textbaustein für Antwort ${itemIndex + 1} (nicht ausgewählt)`}
            placeholder="Textbaustein eingeben"
            defaultValue={item?.textModuleFalse}
            onDelete={() => setTextModuleFalse("")}
            hideAddButton
          />
        </Stack>
      )}
    </Stack>
  );
}
