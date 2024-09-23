/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiMedicalHistoryTemplateSectionElementData,
  ApiMedicalHistoryTemplateSubElementText,
} from "@eshg/employee-portal-api/travelMedicine/models";
import { Add } from "@mui/icons-material";
import { Box, Button } from "@mui/joy";
import { FieldArray } from "formik";
import { ReactNode } from "react";

import { SubMultiSelectList } from "@/lib/businessModules/travelMedicine/components/templates/medicalHistory/editor/sections/dataElements/subElements/SubMultiSelectList";
import { SubQuestion } from "@/lib/businessModules/travelMedicine/components/templates/medicalHistory/editor/sections/dataElements/subElements/SubQuestion";

export function createEmptySubTextElement() {
  const subtextElement: ApiMedicalHistoryTemplateSubElementText = {
    questionText: "",
  };
  return subtextElement;
}

export interface MedicalHistoryTemplateSectionElementProp {
  elementDataFormikPath: string;
  sectionElementData: ApiMedicalHistoryTemplateSectionElementData;
  addSubElementHandler: () => void;
  removeSubQuestionHandler: () => void;
  mainQuestion: ReactNode;
}

export function SectionDataElement({
  elementDataFormikPath,
  sectionElementData,
  addSubElementHandler,
  mainQuestion,
  removeSubQuestionHandler,
}: Readonly<MedicalHistoryTemplateSectionElementProp>) {
  const multiSelectElementsFormikPath = `${elementDataFormikPath}.subElementMultiSelect`;
  return (
    <Box
      boxShadow="sm"
      border="1px solid var(--neutral-outlined-border, #CDD7E1)"
      borderRadius={12}
      component="section"
      flex={1}
      style={{
        padding: 12,
        background: "var(--background-level-1, #F0F4F8)",
      }}
      data-testid="questions"
    >
      {mainQuestion}

      <Box sx={{ paddingLeft: 4, mt: 2 }}>
        <FieldArray
          name={multiSelectElementsFormikPath}
          validateOnChange={false}
        >
          {({ push, remove }) => (
            <>
              {sectionElementData.subElementMultiSelect.length > 0 && (
                <SubMultiSelectList
                  multiSelectElementsFormikPath={multiSelectElementsFormikPath}
                  multiSelectElements={sectionElementData.subElementMultiSelect}
                  removeMultiSelectElementHandler={remove}
                />
              )}
              {sectionElementData.subElementText && (
                <SubQuestion
                  subElementTextFormikPath={`${elementDataFormikPath}.subElementText`}
                  subQuestionDeleteHandler={removeSubQuestionHandler}
                  multiSelectLength={
                    sectionElementData.subElementMultiSelect.length
                  }
                />
              )}

              {!sectionElementData.subElementText && (
                <Button
                  startDecorator={<Add />}
                  onClick={addSubElementHandler}
                  variant="plain"
                >
                  Text hinzufügen
                </Button>
              )}
              <Button
                startDecorator={<Add />}
                onClick={() => push(createEmptySubTextElement())}
                variant="plain"
                data-testid="addMultiSelectQuestionText"
              >
                {sectionElementData.subElementMultiSelect.length == 0
                  ? "Mehrfachauswahl hinzufügen"
                  : "Antwortmöglichkeit hinzufügen"}
              </Button>
            </>
          )}
        </FieldArray>
      </Box>
    </Box>
  );
}
