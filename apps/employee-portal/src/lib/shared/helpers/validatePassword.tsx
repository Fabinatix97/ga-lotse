/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

const minimalPasswordLength = 12;

export function validatePassword(
  password: string,
  repeatedPassword: string,
): boolean {
  return (
    validatePasswordLength(password) &&
    validatePasswordUpperCase(password) &&
    validatePasswordLowerCase(password) &&
    validatePasswordDigit(password) &&
    validatePasswordSymbol(password) &&
    validateSameRepeatedPassword(password, repeatedPassword)
  );
}

export interface PasswordValidityInfo {
  message: string;
  valid: boolean;
}

export function getPasswordValidityInfo(
  password: string,
  repeatedPassword: string,
): PasswordValidityInfo[] {
  const isPasswortLengthValid = validatePasswordLength(password);
  const hasPasswordUpperCaseLetter = validatePasswordUpperCase(password);
  const hasPasswordLowerCaseLetter = validatePasswordLowerCase(password);
  const hasPasswordDigit = validatePasswordDigit(password);
  const hasPasswordSymbol = validatePasswordSymbol(password);
  const isSameRepeatedPassword = validateSameRepeatedPassword(
    password,
    repeatedPassword,
  );

  const result = [
    {
      message: `Mindestens ${minimalPasswordLength} Zeichen lang`,
      valid: isPasswortLengthValid,
    },
  ];
  result.push({
    message: "Mindestens ein Großbuchstabe",
    valid: hasPasswordUpperCaseLetter,
  });
  result.push({
    message: "Mindestens ein Kleinbuchstabe",
    valid: hasPasswordLowerCaseLetter,
  });
  result.push({
    message: "Mindestens eine Zahl",
    valid: hasPasswordDigit,
  });
  result.push({
    message: "Mindestens ein Sonderzeichen (z.B. !,@,#,$)",
    valid: hasPasswordSymbol,
  });
  result.push({
    message: "Muss mit der Wiederholung übereinstimmen",
    valid: isSameRepeatedPassword,
  });
  return result;
}

function validatePasswordLength(password: string): boolean {
  return password.length >= minimalPasswordLength;
}

function validatePasswordUpperCase(password: string): boolean {
  return password.toLowerCase() !== password;
}

function validatePasswordLowerCase(password: string): boolean {
  return password.toUpperCase() !== password;
}

function validatePasswordDigit(password: string): boolean {
  return /\d/.test(password);
}

function validatePasswordSymbol(password: string): boolean {
  return /[^\p{L}\p{N}\s]/u.test(password);
}

function validateSameRepeatedPassword(
  password: string,
  repeatedPassword: string,
): boolean {
  return password === repeatedPassword && password.length !== 0;
}
