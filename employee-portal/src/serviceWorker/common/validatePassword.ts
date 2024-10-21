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
      message: `Mindestens ${minimalPasswordLength} Zeichen lang`,
      valid: validatePasswordLength(password),
    },
  ];
  if (upperCaseLetterRequired) {
    result.push({
      message: "Mindestens ein Großbuchstabe",
      valid: validatePasswordUpperCase(password),
    });
  }
  if (lowerCaseLetterRequired) {
    result.push({
      message: "Mindestens ein Kleinbuchstabe",
      valid: validatePasswordLowerCase(password),
    });
  }
  if (digitRequired) {
    result.push({
      message: "Mindestens eine Zahl",
      valid: validatePasswordDigit(password),
    });
  }
  if (symbolRequired) {
    result.push({
      message: "Mindestens ein Sonderzeichen (z.B. !,@,#,$)",
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
