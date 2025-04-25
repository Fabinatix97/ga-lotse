/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Add } from "@mui/icons-material";
import { Button, Stack } from "@mui/joy";
import { v4 as uuidv4 } from "uuid";

import {
  ApiCLFieldOptionContext,
  type ApiCLMultiSelectContext,
  ApiCLSectionContextElementsInner,
} from "@eshg/inspection-api";

import { ChecklistDefinitionAnswerItem } from "@/lib/businessModules/inspection/components/checklistDefinition/editor/elements/inner/ChecklistDefinitionAnswerItem";
import { ChecklistDefinitionElementInnerProps } from "@/lib/businessModules/inspection/components/checklistDefinition/editor/elements/inner/ChecklistDefinitionElementInner";

export function ChecklistDefinitionElementMultiInner({
  sectionIndex,
  elementIndex,
  element,
  setElement,
}: Readonly<ChecklistDefinitionElementInnerProps<ApiCLMultiSelectContext>>) {
  const items = element.items ?? [];

  function updateElement(
    partialElement: Partial<ApiCLSectionContextElementsInner>,
  ) {
    setElement({
      ...element,
      ...partialElement,
    });
  }

  function addItem() {
    const newItem: ApiCLFieldOptionContext = {
      id: uuidv4(),
      text: "",
      textModuleTrue: "",
      textModuleFalse: "",
    };

    updateElement({
      items: [...items, newItem],
    });
  }

  function deleteItem(index: number) {
    items.splice(index, 1);

    updateElement({
      items: [...items],
    });
  }

  return (
    <Stack spacing={2}>
      {items.map((item, index) => {
        const key = item.id;
        const length = element.items?.length ?? 0;
        const hideDeleteButton = length < 3;
        return (
          <ChecklistDefinitionAnswerItem
            key={key}
            sectionIndex={sectionIndex}
            elementIndex={elementIndex}
            itemIndex={index}
            item={item}
            onDelete={() => deleteItem(index)}
            hideDeleteButton={hideDeleteButton}
          />
        );
      })}
      <Button
        onClick={() => addItem()}
        startDecorator={<Add />}
        sx={{ alignSelf: "flex-start" }}
        variant="plain"
      >
        Antwortmöglichkeit hinzufügen
      </Button>
    </Stack>
  );
}
