/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ApiCLSectionContext,
  ApiCLSectionContextElementsInner,
} from "@eshg/employee-portal-api/inspection";
import { DraggableProvidedDragHandleProps } from "@hello-pangea/dnd";
import { Add, DragIndicatorOutlined } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionGroup,
  AccordionSummary,
  Button,
  Input,
  Stack,
} from "@mui/joy";
import { doNothing } from "remeda";
import { v4 as uuidv4 } from "uuid";

import { ChecklistDefinitionElementsList } from "@/lib/businessModules/inspection/components/checklistDefinition/elements/ChecklistDefinitionElementsList";
import { CopyDeleteDropdown } from "@/lib/businessModules/inspection/components/checklistDefinition/helpers/CopyDeleteDropdown";
import { createChecklistElement } from "@/lib/businessModules/inspection/components/checklistDefinition/helpers/helpers";
import { InformationSheet } from "@/lib/shared/components/infoTile/InformationSheet";

interface ChecklistDefinitionSectionElementProps {
  section: ApiCLSectionContext;
  setSection?: (section: ApiCLSectionContext) => void;
  deleteSection?: () => void;
  addSection?: (section: ApiCLSectionContext) => void;
  sectionIndex: number;
  readOnlyMode?: boolean;
  dragHandleProps?: DraggableProvidedDragHandleProps | null;
}

export function ChecklistDefinitionSection({
  section,
  setSection = doNothing,
  deleteSection = doNothing,
  addSection = doNothing,
  sectionIndex,
  readOnlyMode,
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

  function setElements(elements: ApiCLSectionContextElementsInner[]) {
    updateSection({
      elements,
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
            <Stack
              direction="row"
              spacing={2}
              display="flex"
              flex={1}
              alignContent="center"
              justifyContent="center"
              alignItems="center"
            >
              <div
                {...dragHandleProps}
                aria-label={`Section ${defaultIndex} Ziehen und Verschieben`}
                role="button"
              >
                <DragIndicatorOutlined
                  style={{
                    backgroundColor: "#E3EFFB",
                    borderRadius: 50,
                    padding: 4,
                    width: 32,
                    height: 32,
                  }}
                />
              </div>
              <Input
                aria-label="Abschnittsnummer"
                value={defaultIndex.toString()}
                disabled
                style={{ width: 54, height: 51 }}
              />
              <Input
                disabled={readOnlyMode}
                style={{ flex: 1, height: 51 }}
                defaultValue={section?.title ?? ""}
                placeholder={`Titel Sektion ${defaultIndex} eingeben`}
                onBlur={(event) => setTitle(event.target.value)}
              />
              {!readOnlyMode && (
                <CopyDeleteDropdown
                  onDelete={() => deleteSection()}
                  onCopy={() => copySection()}
                />
              )}
              <AccordionSummary
                slotProps={{
                  button: {
                    "aria-label": "Abschnitt erweitern/einklappen",
                  },
                }}
              />
            </Stack>
            <AccordionDetails
              aria-label={`Fragen zu Abschnitt ${sectionIndex}`}
              slotProps={{
                root: {
                  "aria-labelledby": undefined,
                },
              }}
            >
              <Stack spacing={2} style={{ marginTop: 12, marginLeft: 48 }}>
                <ChecklistDefinitionElementsList
                  readOnlyMode={readOnlyMode}
                  elements={section.elements}
                  setElements={(elements) => {
                    setElements(elements);
                  }}
                  sectionIndex={sectionIndex}
                />
                <Stack spacing={2} direction={"row"}>
                  <Button
                    disabled={readOnlyMode}
                    color="neutral"
                    startDecorator={<Add />}
                    variant="plain"
                    onClick={() => addNewElement("CHECKBOX")}
                  >
                    Frage hinzufügen
                  </Button>
                  <Button
                    disabled={readOnlyMode}
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
