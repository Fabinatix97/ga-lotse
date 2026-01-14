/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
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
import { Box, Button, Stack, Typography } from "@mui/joy";
import { useFormikContext } from "formik";
import { v4 as uuidv4 } from "uuid";

import { FieldArrayWithFocus as FieldArray } from "@eshg/lib-portal";

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
        readOnlyMode
      />
    ));
  }

  return (
    <Stack spacing={2}>
      <Typography level="title-sm">Einträge</Typography>
      <FieldArray valueLength={values.elements.length} name="elements">
        {({ push, remove, replace, move, setInputElementRef }) => (
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
                    sx={getListStyle(snapshot.isDraggingOver)}
                  >
                    {values.elements.map((element, elementIndex) => (
                      <Draggable
                        key={element.id}
                        draggableId={element.id}
                        index={elementIndex}
                      >
                        {(provided, snapshot) => (
                          <Box
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            sx={getItemStyle(
                              snapshot.isDragging,
                              provided.draggableProps.style,
                            )}
                          >
                            <PacklistDefinitionElement
                              ref={(el) => setInputElementRef(el, elementIndex)}
                              dragHandleProps={provided.dragHandleProps}
                              element={element}
                              setElement={(element) =>
                                replace(elementIndex, element)
                              }
                              deleteElement={() => remove(elementIndex)}
                              elementIndex={elementIndex}
                              readOnlyMode={readOnlyMode}
                            />
                          </Box>
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
              variant="plain"
              startDecorator={<Add />}
              sx={{ alignSelf: "flex-start" }}
              onClick={() => push(createNewElement())}
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
