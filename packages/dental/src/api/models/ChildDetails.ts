/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiChildDetails,
  ApiCountryCode,
  ApiFluoridationConsent,
  ApiSalutation,
} from "@eshg/dental-api";
import {
  BaseAddress,
  DefaultPersonFormValues,
  Versioned,
  mapApiAddressToForm,
  mapOptional,
  mapVersioned,
  normalizeListInputs,
} from "@eshg/lib-employee-portal";
import { toDateString } from "@eshg/lib-portal/helpers/dateTime";
import { parseOptionalValue } from "@eshg/lib-portal/helpers/form";

import { Child, mapChild } from "./Child";
import { Examination, mapExamination } from "./Examination";
import {
  AnnualInstitution,
  Institution,
  mapAnnualInstitutionDetails,
} from "./Institution";

export interface ChildDetails extends Child, Versioned {
  readonly examinations: Examination[];
  readonly institutions: AnnualInstitution[];
  readonly currentFluoridationConsent?: ApiFluoridationConsent;
  readonly allFluoridationConsents: ApiFluoridationConsent[];
  readonly personDetails: PersonDetails;
}

export interface PersonDetails {
  readonly fileStateId: string;
  readonly version: number;
  readonly outdated: boolean;
  readonly title?: string;
  readonly salutation: ApiSalutation;
  readonly nameAtBirth?: string;
  readonly placeOfBirth?: string;
  readonly countryOfBirth?: ApiCountryCode;
  readonly emailAddresses?: string[];
  readonly phoneNumbers?: string[];
  readonly contactAddress?: BaseAddress;
  readonly differentBillingAddress?: BaseAddress;
}

export function mapChildDetails(response: ApiChildDetails): ChildDetails {
  const institutions = response.institutions.map(mapAnnualInstitutionDetails);

  return {
    ...mapVersioned(response),
    ...mapChild({
      ...response,
      institution: getCurrentInstitution(institutions),
    }),
    personDetails: mapPersonDetails(response),
    institutions,
    examinations: response.examinations.map(mapExamination),
    currentFluoridationConsent: getCurrentFluoridationConsent(
      response.fluoridationConsents,
    ),
    allFluoridationConsents: response.fluoridationConsents,
  };
}

function getCurrentInstitution(institutions: AnnualInstitution[]): Institution {
  return institutions.reduce((max, current) =>
    max.year > current.year ? max : current,
  ).institution;
}

function getCurrentFluoridationConsent(
  fluoridationConsent: ApiFluoridationConsent[],
) {
  return fluoridationConsent[0];
}

export function mapPersonDetails(response: ApiChildDetails): PersonDetails {
  return {
    fileStateId: response.fileStateId,
    version: response.personVersion,
    outdated: response.fileStateOutdated,
    title: response.title,
    salutation: response.salutation,
    nameAtBirth: response.nameAtBirth,
    placeOfBirth: response.placeOfBirth,
    countryOfBirth: response.countryOfBirth,
    emailAddresses: response.emailAddresses,
    phoneNumbers: response.phoneNumbers,
    contactAddress: response.contactAddress,
    differentBillingAddress: response.differentBillingAddress,
  };
}

export function mapPersonDetailsToForm(
  child: ChildDetails,
): DefaultPersonFormValues {
  return {
    salutation: child.personDetails.salutation,
    title: parseOptionalValue(child.personDetails.title),
    firstName: child.firstName,
    lastName: child.lastName,
    dateOfBirth: toDateString(child.dateOfBirth),
    gender: child.gender,
    countryOfBirth: parseOptionalValue(child.personDetails.countryOfBirth),
    nameAtBirth: parseOptionalValue(child.personDetails.nameAtBirth),
    placeOfBirth: parseOptionalValue(child.personDetails.placeOfBirth),
    emailAddresses: normalizeListInputs(child.personDetails.emailAddresses),
    phoneNumbers: normalizeListInputs(child.personDetails.phoneNumbers),
    contactAddress: mapOptional(
      child.personDetails.contactAddress,
      mapApiAddressToForm,
    ),
    differentBillingAddress: mapOptional(
      child.personDetails.differentBillingAddress,
      mapApiAddressToForm,
    ),
  };
}
