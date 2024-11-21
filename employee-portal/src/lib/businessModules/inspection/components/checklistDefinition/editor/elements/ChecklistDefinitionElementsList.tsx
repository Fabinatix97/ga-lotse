/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useNonce } from "@eshg/lib-portal/components/NonceProvider";
import {
  DragDropContext,
  Draggable,
  DraggingStyle,
  Droppable,
  NotDraggingStyle,
} from "@hello-pangea/dnd";
import { Stack } from "@mui/joy";
import { FieldArray, useFormikContext } from "formik";

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
    <FieldArray name={`context.sections.${sectionIndex}.elements`}>
      {({ push, remove, replace, move }) => (
        <>
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
                  style={getListStyle(snapshot.isDraggingOver)}
                >
                  {values.context.sections[sectionIndex]?.elements.map(
                    (element, elementIndex) => (
                      <Draggable
                        key={element.id}
                        draggableId={element.id}
                        index={elementIndex}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            style={getItemStyle(
                              snapshot.isDragging,
                              provided.draggableProps.style,
                            )}
                          >
                            <ChecklistDefinitionElement
                              dragHandleProps={provided.dragHandleProps}
                              key={element.id}
                              element={element}
                              setElement={(element) =>
                                replace(elementIndex, element)
                              }
                              deleteElement={() => remove(elementIndex)}
                              addElement={(element) => push(element)}
                              sectionIndex={sectionIndex}
                              elementIndex={elementIndex}
                            />
                          </div>
                        )}
                      </Draggable>
                    ),
                  )}
                  {provided.placeholder}
                </Stack>
              )}
            </Droppable>
          </DragDropContext>
        </>
      )}
    </FieldArray>
  );
}

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
