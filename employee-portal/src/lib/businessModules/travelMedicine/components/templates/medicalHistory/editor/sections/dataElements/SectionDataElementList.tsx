/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiMedicalHistoryTemplateSectionElement } from "@eshg/employee-portal-api/travelMedicine/models";

import { MainQuestion } from "@/lib/businessModules/travelMedicine/components/templates/medicalHistory/editor/sections/dataElements/MainQuestion";
import {
  SectionDataElement,
  createEmptySubTextElement,
} from "@/lib/businessModules/travelMedicine/components/templates/medicalHistory/editor/sections/dataElements/SectionDataElement";

export interface MedicalHistoryTemplateSectionElementProp {
  sectionElementsFormikPath: string;
  sectionElements: ApiMedicalHistoryTemplateSectionElement[];
  sectionElementDeleteHandler: (index: number) => void;
  replaceSectionElementHandler: (
    index: number,
    sectionElement: ApiMedicalHistoryTemplateSectionElement,
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
