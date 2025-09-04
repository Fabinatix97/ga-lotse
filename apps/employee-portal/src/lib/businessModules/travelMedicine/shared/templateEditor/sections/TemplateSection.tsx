/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Sheet, Stack } from "@mui/joy";
import { ReactNode } from "react";

import { FieldArrayWithFocus, useSnackbar } from "@eshg/lib-portal";
import { ApiTemplateSectionElement } from "@eshg/travel-medicine-api";

import { SectionButtonBar } from "@/lib/businessModules/travelMedicine/shared/templateEditor/sections/SectionButtonBar";
import { SectionDataElementList } from "@/lib/businessModules/travelMedicine/shared/templateEditor/sections/dataElements/SectionDataElementList";

function createEmptyAnamnesisQuestionElement(): ApiTemplateSectionElement {
  return {
    anamnesisQuestion: {
      questionText: "",
      subElementMultiSelect: [],
      subElementText: undefined,
    },
  };
}

function createEmptyTextBlockElement(): ApiTemplateSectionElement {
  return { textBlock: { textField: "" } };
}

function createEmptyConfirmationElement(): ApiTemplateSectionElement {
  return { confirmation: { confirmationTextField: "" } };
}

interface MedicalHistoryTemplateSectionProp {
  sectionFormikPath: string;
  sectionElements: ApiTemplateSectionElement[];
  sectionTitle: ReactNode;
  sectionIndex: number;
}

export function TemplateSection({
  sectionFormikPath,
  sectionElements,
  sectionTitle,
  sectionIndex,
}: Readonly<MedicalHistoryTemplateSectionProp>) {
  const snackbar = useSnackbar();
  const sectionElementsFormikPath = `${sectionFormikPath}.sectionElements`;

  function deleteSectionElementHandler(
    index: number,
    remove: (index: number) => void,
  ) {
    if (sectionElements.length > 1) {
      remove(index);
    } else {
      snackbar.error(
        "Jede Sektion muss mindestens einen Frageblock beinhalten",
      );
    }
  }

  return (
    <Sheet
      sx={{ marginTop: 3 }}
      aria-label={`${sectionIndex + 1}. Sektion`}
      data-testid="section"
      role="group"
    >
      <FieldArrayWithFocus
        name={`${sectionElementsFormikPath}`}
        validateOnChange={false}
        valueLength={sectionElements.length}
      >
        {({ push, remove, replace, setInputElementRef }) => (
          <Stack direction="row" spacing={2}>
            <Stack
              flex={1}
              direction="column"
              spacing={2}
              data-testid={sectionFormikPath}
              sx={{ maxWidth: "100%" }}
            >
              {sectionTitle}

              <SectionDataElementList
                setInputElementRef={setInputElementRef}
                sectionElementsFormikPath={`${sectionElementsFormikPath}`}
                sectionElements={sectionElements}
                sectionElementDeleteHandler={(index) =>
                  deleteSectionElementHandler(index, remove)
                }
                replaceSectionElementHandler={replace}
                sectionIndex={sectionIndex}
              />
              <SectionButtonBar
                textBlockButtonAction={() =>
                  push(createEmptyTextBlockElement())
                }
                anamnesisButtonAction={() =>
                  push(createEmptyAnamnesisQuestionElement())
                }
                confirmationButtonAction={() =>
                  push(createEmptyConfirmationElement())
                }
              />
            </Stack>
          </Stack>
        )}
      </FieldArrayWithFocus>
    </Sheet>
  );
}
