/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiTemplateSectionElement } from "@eshg/employee-portal-api/travelMedicine/models";

import { TemplateSectionElementProp } from "@/lib/businessModules/travelMedicine/shared/templateEditor/sections/dataElements/SectionDataElementList";
import { TemplateConfirmation } from "@/lib/businessModules/travelMedicine/shared/templateEditor/sections/dataElements/TemplateConfirmation";
import { TemplateTextBlock } from "@/lib/businessModules/travelMedicine/shared/templateEditor/sections/dataElements/TemplateTextBlock";
import {
  AnamnesisQuestion,
  createEmptySubTextElement,
} from "@/lib/businessModules/travelMedicine/shared/templateEditor/sections/dataElements/anamnesisQuestion/AnamnesisQuestion";
import { MainQuestion } from "@/lib/businessModules/travelMedicine/shared/templateEditor/sections/dataElements/anamnesisQuestion/MainQuestion";

export class SectionElementComponentFactory {
  private sectionElementsFormikPath;
  private sectionIndex;

  public constructor(private sectionProps: TemplateSectionElementProp) {
    this.sectionElementsFormikPath = sectionProps.sectionElementsFormikPath;
    this.sectionIndex = sectionProps.sectionIndex;
  }

  public createSectionElementComponents() {
    return this.sectionProps.sectionElements.map((element, index) => {
      if (element.anamnesisQuestion) {
        return this.createAnamnesisComponent(index, element);
      } else if (element.textBlock) {
        return this.createTextBlockComponent(index);
      } else if (element.confirmation) {
        return this.createTemplateConfirmationComponent(index);
      }
      throw new Error(
        "Can't create section element component due to faulty ApiTemplateSectionElement value",
      );
    });
  }

  private createTextBlockComponent(index: number) {
    return (
      <TemplateTextBlock
        sectionElementFormikPath={this.getTextBlockFormikPath(index)}
        sectionElementDeleteHandler={() =>
          this.sectionProps.sectionElementDeleteHandler(index)
        }
        label={`${this.sectionIndex + 1}. Sektion, ${index + 1}. Element, Textblock`}
        key={index}
      />
    );
  }

  private getFormikArrayPath(index: number) {
    return `${this.sectionElementsFormikPath}[${index}]`;
  }

  private getTextBlockFormikPath(index: number) {
    return `${this.getFormikArrayPath(index)}.textBlock`;
  }

  private createTemplateConfirmationComponent(index: number) {
    return (
      <TemplateConfirmation
        sectionElementFormikPath={this.getTemplateConfirmationFormikPath(index)}
        sectionElementDeleteHandler={() =>
          this.sectionProps.sectionElementDeleteHandler(index)
        }
        label={`${this.sectionIndex + 1}. Sektion, ${index + 1}. Element, Bestätigungsfeld`}
        key={index}
      />
    );
  }

  private getTemplateConfirmationFormikPath(index: number) {
    return `${this.getFormikArrayPath(index)}.confirmation`;
  }

  private createAnamnesisComponent(
    index: number,
    sectionElement: ApiTemplateSectionElement,
  ) {
    return (
      <AnamnesisQuestion
        anamnesisFormikPath={this.getAnamnesisFormikPath(index)}
        templateAnamnesisQuestion={sectionElement.anamnesisQuestion!}
        addSubElementHandler={() => this.addAnamnesisSubText(index)}
        removeSubQuestionHandler={() => this.removeAnamnesisSubText(index)}
        mainQuestion={
          <MainQuestion
            elementDataFormikPath={this.getAnamnesisFormikPath(index)}
            sectionElementDeleteHandler={() =>
              this.sectionProps.sectionElementDeleteHandler(index)
            }
            label={`${this.sectionIndex + 1}. Sektion, ${index + 1}. Element, Frage`}
          />
        }
        sectionIndex={this.sectionIndex}
        elementIndex={index}
        key={index}
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
