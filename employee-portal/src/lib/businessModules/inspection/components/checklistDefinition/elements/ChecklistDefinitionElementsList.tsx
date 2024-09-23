/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiCLSectionContextElementsInner } from "@eshg/employee-portal-api/inspection";
import { Stack } from "@mui/joy";

import { ChecklistDefinitionElement } from "@/lib/businessModules/inspection/components/checklistDefinition/elements/ChecklistDefinitionElement";

interface ChecklistDefinitionElementsListProps {
  readOnlyMode?: boolean;
  elements: ApiCLSectionContextElementsInner[];
  setElements: (elements: ApiCLSectionContextElementsInner[]) => void;
  sectionIndex: number;
}

export function ChecklistDefinitionElementsList({
  readOnlyMode,
  elements,
  setElements,
  sectionIndex,
}: Readonly<ChecklistDefinitionElementsListProps>) {
  function setElement(
    index: number,
    element: ApiCLSectionContextElementsInner,
  ) {
    const newElements = [...elements];
    newElements[index] = element;
    setElements(newElements);
  }

  function deleteElement(index: number) {
    const newElements = [...elements];
    newElements.splice(index, 1);
    setElements(newElements);
  }

  function addElement(element: ApiCLSectionContextElementsInner) {
    setElements([...elements, element]);
  }

  return (
    <>
      {elements.map((element, elementIndex) => {
        return (
          <Stack spacing={2} key={element.id}>
            <ChecklistDefinitionElement
              readOnlyMode={readOnlyMode}
              key={element.id}
              element={element}
              setElement={(element) => {
                setElement(elementIndex, element);
              }}
              deleteElement={() => {
                deleteElement(elementIndex);
              }}
              addElement={(element) => {
                addElement(element);
              }}
              sectionIndex={sectionIndex}
              elementIndex={elementIndex}
            />
          </Stack>
        );
      })}
    </>
  );
}
