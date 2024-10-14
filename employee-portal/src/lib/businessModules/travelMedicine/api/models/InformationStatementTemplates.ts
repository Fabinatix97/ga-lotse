/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiDisease,
  ApiInformationStatementTemplate,
  ApiInformationStatementTemplateState,
  ApiTemplateContent,
} from "@eshg/employee-portal-api/travelMedicine";
import { mapOptionalValue } from "@eshg/lib-portal/helpers/form";

import {
  BaseEntity,
  mapBaseEntity,
} from "@/lib/businessModules/travelMedicine/api/models/BaseEntity";

export interface InformationStatementTemplate extends BaseEntity {
  readonly createdAt: Date;
  readonly diseases: ApiDisease[];
  readonly modifiedAt?: Date;
  readonly name: string;
  readonly state: ApiInformationStatementTemplateState;
  readonly title: string;
  readonly content: ApiTemplateContent;
}

export function mapInformationStatementTemplate(
  response: ApiInformationStatementTemplate,
): InformationStatementTemplate {
  return {
    ...mapBaseEntity(response),
    createdAt: response.createdAt,
    diseases: response.diseases,
    modifiedAt: mapOptionalValue(response.modifiedAt),
    name: response.name,
    state: response.state,
    title: response.title,
    content: response.content,
  };
}
