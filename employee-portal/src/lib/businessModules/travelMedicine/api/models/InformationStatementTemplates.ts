/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  BaseEntity,
  mapBaseEntity,
} from "@eshg/lib-employee-portal/api/models/BaseEntity";
import { mapOptionalValue } from "@eshg/lib-portal/helpers/form";
import {
  ApiDisease,
  ApiInformationStatementTemplate,
  ApiInformationStatementTemplateState,
  ApiTemplateContent,
} from "@eshg/travel-medicine-api";

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
