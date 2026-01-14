/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiTemplateSectionElement } from "@eshg/travel-medicine-api";

import { SectionElementComponentFactory } from "@/lib/businessModules/travelMedicine/shared/templateEditor/sections/dataElements/SectionElementComponentFactory";

export interface TemplateSectionElementProp {
  sectionElementsFormikPath: string;
  sectionElements: ApiTemplateSectionElement[];
  sectionElementDeleteHandler: (index: number) => void;
  replaceSectionElementHandler: (
    index: number,
    sectionElement: ApiTemplateSectionElement,
  ) => void;
  sectionIndex: number;
  setInputElementRef: (el: HTMLInputElement, index: number) => void;
}

export function SectionDataElementList(
  props: Readonly<TemplateSectionElementProp>,
) {
  const factory = new SectionElementComponentFactory(props);
  return factory.createSectionElementComponents();
}
