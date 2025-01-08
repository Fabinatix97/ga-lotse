/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useNonce } from "@eshg/lib-portal/components/NonceProvider";
import {
  DragDropContext,
  Draggable,
  DraggingStyle,
  Droppable,
  NotDraggingStyle,
} from "@hello-pangea/dnd";
import { CreateNewFolder } from "@mui/icons-material";
import { Button, Stack } from "@mui/joy";
import { FieldArray, useFormikContext } from "formik";
import { v4 as uuidv4 } from "uuid";

import { FormChecklistDefinitionVersion } from "@/lib/businessModules/inspection/api/mutations/checklistDefinition";
import { createChecklistElement } from "@/lib/businessModules/inspection/components/checklistDefinition/helpers/helpers";

import { ChecklistDefinitionSection } from "./ChecklistDefinitionSection";

export function ChecklistDefinitionSectionsList() {
  const nonce = useNonce();
  const { values } = useFormikContext<FormChecklistDefinitionVersion>();

  return (
    <FieldArray name="context.sections">
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
                  {values.context.sections.map((section, sectionIndex) => (
                    <Draggable
                      key={section.id}
                      draggableId={section.id}
                      index={sectionIndex}
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
                          <ChecklistDefinitionSection
                            dragHandleProps={provided.dragHandleProps}
                            section={section}
                            setSection={(section) =>
                              replace(sectionIndex, section)
                            }
                            deleteSection={() => remove(sectionIndex)}
                            addSection={(section) => push(section)}
                            sectionIndex={sectionIndex}
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
            onClick={() => push(createNewSection())}
            variant="plain"
            startDecorator={<CreateNewFolder />}
            style={{ alignSelf: "flex-start" }}
          >
            Neue Sektion erstellen
          </Button>
        </>
      )}
    </FieldArray>
  );
}

function createNewSection() {
  return {
    id: uuidv4(),
    title: "",
    elements: [createChecklistElement("CHECKBOX")],
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
    background: isDraggingOver ? "#E3EFFB" : "#F0F4F8",
    borderRadius: 12,
  };
}
