/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiCLSectionContextElementsInner } from "@eshg/employee-portal-api/inspection";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { SelectField } from "@eshg/lib-portal/components/formFields/SelectField";
import { DraggableProvidedDragHandleProps } from "@hello-pangea/dnd";
import {
  Audiotrack,
  CheckBox,
  DeleteOutlined,
  DragIndicatorOutlined,
  FormatColorText,
  PhotoCamera,
  QuestionAnswer,
  RadioButtonChecked,
} from "@mui/icons-material";
import { Box, Chip, Divider, Grid, IconButton, Stack } from "@mui/joy";

import { NoteAndHelpTextInput } from "@/lib/businessModules/inspection/components/checklistDefinition/elements/NoteAndHelpTextInput";
import { ChecklistDefinitionElementInner } from "@/lib/businessModules/inspection/components/checklistDefinition/elements/inner/ChecklistDefinitionElementInner";
import { CopyDeleteDropdown } from "@/lib/businessModules/inspection/components/checklistDefinition/helpers/CopyDeleteDropdown";
import { createChecklistElement } from "@/lib/businessModules/inspection/components/checklistDefinition/helpers/helpers";
import { CheckboxField } from "@/lib/shared/components/formFields/CheckboxField";

interface ChecklistDefinitionElementProps {
  element: ApiCLSectionContextElementsInner;
  setElement: (element: ApiCLSectionContextElementsInner) => void;
  deleteElement: () => void;
  addElement: (element: ApiCLSectionContextElementsInner) => void;
  sectionIndex: number;
  elementIndex: number;
  readOnlyMode?: boolean;
  dragHandleProps?: DraggableProvidedDragHandleProps | null;
}

