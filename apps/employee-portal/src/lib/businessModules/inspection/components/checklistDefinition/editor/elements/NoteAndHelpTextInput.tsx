/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Box } from "@mui/joy";

import { ApiCLSectionContextElementsInner } from "@eshg/inspection-api";

import { OptionalInputField } from "@/lib/businessModules/inspection/components/checklistDefinition/helpers/OptionalInputField";

interface NoteAndHelpTextInputProps {
  element: ApiCLSectionContextElementsInner;
  sectionIndex: number;
  elementIndex: number;
}

export function NoteAndHelpTextInput({
  element,
  sectionIndex,
  elementIndex,
}: Readonly<NoteAndHelpTextInputProps>) {
  if (element.type === "SEPARATOR" || element.type === "CLSeparatorContext") {
    return;
  }

  return (
    <Box
      sx={{
        display: "grid",
        gap: 2,
        // trick to make the buttons small but keep the input fields full width
        gridTemplateColumns: "max-content 1fr",
      }}
    >
      <OptionalInputField
        name={`context.sections.${sectionIndex}.elements.${elementIndex}.help`}
        placeholder="Hilfetext eingeben"
        multiline
        label="Hilfetext"
        addButtonLabel="Hilfetext verfassen"
        sx={{ gridColumn: "span 2 / span 2" }}
      />

      <OptionalInputField
        name={`context.sections.${sectionIndex}.elements.${elementIndex}.note`}
        placeholder="Bemerkung eingeben"
        multiline
        label="Bemerkungsfeld"
        addButtonLabel="Bemerkungsfeld hinzufügen"
        sx={{ gridColumn: "span 2 / span 2" }}
      />
    </Box>
  );
}
