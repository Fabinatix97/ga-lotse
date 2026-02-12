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
import { memo } from "react";

import { type ApiCLSectionContext } from "@eshg/inspection-api";
import {
  FieldArrayWithFocus as FieldArray,
  FieldArrayRenderExtendedProps,
  useNonce,
} from "@eshg/lib-portal";

import { ChecklistDefinitionElement } from "@/lib/businessModules/inspection/components/checklistDefinition/editor/elements/ChecklistDefinitionElement";

interface ChecklistDefinitionElementsListProps {
  sectionIndex: number;
}

export function ChecklistDefinitionElementsList({
  sectionIndex,
  section,
}: Readonly<ChecklistDefinitionElementsListProps> & {
  section?: ApiCLSectionContext;
}) {
  return (
    <FieldArray
      valueLength={section?.elements.length ?? 0}
      name={`context.sections.${sectionIndex}.elements`}
    >
      {({ push, remove, replace, move, setInputElementRef }) => (
        <MemoizedChecklistDefinitionElementsListElement
          move={move}
          setInputElementRef={setInputElementRef}
          replace={replace}
          remove={remove}
          push={push}
          section={section}
          sectionIndex={sectionIndex}
        />
      )}
    </FieldArray>
  );
}

const MemoizedChecklistDefinitionElementsListElement = memo(
  function ChecklistDefinitionElementsListElement({
    move,
    section,
    setInputElementRef,
    sectionIndex,
    push,
    remove,
    replace,
  }: Pick<
    FieldArrayRenderExtendedProps,
    "push" | "remove" | "replace" | "move" | "setInputElementRef"
  > & { section?: ApiCLSectionContext; sectionIndex: number }) {
    const nonce = useNonce();

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
              {section?.elements.map((element, elementIndex) => (
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
                      <ChecklistDefinitionElement
                        ref={(el) => setInputElementRef(el, elementIndex)}
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
              ))}
              {provided.placeholder}
            </Stack>
          )}
        </Droppable>
      </DragDropContext>
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
