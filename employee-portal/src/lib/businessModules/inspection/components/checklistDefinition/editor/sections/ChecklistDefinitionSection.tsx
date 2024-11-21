/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ApiCLSectionContext,
  ApiCLSectionContextElementsInner,
} from "@eshg/employee-portal-api/inspection";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { DraggableProvidedDragHandleProps } from "@hello-pangea/dnd";
import { Add } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionGroup,
  AccordionSummary,
  Button,
  Stack,
  Typography,
} from "@mui/joy";
import { doNothing } from "remeda";
import { v4 as uuidv4 } from "uuid";

import { ChecklistDefinitionElementsList } from "@/lib/businessModules/inspection/components/checklistDefinition/editor/elements/ChecklistDefinitionElementsList";
import { CopyDeleteDropdown } from "@/lib/businessModules/inspection/components/checklistDefinition/helpers/CopyDeleteDropdown";
import { DragHandle } from "@/lib/businessModules/inspection/components/checklistDefinition/helpers/DragHandle";
import { InputFieldBar } from "@/lib/businessModules/inspection/components/checklistDefinition/helpers/InputFieldBar";
import { createChecklistElement } from "@/lib/businessModules/inspection/components/checklistDefinition/helpers/helpers";
import { InformationSheet } from "@/lib/shared/components/infoTile/InformationSheet";

interface ChecklistDefinitionSectionElementProps {
  section: ApiCLSectionContext;
  setSection?: (section: ApiCLSectionContext) => void;
  deleteSection?: () => void;
  addSection?: (section: ApiCLSectionContext) => void;
  sectionIndex: number;
  dragHandleProps?: DraggableProvidedDragHandleProps | null;
}

export function ChecklistDefinitionSection({
  section,
  setSection = doNothing,
  deleteSection = doNothing,
  addSection = doNothing,
  sectionIndex,
  dragHandleProps,
}: Readonly<ChecklistDefinitionSectionElementProps>) {
  function updateSection(update: Partial<ApiCLSectionContext>) {
    setSection({ ...section, ...update });
  }

  function setTitle(title: string) {
    updateSection({
      title,
    });
  }

  function copySection() {
    const newSection: ApiCLSectionContext = {
      title: "",
      elements: [createChecklistElement("CHECKBOX")],
      id: uuidv4(),
    };
    addSection(newSection);
  }

  function addNewElement(type: ApiCLSectionContextElementsInner["type"]) {
    updateSection({
      elements: [...section.elements, createChecklistElement(type)],
    });
  }

  const defaultIndex = sectionIndex + 1;
  return (
    <AccordionGroup
      variant="plain"
      transition="0.5s"
      style={{ marginLeft: -12, marginRight: -12 }}
    >
      <Accordion defaultExpanded>
        <Stack
          spacing={2}
          key={section?.id}
          component="section"
          aria-label={`Sektion ${defaultIndex}`}
        >
          <InformationSheet>
            <InputFieldBar
              startDecorator={
                <>
                  {dragHandleProps && (
                    <DragHandle
                      {...dragHandleProps}
                      aria-label={`Sektion ${defaultIndex} ziehen und verschieben`}
                    />
                  )}
                  <Typography aria-label="Sektionsnummer" level="body-lg">
                    {defaultIndex.toString()}
                  </Typography>
                </>
              }
              input={
                <InputField
                  name={`context.sections.${sectionIndex}.title`}
                  label="Sektionstitel"
                  sx={{ flex: 1 }}
                  placeholder={`Titel Sektion ${defaultIndex} eingeben`}
                  required="Bitte geben Sie einen Titel ein."
                  onBlur={(event) => setTitle(event.target.value)}
                />
              }
              endDecorator={
                <>
                  <CopyDeleteDropdown
                    onDelete={() => deleteSection()}
                    onCopy={() => copySection()}
                  />
                  <AccordionSummary
                    slotProps={{
                      button: {
                        "aria-label": "Sektion erweitern/einklappen",
                      },
                    }}
                  />
                </>
              }
            />
            <AccordionDetails
              aria-label={`Fragen zu Sektion ${sectionIndex}`}
              slotProps={{
                root: {
                  "aria-labelledby": undefined,
                },
              }}
            >
              <Stack spacing={2} style={{ marginLeft: "3rem" }}>
                <ChecklistDefinitionElementsList sectionIndex={sectionIndex} />
                <Stack spacing={2} direction={"row"}>
                  <Button
                    color="neutral"
                    startDecorator={<Add />}
                    variant="plain"
                    onClick={() => addNewElement("CHECKBOX")}
                  >
                    Frage hinzufügen
                  </Button>
                  <Button
                    color="neutral"
                    startDecorator={<Add />}
                    variant="plain"
                    onClick={() => addNewElement("SEPARATOR")}
                  >
                    Trennlinie hinzufügen
                  </Button>
                </Stack>
              </Stack>
            </AccordionDetails>
          </InformationSheet>
        </Stack>
      </Accordion>
    </AccordionGroup>
  );
}