export function ChecklistDefinitionElement({
  element,
  setElement,
  deleteElement,
  addElement,
  sectionIndex,
  elementIndex,
  readOnlyMode,
  dragHandleProps,
}: Readonly<ChecklistDefinitionElementProps>) {
  const isImage = element.type === "IMAGE" || element.type === "CLImageContext";
  const isAudio = element.type === "AUDIO" || element.type === "CLAudioContext";
  const isSeparator =
    element.type === "SEPARATOR" || element.type === "CLSeparatorContext";

  function updateElement(
    partialElement: Partial<ApiCLSectionContextElementsInner>,
  ) {
    setElement({
      ...element,
      ...partialElement,
    });
  }

  function copyElement() {
    addElement(createChecklistElement(element.type, element));
  }

  function changeType(type: ApiCLSectionContextElementsInner["type"] | null) {
    if (!type) {
      return;
    }

    updateElement(createChecklistElement(type, element, true));
  }

  return !isSeparator ? (
    <Box
      border="1px solid var(--neutral-outlined-border, #CDD7E1)"
      borderRadius={12}
      component="section"
      aria-label={`Element ${sectionIndex + 1}.${elementIndex + 1}`}
      style={{
        padding: 12,
        background: "var(--background-level-1, #F0F4F8)",
      }}
    >
      <Grid container spacing={2}>
        <Grid xs="auto">
          <div
            {...dragHandleProps}
            style={{ marginTop: "1.7rem" }}
            aria-label={`Element ${elementIndex + 1} der Sektion ${sectionIndex + 1} ziehen und verschieben`}
            role="button"
          >
            <DragIndicatorOutlined
              style={{
                backgroundColor: "white",
                borderRadius: 50,
                padding: 4,
                width: 32,
                height: 32,
              }}
            />
          </div>
        </Grid>
        <Grid xs>
          <Stack
            direction="row"
            spacing={2}
            display="flex"
            flex={1}
            alignContent="center"
            justifyContent="center"
            alignItems="flex-start"
          >
            <Chip
              aria-label="Fragenummer"
              style={{ marginTop: "2.1rem" }}
              color="success"
            >
              {sectionIndex + 1 + "." + (elementIndex + 1)}
            </Chip>
            <InputField
              name={`context.sections.${sectionIndex}.elements.${elementIndex}.text`}
              label="Frage"
              disabled={readOnlyMode}
              sx={{ flex: 1 }}
              placeholder="Frage eingeben"
              required="Bitte geben Sie eine Frage ein."
              onBlur={(event) => updateElement({ text: event.target.value })}
            />
            <SelectField
              name={`context.sections.${sectionIndex}.elements.${elementIndex}.type`}
              label="Antworttyp"
              aria-label="Antworttyp"
              disabled={readOnlyMode}
              placeholder="Funktion auswählen"
              required="Bitte wählen Sie einen Antworttyp aus."
              sx={{ width: "17rem" }}
              onChange={(newValue) => {
                changeType(
                  newValue as
                    | "CHECKBOX"
                    | "MULTI_SELECT"
                    | "TEXT"
                    | "SINGLE_SELECT"
                    | "IMAGE"
                    | "AUDIO"
                    | null,
                );
              }}
              options={[
                {
                  value: "CHECKBOX",
                  label: (
                    <>
                      <CheckBox />
                      Einfachauswahl (Ja/Nein)
                    </>
                  ),
                },
                {
                  value: "MULTI_SELECT",
                  label: (
                    <>
                      <QuestionAnswer />
                      Mehrfachauswahl
                    </>
                  ),
                },
                {
                  value: "TEXT",
                  label: (
                    <>
                      <FormatColorText />
                      Textfeld
                    </>
                  ),
                },
                {
                  value: "SINGLE_SELECT",
                  label: (
                    <>
                      <RadioButtonChecked />
                      Optionsauswahl
                    </>
                  ),
                },
                {
                  value: "IMAGE",
                  label: (
                    <>
                      <PhotoCamera />
                      Bilder hinzufügen
                    </>
                  ),
                },
                {
                  value: "AUDIO",
                  label: (
                    <>
                      <Audiotrack />
                      Audio hinzufügen
                    </>
                  ),
                },
              ]}
            />
            {!isImage && !isAudio && (
              /* image and audio elements cannot be marked as mandatory */
              <CheckboxField
                name={`context.sections.${sectionIndex}.elements.${elementIndex}.mandatory`}
                label="Pflichtfeld"
                disabled={readOnlyMode}
                sx={{ mt: "2.1rem" }}
              />
            )}
            {!readOnlyMode && (
              <Box mt="1.7rem">
                <CopyDeleteDropdown
                  onDelete={deleteElement}
                  onCopy={() => copyElement()}
                />
              </Box>
            )}
          </Stack>
          <ChecklistDefinitionElementInner
            sectionIndex={sectionIndex}
            elementIndex={elementIndex}
            readOnlyMode={readOnlyMode}
            element={element}
            setElement={setElement}
          />
          <NoteAndHelpTextInput
            sectionIndex={sectionIndex}
            elementIndex={elementIndex}
            element={element}
            setElement={setElement}
            readOnlyMode={readOnlyMode}
          />
        </Grid>
      </Grid>
    </Box>
  ) : (
    <Box
      border="1px solid var(--neutral-outlined-border, #CDD7E1)"
      borderRadius={12}
      component="section"
      aria-label={`Element ${sectionIndex + 1}.${elementIndex + 1}`}
      style={{
        background: "var(--background-level-1, #F0F4F8)",
      }}
    >
      <Stack
        direction="row"
        spacing={2}
        paddingLeft={2}
        paddingRight={2}
        alignItems={"center"}
      >
        <Divider
          style={{
            marginTop: 24,
            marginBottom: 24,
            display: "flex",
            flex: 1,
          }}
        />
        {!readOnlyMode && (
          <IconButton
            title="Löschen"
            aria-label="Löschen"
            color="danger"
            onClick={deleteElement}
          >
            <DeleteOutlined />
          </IconButton>
        )}
      </Stack>
    </Box>
  );
}
