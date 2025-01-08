/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  DragDropContext,
  Draggable,
  DraggingStyle,
  Droppable,
  NotDraggingStyle,
} from "@hello-pangea/dnd";
import { Add } from "@mui/icons-material";
import { Button, Stack, Typography } from "@mui/joy";
import { FieldArray, useFormikContext } from "formik";
import { v4 as uuidv4 } from "uuid";

import { FormPacklistDefinitionRevision } from "@/lib/businessModules/inspection/api/mutations/packlistDefinition";

import { PacklistDefinitionElement } from "./PacklistDefinitionElement";

interface PacklistDefinitionElementsListProps {
  readOnlyMode?: boolean;
}

export function PacklistDefinitionElementsList({
  readOnlyMode,
}: Readonly<PacklistDefinitionElementsListProps>) {
  const { values } = useFormikContext<FormPacklistDefinitionRevision>();

  if (readOnlyMode) {
    return values.elements.map((element, elementIndex) => (
      <PacklistDefinitionElement
        key={element.id}
        element={element}
        elementIndex={elementIndex}
        readOnlyMode={true}
      />
    ));
  }

  return (
    <Stack spacing={2}>
      <Typography level="title-sm">Einträge</Typography>
      <FieldArray name="elements">
        {({ push, remove, replace, move }) => (
          <>
            <DragDropContext
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
                    spacing={1}
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={getListStyle(snapshot.isDraggingOver)}
                  >
                    {values.elements.map((element, elementIndex) => (
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
                            <PacklistDefinitionElement
                              dragHandleProps={provided.dragHandleProps}
                              element={element}
                              setElement={(element) =>
                                replace(elementIndex, element)
                              }
                              deleteElement={() => remove(elementIndex)}
                              elementIndex={elementIndex}
                              readOnlyMode={readOnlyMode}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </Stack>
                )}
              </Droppable>
            </DragDropContext>

            <Button
              disabled={readOnlyMode}
              onClick={() => push(createNewElement())}
              variant="plain"
              startDecorator={<Add />}
              style={{ alignSelf: "flex-start" }}
            >
              Neuen Eintrag erstellen
            </Button>
          </>
        )}
      </FieldArray>
    </Stack>
  );
}

function createNewElement() {
  return {
    id: uuidv4(),
    text: "",
  };
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
    background: isDraggingOver ? "#E3EFFB" : "#FFFFFF",
    borderRadius: 12,
  };
}
