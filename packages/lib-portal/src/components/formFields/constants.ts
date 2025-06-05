/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { isDefined } from "remeda";

import { ApiGender, ApiPersonFileState, ApiSalutation } from "@eshg/base-api";

import { buildEnumOptions } from "../../helpers/form";

import { SelectOption } from "./SelectOptions";

export const SALUTATION_VALUES = {
  [ApiSalutation.NotSpecified]: "Keine Angabe",
  [ApiSalutation.Neutral]: "Neutral",
  [ApiSalutation.Male]: "Herr",
  [ApiSalutation.Female]: "Frau",
};

export const SALUTATION_OPTIONS =
  buildEnumOptions<ApiSalutation>(SALUTATION_VALUES);

export const AcademicTitle = {
  NotSpecified: "NOT_SPECIFIED",
  Dr: "DR",
  Prof: "PROF",
  ProfDr: "PROF_DR",
} as const;
export type AcademicTitle = (typeof AcademicTitle)[keyof typeof AcademicTitle];

export const TITLE_VALUES: Record<string, string> = {
  [AcademicTitle.NotSpecified]: "Keine Angabe",
  [AcademicTitle.Dr]: "Dr.",
  [AcademicTitle.Prof]: "Prof.",
  [AcademicTitle.ProfDr]: "Prof. Dr.",
};

export const TITLE_OPTIONS: SelectOption<string, string>[] = Object.values(
  TITLE_VALUES,
).map((value) => ({ label: value, value }));

function getRequiredTitle(value: string): string {
  return TITLE_VALUES[value] ?? value;
}

export function getOptionalTitle(
  value: string | undefined,
): string | undefined {
  return isDefined(value) && value.trim() !== ""
    ? getRequiredTitle(value)
    : undefined;
}

export const GENDER_VALUES = {
  [ApiGender.NotSpecified]: "Keine Angabe",
  [ApiGender.Male]: "Männlich",
  [ApiGender.Female]: "Weiblich",
  [ApiGender.Diverse]: "Divers",
};

export const GENDER_OPTIONS = buildEnumOptions<ApiGender>(GENDER_VALUES);

export const PERSON_FIELD_NAME = {
  salutation: "Anrede",
  title: "Titel",
  firstName: "Vorname",
  lastName: "Nachname",
  dateOfBirth: "Geburtsdatum",
  gender: "Geschlecht",
  nameAtBirth: "Geburtsname",
  placeOfBirth: "Geburtsort",
  countryOfBirth: "Geburtsland",
  dataOrigin: "Datenherkunft",
  contactAddress: "Kontaktadresse",
  differentBillingAddress: "Abweichende Rechnungsadresse",
  emailAddresses: "E-Mail-Adresse",
  phoneNumbers: "Telefonnummer",
  id: "ID",
  referenceVersion: "Version",
  humanReadableId: "Personen-ID",
} as const satisfies Record<keyof ApiPersonFileState, string>;
