/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiTemplateSectionElement } from "@eshg/employee-portal-api/travelMedicine";

import { MainQuestion } from "@/lib/businessModules/travelMedicine/shared/templateEditor/sections/dataElements/MainQuestion";
import {
  SectionDataElement,
  createEmptySubTextElement,
} from "@/lib/businessModules/travelMedicine/shared/templateEditor/sections/dataElements/SectionDataElement";

export interface MedicalHistoryTemplateSectionElementProp {
  sectionElementsFormikPath: string;
  sectionElements: ApiTemplateSectionElement[];
  sectionElementDeleteHandler: (index: number) => void;
  replaceSectionElementHandler: (
    index: number,
    sectionElement: ApiTemplateSectionElement,
  ) => void;
}

export function SectionDataElementList({
  sectionElementsFormikPath,
  sectionElements,
  sectionElementDeleteHandler,
  replaceSectionElementHandler,
}: Readonly<MedicalHistoryTemplateSectionElementProp>) {
  function getElementDataFormikPath(index: number) {
    return `${sectionElementsFormikPath}[${index}].elementData`;
  }

  function addSectionElementSubText(index: number) {
    const selectedSectionElement = sectionElements[index];

    if (selectedSectionElement) {
      selectedSectionElement.elementData.subElementText =
        createEmptySubTextElement();
      replaceSectionElementHandler(index, selectedSectionElement);
    }
  }

  function removeSectionElementSubText(index: number) {
    const selectedSectionElement = sectionElements[index];

    if (selectedSectionElement) {
      selectedSectionElement.elementData.subElementText = undefined;
      replaceSectionElementHandler(index, selectedSectionElement);
    }
  }

  return (
    <>
      {sectionElements.map((sectionElement, index) => (
        <SectionDataElement
          elementDataFormikPath={getElementDataFormikPath(index)}
          sectionElementData={sectionElement.elementData}
          addSubElementHandler={() => addSectionElementSubText(index)}
          removeSubQuestionHandler={() => removeSectionElementSubText(index)}
          mainQuestion={
            <MainQuestion
              elementDataFormikPath={getElementDataFormikPath(index)}
              sectionElementDeleteHandler={() =>
                sectionElementDeleteHandler(index)
              }
            />
          }
          key={index}
        />
      ))}
    </>
  );
}
