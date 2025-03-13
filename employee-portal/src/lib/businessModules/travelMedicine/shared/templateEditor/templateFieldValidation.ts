/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { OptionalFieldValue, Validator } from "@eshg/lib-portal/types/form";
import { isEmpty, isNullish } from "remeda";

export function validateAnamnesisTemplateTitle() {
  return validateTemplateField("Der Anamnesename", true, 200);
}

export function validateInformationStatementTemplateFileName() {
  return validateTemplateField("Der interne Dateiname", true, 200);
}

export function validateInformationStatementTemplateDocumentTitle() {
  return validateTemplateField("Der Dokumententitel", true, 200);
}

export function validateSectionTitle() {
  return validateTemplateField("Der Sektionstitel", true, 200);
}

export function validateQuestionText() {
  return validateTemplateField("Das Fragefeld", true, 200);
}

export function validateLabelText() {
  return validateTemplateField("Das Label", true, 200);
}

export function validateSubElementMultiselectOption() {
  return validateTemplateField("Die Antwortmöglichkeit", true, 200);
}

export function validateTextBlock() {
  return validateTemplateField("Der Textblock", true);
}

export function validateConfirmationField() {
  return validateTemplateField("Das Bestätigungsfeld", true);
}

function validateTemplateField(
  fieldDescriptionWithArticle: string,
  mandatory: boolean,
  maxSize?: number,
): Validator<OptionalFieldValue<string>> {
  return (value: OptionalFieldValue<string>) => {
    if (isNullish(value) || isEmpty(value)) {
      return mandatory
        ? `${fieldDescriptionWithArticle} darf nicht leer sein.`
        : undefined;
    }

    if (maxSize && value.trim().length > maxSize) {
      return `${fieldDescriptionWithArticle} darf nicht länger als ${maxSize} Zeichen sein.`;
    }

    return undefined;
  };
}
