/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiCLSectionContextElementsInner,
  ApiInspectionFeature,
} from "@eshg/employee-portal-api/inspection";
import {
  AudiotrackOutlined,
  DeleteOutlined,
  ExpandMore,
  FormatColorTextOutlined,
  PhotoCameraOutlined,
  QuestionAnswerOutlined,
  RadioButtonCheckedOutlined,
} from "@mui/icons-material";
import {
  Box,
  Checkbox,
  Divider,
  IconButton,
  Input,
  Option,
  Select,
  Stack,
} from "@mui/joy";
import { ChangeEvent } from "react";

import { useIsNewFeatureEnabled } from "@/lib/businessModules/inspection/api/queries/feature";
import { NoteAndHelpTextInput } from "@/lib/businessModules/inspection/components/checklistDefinition/elements/NoteAndHelpTextInput";
import { ChecklistDefinitionElementInner } from "@/lib/businessModules/inspection/components/checklistDefinition/elements/inner/ChecklistDefinitionElementInner";
import { CopyDeleteDropdown } from "@/lib/businessModules/inspection/components/checklistDefinition/helpers/CopyDeleteDropdown";
import { createChecklistElement } from "@/lib/businessModules/inspection/components/checklistDefinition/helpers/helpers";

interface ChecklistDefinitionElementProps {
  element: ApiCLSectionContextElementsInner;
  setElement: (element: ApiCLSectionContextElementsInner) => void;
  deleteElement: () => void;
  addElement: (element: ApiCLSectionContextElementsInner) => void;
  sectionIndex: number;
  elementIndex: number;
  readOnlyMode?: boolean;
}

export function ChecklistDefinitionElement({
  element,
  setElement,
  deleteElement,
  addElement,
  sectionIndex,
  elementIndex,
  readOnlyMode,
}: Readonly<ChecklistDefinitionElementProps>) {
  const isChecklistAudioFeatureEnabled = useIsNewFeatureEnabled(
    ApiInspectionFeature.ChecklistAudios,
  );

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
      boxShadow="sm"
      border="1px solid var(--neutral-outlined-border, #CDD7E1)"
      borderRadius={12}
      component="section"
      aria-label={`Element ${sectionIndex + 1}.${elementIndex + 1}`}
      style={{
        padding: 12,
        background: "var(--background-level-1, #F0F4F8)",
      }}
    >
      <Stack
        direction="row"
        spacing={2}
        display="flex"
        flex={1}
        alignContent="center"
        justifyContent="center"
        alignItems="center"
      >
        <Input
          aria-label="Fragenummer"
          value={sectionIndex + 1 + "." + (elementIndex + 1)}
          style={{ maxWidth: 60, height: 40 }}
          disabled
        />
        <Input
          disabled={readOnlyMode}
          style={{ flex: 1, height: 40 }}
          placeholder="Frage eingeben"
          defaultValue={element.text ?? ""}
          onBlur={(event) => updateElement({ text: event.target.value })}
        />
        <Select
          aria-label="Antworttyp"
          disabled={readOnlyMode}
          placeholder="Funktion auswählen"
          defaultValue={element.type}
          onChange={(_, newValue) => {
            changeType(newValue);
          }}
        >
          <Option value="CHECKBOX">
            <ExpandMore />
            Einfachauswahl (Ja/Nein)
          </Option>
          <Option value="MULTI_SELECT">
            <QuestionAnswerOutlined />
            Mehrfachauswahl
          </Option>
          <Option value="TEXT">
            <FormatColorTextOutlined />
            Textfeld
          </Option>
          <Option value="SINGLE_SELECT">
            <RadioButtonCheckedOutlined />
            Optionsauswahl
          </Option>
          <Option value="IMAGE">
            <PhotoCameraOutlined />
            Bilder hinzufügen
          </Option>
          {isChecklistAudioFeatureEnabled && (
            <Option value="AUDIO">
              <AudiotrackOutlined />
              Audio hinzufügen
            </Option>
          )}
        </Select>
        {!isImage && !isAudio && (
          /* image and audio elements cannot be marked as mandatory */
          <Checkbox
            disabled={readOnlyMode}
            label="Pflichtfeld"
            checked={element.mandatory}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              updateElement({ mandatory: event.target.checked });
            }}
          />
        )}
        {!readOnlyMode && (
          <CopyDeleteDropdown
            onDelete={deleteElement}
            onCopy={() => copyElement()}
          />
        )}
      </Stack>
      <ChecklistDefinitionElementInner
        readOnlyMode={readOnlyMode}
        element={element}
        setElement={setElement}
      />
      <NoteAndHelpTextInput
        element={element}
        setElement={setElement}
        readOnlyMode={readOnlyMode}
      />
    </Box>
  ) : (
    <Box
      boxShadow="sm"
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
