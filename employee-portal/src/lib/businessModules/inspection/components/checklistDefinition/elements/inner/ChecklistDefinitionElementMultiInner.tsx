/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiCLFieldOptionContext,
  type ApiCLMultiSelectContext,
  ApiCLSectionContextElementsInner,
} from "@eshg/employee-portal-api/inspection";
import { Add } from "@mui/icons-material";
import { Button, Stack } from "@mui/joy";
import { v4 as uuidv4 } from "uuid";

import { ChecklistDefinitionAnswerItem } from "@/lib/businessModules/inspection/components/checklistDefinition/elements/inner/ChecklistDefinitionAnswerItem";
import { ChecklistDefinitionElementInnerProps } from "@/lib/businessModules/inspection/components/checklistDefinition/elements/inner/ChecklistDefinitionElementInner";

export function ChecklistDefinitionElementMultiInner({
  readOnlyMode = false,
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

  function setItem(index: number, item: ApiCLFieldOptionContext) {
    items[index] = item;
    updateElement({
      items: [...items],
    });
  }

  return (
    <Stack spacing={2} style={{ marginTop: 12 }}>
      {items.map((item, index) => {
        const key = item.id;
        const length = element.items?.length ?? 0;
        const hideDeleteButton = length < 3;
        return (
          <ChecklistDefinitionAnswerItem
            key={key}
            readOnlyMode={readOnlyMode}
            itemIndex={index}
            item={item}
            setItem={(item) => setItem(index, item)}
            onDelete={() => deleteItem(index)}
            hideDeleteButton={hideDeleteButton}
          />
        );
      })}
      <Button
        disabled={readOnlyMode}
        onClick={() => addItem()}
        startDecorator={<Add />}
        style={{ alignSelf: "flex-start" }}
        variant="plain"
      >
        Antwortmöglichkeit hinzufügen
      </Button>
    </Stack>
  );
}
