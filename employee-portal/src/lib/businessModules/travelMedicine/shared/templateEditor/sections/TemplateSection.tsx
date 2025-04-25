/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Sheet, Stack } from "@mui/joy";
import { FieldArray } from "formik";
import { ReactNode } from "react";

import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { ApiTemplateSectionElement } from "@eshg/travel-medicine-api";

import { SectionButtonBar } from "@/lib/businessModules/travelMedicine/shared/templateEditor/sections/SectionButtonBar";
import { SectionDataElementList } from "@/lib/businessModules/travelMedicine/shared/templateEditor/sections/dataElements/SectionDataElementList";

export function createEmptyAnamnesisQuestionElement(): ApiTemplateSectionElement {
  return {
    anamnesisQuestion: {
      questionText: "",
      subElementMultiSelect: [],
      subElementText: undefined,
    },
  };
}

export function createEmptyTextBlockElement(): ApiTemplateSectionElement {
  return { textBlock: { textField: "" } };
}

export function createEmptyConfirmationElement(): ApiTemplateSectionElement {
  return { confirmation: { confirmationTextField: "" } };
}

export interface MedicalHistoryTemplateSectionProp {
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
    >
      <FieldArray
        name={`${sectionElementsFormikPath}`}
        validateOnChange={false}
      >
        {({ push, remove, replace }) => (
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
      </FieldArray>
    </Sheet>
  );
}
