/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiCLSectionContextElementsInner } from "@eshg/employee-portal-api/inspection";
import { Stack } from "@mui/joy";
import { useState } from "react";

import { InputWithDeleteButton } from "@/lib/businessModules/inspection/components/checklistDefinition/helpers/InputWithDeleteButton";

interface NoteAndHelpTextInputProps {
  readOnlyMode?: boolean;
  element: ApiCLSectionContextElementsInner;
  setElement: (element: ApiCLSectionContextElementsInner) => void;
  sectionIndex: number;
  elementIndex: number;
}

export function NoteAndHelpTextInput({
  element,
  setElement,
  sectionIndex,
  elementIndex,
  readOnlyMode,
}: Readonly<NoteAndHelpTextInputProps>) {
  const [showNote, setShowNote] = useState(
    element.type !== "SEPARATOR" && element.type !== "CLSeparatorContext"
      ? !!element.note
      : false,
  );
  const [showHelpText, setShowHelpText] = useState(
    element.type !== "SEPARATOR" && element.type !== "CLSeparatorContext"
      ? !!element.help
      : false,
  );

  if (element.type === "SEPARATOR" || element.type === "CLSeparatorContext") {
    return;
  }

  function updateElement(
    partialElement: Partial<ApiCLSectionContextElementsInner>,
  ) {
    setElement({
      ...element,
      ...partialElement,
    });
  }

  return (
    <Stack
      spacing={2}
      marginTop={2}
      direction={showNote || showHelpText ? "column" : "row"}
    >
      <InputWithDeleteButton
        name={`context.sections.${sectionIndex}.elements.${elementIndex}.help`}
        disabled={readOnlyMode}
        placeholder="Hilfetext eingeben"
        multiline
        defaultValue={element.help}
        label="Hilfetext"
        onDelete={() => {
          setShowHelpText(false);
          updateElement({ help: "" });
        }}
        addButtonTitle="Hilfetext verfassen"
        onAddItem={() => setShowHelpText(true)}
      />

      <InputWithDeleteButton
        name={`context.sections.${sectionIndex}.elements.${elementIndex}.note`}
        disabled={readOnlyMode}
        placeholder="Bemerkung eingeben"
        multiline
        defaultValue={element.note}
        label="Bemerkungsfeld"
        onDelete={() => {
          setShowNote(false);
          updateElement({ note: "" });
        }}
        addButtonTitle="Bemerkungsfeld hinzufügen"
        onAddItem={() => setShowNote(true)}
      />
    </Stack>
  );
}
