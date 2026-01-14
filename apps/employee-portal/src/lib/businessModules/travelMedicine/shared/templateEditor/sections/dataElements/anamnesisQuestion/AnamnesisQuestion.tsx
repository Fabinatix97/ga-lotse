/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Add } from "@mui/icons-material";
import { Box, Button } from "@mui/joy";
import { useCallback, useEffect, useRef, useState } from "react";

import { FieldArrayWithFocus } from "@eshg/lib-portal";
import {
  ApiTemplateAnamnesisQuestion,
  ApiTemplateSubElementText,
} from "@eshg/travel-medicine-api";

import { DataElementBox } from "@/lib/businessModules/travelMedicine/shared/templateEditor/sections/dataElements/DataElementBox";
import { DataElementHeading } from "@/lib/businessModules/travelMedicine/shared/templateEditor/sections/dataElements/DataElementHeading";
import { MainQuestion } from "@/lib/businessModules/travelMedicine/shared/templateEditor/sections/dataElements/anamnesisQuestion/MainQuestion";
import { SubMultiSelectList } from "@/lib/businessModules/travelMedicine/shared/templateEditor/sections/dataElements/anamnesisQuestion/subElements/SubMultiSelectList";
import { SubQuestion } from "@/lib/businessModules/travelMedicine/shared/templateEditor/sections/dataElements/anamnesisQuestion/subElements/SubQuestion";

export function createEmptySubTextElement() {
  const subtextElement: ApiTemplateSubElementText = {
    questionText: "",
  };
  return subtextElement;
}

interface AnamnesisQuestionProp {
  anamnesisFormikPath: string;
  templateAnamnesisQuestion: ApiTemplateAnamnesisQuestion;
  addSubElementHandler: () => void;
  removeSubQuestionHandler: () => void;
  sectionElementDeleteHandler: () => void;
  sectionIndex: number;
  elementIndex: number;
  setInputElementRef: (el: HTMLInputElement) => void;
  totalAmountOfSectionElements: number;
}

export function AnamnesisQuestion({
  anamnesisFormikPath,
  templateAnamnesisQuestion,
  addSubElementHandler,
  removeSubQuestionHandler,
  sectionIndex,
  elementIndex,
  setInputElementRef,
  totalAmountOfSectionElements,
  sectionElementDeleteHandler,
}: Readonly<AnamnesisQuestionProp>) {
  const lastSelectListElementRef = useRef<HTMLInputElement>(undefined);
  const subElementRef = useRef<HTMLInputElement>(undefined);
  const fallbackInputElementRef = useRef<HTMLInputElement>(undefined);
  const removeSubElement = useCallback(() => {
    removeSubQuestionHandler();
    (
      lastSelectListElementRef.current ?? fallbackInputElementRef.current
    )?.focus();
  }, [
    lastSelectListElementRef,
    removeSubQuestionHandler,
    fallbackInputElementRef,
  ]);

  const [subElementAdded, setSubElementAdded] = useState(false);
  const addSubElement = useCallback(() => {
    addSubElementHandler();
    setSubElementAdded(true);
  }, [addSubElementHandler]);

  useEffect(() => {
    if (subElementRef.current) {
      subElementRef.current.focus();
      setSubElementAdded(false);
    }
  }, [subElementAdded]);

  const multiSelectElementsFormikPath = `${anamnesisFormikPath}.subElementMultiSelect`;
  return (
    <DataElementBox
      data-testid="section-element-question"
      role="group"
      aria-label={`${sectionIndex + 1}. Sektion, ${elementIndex + 1}. Sektion, Anamnesefrage`}
    >
      <DataElementHeading>Anamnesefrage</DataElementHeading>
      <MainQuestion
        setInputElementRef={(el) => {
          setInputElementRef(el);
          fallbackInputElementRef.current = el;
        }}
        elementDataFormikPath={anamnesisFormikPath}
        sectionElementDeleteHandler={sectionElementDeleteHandler}
        label={`${sectionIndex + 1}. Sektion, ${elementIndex + 1}. Element, Frage`}
        showDeleteButton={totalAmountOfSectionElements > 1}
      />
      <Box sx={{ paddingLeft: 4, mt: 2 }}>
        <FieldArrayWithFocus
          name={multiSelectElementsFormikPath}
          validateOnChange
          valueLength={templateAnamnesisQuestion.subElementMultiSelect.length}
          fallbackFocusInputElement={
            subElementRef.current ?? fallbackInputElementRef.current
          }
        >
          {({ push, remove, setInputElementRef }) => (
            <>
              {templateAnamnesisQuestion.subElementMultiSelect.length > 0 && (
                <SubMultiSelectList
                  setInputElementRef={(el, index) => {
                    if (
                      index ===
                      templateAnamnesisQuestion.subElementMultiSelect.length - 1
                    ) {
                      lastSelectListElementRef.current = el;
                    }
                    setInputElementRef(el, index);
                  }}
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
                  setInputElementRef={(el) => (subElementRef.current = el)}
                  subElementTextFormikPath={`${anamnesisFormikPath}.subElementText`}
                  subQuestionDeleteHandler={removeSubElement}
                  multiSelectLength={
                    templateAnamnesisQuestion.subElementMultiSelect.length
                  }
                  label={`${sectionIndex + 1}. Sektion, ${elementIndex + 1}. Element`}
                />
              )}

              {!templateAnamnesisQuestion.subElementText && (
                <Button
                  startDecorator={<Add />}
                  variant="plain"
                  onClick={addSubElement}
                >
                  Text hinzufügen
                </Button>
              )}
              <Button
                startDecorator={<Add />}
                variant="plain"
                data-testid="element-add-multi-select-button"
                onClick={() => push(createEmptySubTextElement())}
              >
                {templateAnamnesisQuestion.subElementMultiSelect.length === 0
                  ? "Mehrfachauswahl hinzufügen"
                  : "Antwortmöglichkeit hinzufügen"}
              </Button>
            </>
          )}
        </FieldArrayWithFocus>
      </Box>
    </DataElementBox>
  );
}
