/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

const minimalPasswordLength = 12;
const upperCaseLetterRequired = true;
const lowerCaseLetterRequired = true;
const digitRequired = true;
const symbolRequired = true;

export function validatePassword(password: string) {
  if (
    validatePasswordLength(password) &&
    validatePasswordUpperCase(password) &&
    validatePasswordLowerCase(password) &&
    validatePasswordDigit(password) &&
    validatePasswordSymbol(password)
  ) {
    return undefined;
  }

  return "Das Passwort entspricht nicht den Anforderungen";
}

export function getPasswordInfo(password: string): {
  message: string;
  valid: boolean;
}[] {
  const result = [
    {
      message: `Minimalpasswortlänge: ${minimalPasswordLength} Zeichen`,
      valid: validatePasswordLength(password),
    },
  ];
  if (upperCaseLetterRequired) {
    result.push({
      message: "Passwort muss mindestens einen Großbuchstaben enthalten",
      valid: validatePasswordUpperCase(password),
    });
  }
  if (lowerCaseLetterRequired) {
    result.push({
      message: "Passwort muss mindestens einen Kleinbuchstaben enthalten",
      valid: validatePasswordLowerCase(password),
    });
  }
  if (digitRequired) {
    result.push({
      message: "Passwort muss mindestens eine Ziffer enthalten",
      valid: validatePasswordDigit(password),
    });
  }
  if (symbolRequired) {
    result.push({
      message: "Passwort muss mindestens ein Symbol enthalten",
      valid: validatePasswordSymbol(password),
    });
  }
  return result;
}

function validatePasswordLength(password: string): boolean {
  return password.length >= minimalPasswordLength;
}

function validatePasswordUpperCase(password: string): boolean {
  return !upperCaseLetterRequired || password.toLowerCase() !== password;
}

function validatePasswordLowerCase(password: string): boolean {
  return !lowerCaseLetterRequired || password.toUpperCase() !== password;
}

function validatePasswordDigit(password: string): boolean {
  return !digitRequired || /\d/.test(password);
}

function validatePasswordSymbol(password: string): boolean {
  return !symbolRequired || /[^\p{L}\p{N}\s]/u.test(password);
}
