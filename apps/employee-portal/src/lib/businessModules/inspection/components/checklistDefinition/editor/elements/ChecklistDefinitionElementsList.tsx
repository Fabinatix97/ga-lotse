/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  DragDropContext,
  Draggable,
  DraggingStyle,
  Droppable,
  NotDraggingStyle,
} from "@hello-pangea/dnd";
import { Box, Stack } from "@mui/joy";
import { useFormikContext } from "formik";
import { memo } from "react";

import { ApiCLSectionContextElementsInner } from "@eshg/inspection-api";
import { FieldArrayWithFocus as FieldArray, useNonce } from "@eshg/lib-portal";

import { FormChecklistDefinitionVersion } from "@/lib/businessModules/inspection/api/mutations/checklistDefinition";
import { ChecklistDefinitionElement } from "@/lib/businessModules/inspection/components/checklistDefinition/editor/elements/ChecklistDefinitionElement";

interface ChecklistDefinitionElementsListProps {
  sectionIndex: number;
}

export function ChecklistDefinitionElementsList({
  sectionIndex,
}: Readonly<ChecklistDefinitionElementsListProps>) {
  const nonce = useNonce();
  const { values } = useFormikContext<FormChecklistDefinitionVersion>();

  return (
    <FieldArray
      valueLength={values.context.sections[sectionIndex]?.elements.length ?? 0}
      name={`context.sections.${sectionIndex}.elements`}
    >
      {({ push, remove, replace, move, setInputElementRef }) => {
        return (
          <DragDropContext
            nonce={nonce}
            onDragEnd={(result) => {
              if (result.reason !== "DROP") return;
              if (result.destination === null) return;
              if (result.destination.index === result.source.index) return;
              move(result.source.index, result.destination.index);
            }}
          >
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <Stack
                  spacing={2}
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  sx={getListStyle(snapshot.isDraggingOver)}
                >
                  {values.context.sections[sectionIndex]?.elements.map(
                    (element, elementIndex) => (
                      <MemoizedDraggableChecklistDefinitionElement
                        ref={(el) => setInputElementRef(el, elementIndex)}
                        key={element.id}
                        element={element}
                        elementIndex={elementIndex}
                        sectionIndex={sectionIndex}
                        push={push}
                        remove={remove}
                        replace={replace}
                      />
                    ),
                  )}
                  {provided.placeholder}
                </Stack>
              )}
            </Droppable>
          </DragDropContext>
        );
      }}
    </FieldArray>
  );
}

const MemoizedDraggableChecklistDefinitionElement = memo(
  function DraggableChecklistDefinitionElement({
    element,
    elementIndex,
    sectionIndex,
    push,
    remove,
    replace,
    ref,
  }: {
    element: ApiCLSectionContextElementsInner;
    elementIndex: number;
    sectionIndex: number;
    push: (element: ApiCLSectionContextElementsInner) => void;
    remove: (elementIndex: number) => void;
    replace: (
      elementIndex: number,
      element: ApiCLSectionContextElementsInner,
    ) => void;
    ref?: (el: HTMLInputElement) => void;
  }) {
    return (
      <Draggable draggableId={element.id} index={elementIndex}>
        {(provided, snapshot) => (
          <Box
            ref={provided.innerRef}
            {...provided.draggableProps}
            sx={getItemStyle(
              snapshot.isDragging,
              provided.draggableProps.style,
            )}
          >
            <ChecklistDefinitionElement
              ref={ref}
              key={element.id}
              dragHandleProps={provided.dragHandleProps}
              element={element}
              setElement={(element) => replace(elementIndex, element)}
              deleteElement={() => remove(elementIndex)}
              addElement={(element) => push(element)}
              sectionIndex={sectionIndex}
              elementIndex={elementIndex}
            />
          </Box>
        )}
      </Draggable>
    );
  },
);

function getItemStyle(
  isDragging: boolean,
  draggableStyle: DraggingStyle | NotDraggingStyle | undefined,
) {
  return {
    background: isDragging ? "#F0F4F8" : "white",
    borderRadius: 12,
    ...draggableStyle,
  };
}

function getListStyle(isDraggingOver: boolean) {
  return {
    background: isDraggingOver ? "#F0F4F8" : "white",
    borderRadius: 12,
  };
}
