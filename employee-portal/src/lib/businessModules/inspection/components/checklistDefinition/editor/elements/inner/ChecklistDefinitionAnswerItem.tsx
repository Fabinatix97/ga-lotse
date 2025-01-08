/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiCLFieldOptionContext } from "@eshg/employee-portal-api/inspection";
import { OptionalFieldValue } from "@eshg/lib-portal/types/form";
import { SubdirectoryArrowRight } from "@mui/icons-material";
import { Stack } from "@mui/joy";
import { useFormikContext } from "formik";
import { useState } from "react";

import { FormChecklistDefinitionVersion } from "@/lib/businessModules/inspection/api/mutations/checklistDefinition";
import { FlexInputField } from "@/lib/businessModules/inspection/components/checklistDefinition/helpers/FlexInputField";
import { InputWithDeleteButton } from "@/lib/businessModules/inspection/components/checklistDefinition/helpers/InputWithDeleteButton";
import { TextModuleToggle } from "@/lib/businessModules/inspection/components/checklistDefinition/helpers/TextModuleToggle";
import { countTextModules } from "@/lib/businessModules/inspection/components/checklistDefinition/helpers/helpers";

interface ChecklistDefinitionAnswerItemProps {
  sectionIndex: number;
  elementIndex: number;
  itemIndex: number;
  item: ApiCLFieldOptionContext;
  setItem: (item: ApiCLFieldOptionContext) => void;
  onDelete: () => void;
  hideDeleteButton?: boolean;
}

export function ChecklistDefinitionAnswerItem({
  sectionIndex,
  elementIndex,
  itemIndex,
  item,
  onDelete,
  hideDeleteButton = false,
}: Readonly<ChecklistDefinitionAnswerItemProps>) {
  const { values } = useFormikContext<FormChecklistDefinitionVersion>();
  const [showTextModules, setShowTextModules] = useState(false);
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
    <Stack spacing={2}>
      <InputWithDeleteButton
        name={`context.sections.${sectionIndex}.elements.${elementIndex}.items.${itemIndex}.text`}
        label={`Antwort ${itemIndex + 1}`}
        placeholder="Antwort eingeben"
        onDelete={onDelete}
        validate={validateMultipleAnswers}
        required="Bitte geben Sie eine Antwort ein."
        hideDeleteButton={hideDeleteButton}
        endDecorator={
          <TextModuleToggle
            checked={showTextModules}
            onToggle={(show) => setShowTextModules(show)}
            count={countTextModules(item)}
          />
        }
      />
      {showTextModules && (
        <>
          <FlexInputField
            name={`context.sections.${sectionIndex}.elements.${elementIndex}.items.${itemIndex}.textModuleTrue`}
            multiline
            label={`Textbaustein für Antwort ${itemIndex + 1} (ausgewählt)`}
            placeholder="Textbaustein eingeben"
            startDecorator={<SubdirectoryArrowRight />}
          />
          <FlexInputField
            name={`context.sections.${sectionIndex}.elements.${elementIndex}.items.${itemIndex}.textModuleFalse`}
            multiline
            label={`Textbaustein für Antwort ${itemIndex + 1} (nicht ausgewählt)`}
            placeholder="Textbaustein eingeben"
            startDecorator={<SubdirectoryArrowRight />}
          />
        </>
      )}
    </Stack>
  );
}
