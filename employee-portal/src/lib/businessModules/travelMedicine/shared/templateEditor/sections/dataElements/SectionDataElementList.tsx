/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiTemplateSectionElement } from "@eshg/employee-portal-api/travelMedicine";

import { SectionElementComponentFactory } from "@/lib/businessModules/travelMedicine/shared/templateEditor/sections/dataElements/SectionElementComponentFactory";

export interface TemplateSectionElementProp {
  sectionElementsFormikPath: string;
  sectionElements: ApiTemplateSectionElement[];
  sectionElementDeleteHandler: (index: number) => void;
  replaceSectionElementHandler: (
    index: number,
    sectionElement: ApiTemplateSectionElement,
  ) => void;
}

export function SectionDataElementList(
  props: Readonly<TemplateSectionElementProp>,
) {
  const factory = new SectionElementComponentFactory(props);
  const mappedSectionElements = factory.createSectionElementComponents();

  return <>{mappedSectionElements}</>;
}
