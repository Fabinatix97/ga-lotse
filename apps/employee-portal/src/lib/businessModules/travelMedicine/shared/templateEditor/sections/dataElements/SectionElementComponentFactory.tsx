/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Box } from "@mui/joy";

import { ApiTemplateSectionElement } from "@eshg/travel-medicine-api";

import { TemplateSectionElementProp } from "@/lib/businessModules/travelMedicine/shared/templateEditor/sections/dataElements/SectionDataElementList";
import { TemplateConfirmation } from "@/lib/businessModules/travelMedicine/shared/templateEditor/sections/dataElements/TemplateConfirmation";
import { TemplateTextBlock } from "@/lib/businessModules/travelMedicine/shared/templateEditor/sections/dataElements/TemplateTextBlock";
import {
  AnamnesisQuestion,
  createEmptySubTextElement,
} from "@/lib/businessModules/travelMedicine/shared/templateEditor/sections/dataElements/anamnesisQuestion/AnamnesisQuestion";

export class SectionElementComponentFactory {
  private sectionElementsFormikPath;
  private sectionIndex;

  public constructor(private sectionProps: TemplateSectionElementProp) {
    this.sectionElementsFormikPath = sectionProps.sectionElementsFormikPath;
    this.sectionIndex = sectionProps.sectionIndex;
  }

  public createSectionElementComponents() {
    return (
      <Box display="contents" role="list">
        {this.sectionProps.sectionElements
          .map((element, index) => {
            if (element.anamnesisQuestion) {
              return this.createAnamnesisQuestionComponent(
                index,
                this.sectionProps.sectionElements.length,
                element,
                (el) => this.sectionProps.setInputElementRef(el, index),
              );
            } else if (element.textBlock) {
              return this.createTextBlockComponent(
                index,
                this.sectionProps.sectionElements.length,
                (el) => this.sectionProps.setInputElementRef(el, index),
              );
            } else if (element.confirmation) {
              return this.createTemplateConfirmationComponent(
                index,
                this.sectionProps.sectionElements.length,
                (el) => this.sectionProps.setInputElementRef(el, index),
              );
            }
            throw new Error(
              "Can't create section element component due to faulty ApiTemplateSectionElement value",
            );
          })
          .map((it, index) => (
            <Box key={index} display="contents" role="listitem">
              {it}
            </Box>
          ))}
      </Box>
    );
  }

  private createTextBlockComponent(
    index: number,
    totalAmountOfElements: number,
    setInputElementRef: (el: HTMLInputElement) => void,
  ) {
    return (
      <TemplateTextBlock
        sectionElementFormikPath={this.getTextBlockFormikPath(index)}
        sectionElementDeleteHandler={() =>
          this.sectionProps.sectionElementDeleteHandler(index)
        }
        label={`${this.sectionIndex + 1}. Sektion, ${index + 1}. Element, Textblock`}
        setInputElementRef={setInputElementRef}
        showDeleteButton={totalAmountOfElements > 1}
      />
    );
  }

  private getFormikArrayPath(index: number) {
    return `${this.sectionElementsFormikPath}[${index}]`;
  }

  private getTextBlockFormikPath(index: number) {
    return `${this.getFormikArrayPath(index)}.textBlock`;
  }

  private createTemplateConfirmationComponent(
    index: number,
    totalAmountOfElements: number,
    setInputElementRef: (el: HTMLInputElement) => void,
  ) {
    return (
      <TemplateConfirmation
        sectionElementFormikPath={this.getTemplateConfirmationFormikPath(index)}
        sectionElementDeleteHandler={() =>
          this.sectionProps.sectionElementDeleteHandler(index)
        }
        label={`${this.sectionIndex + 1}. Sektion, ${index + 1}. Element, Bestätigungsfeld`}
        setInputElementRef={setInputElementRef}
        showDeleteButton={totalAmountOfElements > 1}
      />
    );
  }

  private getTemplateConfirmationFormikPath(index: number) {
    return `${this.getFormikArrayPath(index)}.confirmation`;
  }

  private createAnamnesisQuestionComponent(
    index: number,
    totalAmountOfElements: number,
    sectionElement: ApiTemplateSectionElement,
    setInputElementRef: (el: HTMLInputElement) => void,
  ) {
    return (
      <AnamnesisQuestion
        anamnesisFormikPath={this.getAnamnesisFormikPath(index)}
        templateAnamnesisQuestion={sectionElement.anamnesisQuestion!}
        addSubElementHandler={() => this.addAnamnesisSubText(index)}
        removeSubQuestionHandler={() => this.removeAnamnesisSubText(index)}
        sectionIndex={this.sectionIndex}
        elementIndex={index}
        setInputElementRef={setInputElementRef}
        totalAmountOfSectionElements={totalAmountOfElements}
        sectionElementDeleteHandler={() =>
          this.sectionProps.sectionElementDeleteHandler(index)
        }
      />
    );
  }

  private getAnamnesisFormikPath(index: number) {
    return `${this.getFormikArrayPath(index)}.anamnesisQuestion`;
  }

  private addAnamnesisSubText(index: number) {
    const selectedSectionElement = this.sectionProps.sectionElements[index];

    if (selectedSectionElement) {
      selectedSectionElement.anamnesisQuestion!.subElementText =
        createEmptySubTextElement();
      this.sectionProps.replaceSectionElementHandler(
        index,
        selectedSectionElement,
      );
    }
  }

  private removeAnamnesisSubText(index: number) {
    const selectedSectionElement = this.sectionProps.sectionElements[index];

    if (selectedSectionElement) {
      selectedSectionElement.anamnesisQuestion!.subElementText = undefined;
      this.sectionProps.replaceSectionElementHandler(
        index,
        selectedSectionElement,
      );
    }
  }
}
