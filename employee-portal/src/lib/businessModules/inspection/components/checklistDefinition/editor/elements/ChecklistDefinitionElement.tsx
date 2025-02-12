/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiCLSectionContextElementsInner } from "@eshg/inspection-api";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { SelectField } from "@eshg/lib-portal/components/formFields/SelectField";
import { DraggableProvidedDragHandleProps } from "@hello-pangea/dnd";
import {
  Audiotrack,
  CheckBox,
  DeleteOutlined,
  FormatColorText,
  PhotoCamera,
  QuestionAnswer,
  RadioButtonChecked,
} from "@mui/icons-material";
import { Box, Divider, IconButton, Stack, Typography } from "@mui/joy";

import { NoteAndHelpTextInput } from "@/lib/businessModules/inspection/components/checklistDefinition/editor/elements/NoteAndHelpTextInput";
import { ChecklistDefinitionElementInner } from "@/lib/businessModules/inspection/components/checklistDefinition/editor/elements/inner/ChecklistDefinitionElementInner";
import { CopyDeleteDropdown } from "@/lib/businessModules/inspection/components/checklistDefinition/helpers/CopyDeleteDropdown";
import { DragHandle } from "@/lib/businessModules/inspection/components/checklistDefinition/helpers/DragHandle";
import { InputFieldBar } from "@/lib/businessModules/inspection/components/checklistDefinition/helpers/InputFieldBar";
import { createChecklistElement } from "@/lib/businessModules/inspection/components/checklistDefinition/helpers/helpers";
import { CheckboxField } from "@/lib/shared/components/formFields/CheckboxField";
import { InformationSheet } from "@/lib/shared/components/infoTile/InformationSheet";

interface ChecklistDefinitionElementProps {
  element: ApiCLSectionContextElementsInner;
  setElement: (element: ApiCLSectionContextElementsInner) => void;
  deleteElement: () => void;
  addElement: (element: ApiCLSectionContextElementsInner) => void;
  sectionIndex: number;
  elementIndex: number;
  dragHandleProps?: DraggableProvidedDragHandleProps | null;
}

export function ChecklistDefinitionElement({
  element,
  setElement,
  deleteElement,
  addElement,
  sectionIndex,
  elementIndex,
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
    <InformationSheet
      component="section"
      aria-label={`Element ${sectionIndex + 1}.${elementIndex + 1}`}
      sx={{
        background: (theme) => theme.palette.background.level1,
      }}
    >
      <InputFieldBar
        startDecorator={
          <>
            {dragHandleProps && (
              <DragHandle
                {...dragHandleProps}
                aria-label={`Element ${elementIndex + 1} der Sektion ${sectionIndex + 1} ziehen und verschieben`}
              />
            )}
            <Typography aria-label="Fragenummer" level="body-lg">
              {sectionIndex + 1 + "." + (elementIndex + 1)}
            </Typography>
          </>
        }
        input={
          <>
            <InputField
              name={`context.sections.${sectionIndex}.elements.${elementIndex}.text`}
              label="Frage"
              sx={{ flex: 1 }}
              placeholder="Frage eingeben"
              required="Bitte geben Sie eine Frage ein."
              onBlur={(event) => updateElement({ text: event.target.value })}
            />
            <SelectField
              name={`context.sections.${sectionIndex}.elements.${elementIndex}.type`}
              label="Antworttyp"
              aria-label="Antworttyp"
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
              options={typeOptions}
            />
          </>
        }
        endDecorator={
          <>
            {!isImage && !isAudio && (
              /* image and audio elements cannot be marked as mandatory */
              <CheckboxField
                name={`context.sections.${sectionIndex}.elements.${elementIndex}.mandatory`}
                label="Pflichtfeld"
              />
            )}
            <CopyDeleteDropdown
              onDelete={deleteElement}
              onCopy={() => copyElement()}
            />
          </>
        }
      />
      <Stack spacing={2} sx={{ ml: "3rem" }}>
        <ChecklistDefinitionElementInner
          sectionIndex={sectionIndex}
          elementIndex={elementIndex}
          element={element}
          setElement={setElement}
        />
        <NoteAndHelpTextInput
          sectionIndex={sectionIndex}
          elementIndex={elementIndex}
          element={element}
        />
      </Stack>
    </InformationSheet>
  ) : (
    <Box
      border="1px solid var(--neutral-outlined-border, #CDD7E1)"
      borderRadius={12}
      component="section"
      aria-label={`Element ${sectionIndex + 1}.${elementIndex + 1}`}
      sx={{
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
          sx={{
            marginTop: 3,
            marginBottom: 3,
            display: "flex",
            flex: 1,
          }}
        />
        <IconButton
          title="Löschen"
          aria-label="Löschen"
          color="danger"
          onClick={deleteElement}
        >
          <DeleteOutlined />
        </IconButton>
      </Stack>
    </Box>
  );
}

const typeOptions = [
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
];
