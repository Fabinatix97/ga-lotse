/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Add } from "@mui/icons-material";
import { Box, Button } from "@mui/joy";
import { FieldArray } from "formik";
import { ReactNode } from "react";

import {
  ApiTemplateAnamnesisQuestion,
  ApiTemplateSubElementText,
} from "@eshg/travel-medicine-api";

import { DataElementBox } from "@/lib/businessModules/travelMedicine/shared/templateEditor/sections/dataElements/DataElementBox";
import { DataElementHeading } from "@/lib/businessModules/travelMedicine/shared/templateEditor/sections/dataElements/DataElementHeading";
import { SubMultiSelectList } from "@/lib/businessModules/travelMedicine/shared/templateEditor/sections/dataElements/anamnesisQuestion/subElements/SubMultiSelectList";
import { SubQuestion } from "@/lib/businessModules/travelMedicine/shared/templateEditor/sections/dataElements/anamnesisQuestion/subElements/SubQuestion";

export function createEmptySubTextElement() {
  const subtextElement: ApiTemplateSubElementText = {
    questionText: "",
  };
  return subtextElement;
}

export interface AnamnesisQuestionProp {
  anamnesisFormikPath: string;
  templateAnamnesisQuestion: ApiTemplateAnamnesisQuestion;
  addSubElementHandler: () => void;
  removeSubQuestionHandler: () => void;
  mainQuestion: ReactNode;
  sectionIndex: number;
  elementIndex: number;
}

export function AnamnesisQuestion({
  anamnesisFormikPath,
  templateAnamnesisQuestion,
  addSubElementHandler,
  mainQuestion,
  removeSubQuestionHandler,
  sectionIndex,
  elementIndex,
}: Readonly<AnamnesisQuestionProp>) {
  const multiSelectElementsFormikPath = `${anamnesisFormikPath}.subElementMultiSelect`;
  return (
    <DataElementBox data-testid="section-element-question">
      <DataElementHeading>Anamnesefrage</DataElementHeading>
      {mainQuestion}
      <Box sx={{ paddingLeft: 4, mt: 2 }}>
        <FieldArray
          name={multiSelectElementsFormikPath}
          validateOnChange={true}
        >
          {({ push, remove }) => (
            <>
              {templateAnamnesisQuestion.subElementMultiSelect.length > 0 && (
                <SubMultiSelectList
                  multiSelectElementsFormikPath={multiSelectElementsFormikPath}
                  multiSelectElements={
                    templateAnamnesisQuestion.subElementMultiSelect
                  }
                  removeMultiSelectElementHandler={remove}
                  sectionIndex={sectionIndex}
                  elementIndex={elementIndex}
                />
              )}
              {templateAnamnesisQuestion.subElementText && (
                <SubQuestion
                  subElementTextFormikPath={`${anamnesisFormikPath}.subElementText`}
                  subQuestionDeleteHandler={removeSubQuestionHandler}
                  multiSelectLength={
                    templateAnamnesisQuestion.subElementMultiSelect.length
                  }
                  label={`${sectionIndex + 1}. Sektion, ${elementIndex + 1}. Element`}
                />
              )}

              {!templateAnamnesisQuestion.subElementText && (
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
                data-testid="element-add-multi-select-button"
              >
                {templateAnamnesisQuestion.subElementMultiSelect.length == 0
                  ? "Mehrfachauswahl hinzufügen"
                  : "Antwortmöglichkeit hinzufügen"}
              </Button>
            </>
          )}
        </FieldArray>
      </Box>
    </DataElementBox>
  );
}
