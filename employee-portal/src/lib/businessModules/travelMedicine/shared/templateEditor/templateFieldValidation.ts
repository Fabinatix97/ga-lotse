/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

export function notEmptyFieldValidation(
  text: string,
  errorText = "Das Fragefeld darf nicht leer sein",
) {
  if (!text) {
    return errorText;
  }
}

export function validateTemplateTitle(title: string) {
  return notEmptyFieldValidation(
    title,
    "Der Anamnesetitel darf nicht leer sein",
  );
}

export function validateSelectField(title: string) {
  return notEmptyFieldValidation(title, "Das Antwortfeld darf nicht leer sein");
}
