/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

const minimalPassphraseLength = 6;

export function validatePassphrase(
  passphrase: string,
  repeatedPassphrase: string,
): boolean {
  return (
    validatePassphraseLength(passphrase) &&
    validatePassphraseUpperCase(passphrase) &&
    validatePassphraseLowerCase(passphrase) &&
    validateSameRepeatedPassphrase(passphrase, repeatedPassphrase)
  );
}

export interface PassphraseValidityInfo {
  message: string;
  valid: boolean;
}

export function getPassphraseValidityInfo(
  passphrase: string,
  repeatedPassphrase: string,
): PassphraseValidityInfo[] {
  const isPasswortLengthValid = validatePassphraseLength(passphrase);
  const hasPassphraseUpperCaseLetter = validatePassphraseUpperCase(passphrase);
  const hasPassphraseLowerCaseLetter = validatePassphraseLowerCase(passphrase);
  const isSameRepeatedPassphrase = validateSameRepeatedPassphrase(
    passphrase,
    repeatedPassphrase,
  );

  const result = [
    {
      message: `Mindestens ${minimalPassphraseLength} Zeichen lang`,
      valid: isPasswortLengthValid,
    },
  ];
  result.push({
    message: "Mindestens ein Großbuchstabe",
    valid: hasPassphraseUpperCaseLetter,
  });
  result.push({
    message: "Mindestens ein Kleinbuchstabe",
    valid: hasPassphraseLowerCaseLetter,
  });
  result.push({
    message: "Muss mit der Wiederholung übereinstimmen",
    valid: isSameRepeatedPassphrase,
  });
  return result;
}

function validatePassphraseLength(passphrase: string): boolean {
  return passphrase.length >= minimalPassphraseLength;
}

function validatePassphraseUpperCase(passphrase: string): boolean {
  return passphrase.toLowerCase() !== passphrase;
}

function validatePassphraseLowerCase(passphrase: string): boolean {
  return passphrase.toUpperCase() !== passphrase;
}

function validateSameRepeatedPassphrase(
  passphrase: string,
  repeatedPassphrase: string,
): boolean {
  return passphrase === repeatedPassphrase && passphrase.length !== 0;
}
