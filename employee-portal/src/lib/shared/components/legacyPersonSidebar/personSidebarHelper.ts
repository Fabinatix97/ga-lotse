/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ApiDomesticAddress,
  ApiGetReferencePersonResponse,
} from "@eshg/base-api";
import { ApiPatient } from "@eshg/employee-portal-api/travelMedicine";
import { toDateString } from "@eshg/lib-portal/helpers/dateTime";
import { dropBlankStrings } from "@eshg/lib-portal/helpers/form";

import {
  LegacyBaseAddress,
  createEmptyLegacyAddress,
} from "@/lib/shared/components/form/address/LegacyAddressForm";
import { ApiFacilityAddressType } from "@/lib/shared/components/form/address/legacyTypes";
import { LegacyMinimalPerson } from "@/lib/shared/components/legacyPersonSidebar/form/LegacyBasePersonForm";
import {
  LegacyPerson,
  PERSON_VALUES,
} from "@/lib/shared/components/legacyPersonSidebar/form/LegacyPersonForm";

export function createNewPerson(searchArgs: LegacyMinimalPerson): LegacyPerson {
  return {
    ...PERSON_VALUES,
    firstName: searchArgs.firstName,
    lastName: searchArgs.lastName,
    dateOfBirth: searchArgs.dateOfBirth,
  };
}

export function mapToBaseAddress(
  domesticAddress: ApiDomesticAddress,
): LegacyBaseAddress {
  return {
    type: ApiFacilityAddressType.Postal,
    country: domesticAddress.country,
    street: domesticAddress.street,
    houseNumber: domesticAddress.houseNumber ?? "",
    addressAddition: domesticAddress.addressAddition,
    postalCode: domesticAddress.postalCode,
    city: domesticAddress.city,
  };
}

export function mapToBasePersonData(
  person: ApiGetReferencePersonResponse | LegacyPerson | ApiPatient,
) {
  return {
    salutation: person.salutation,
    title: person?.title,
    firstName: person.firstName,
    lastName: person.lastName,
    gender: person.gender,
    placeOfBirth: person.placeOfBirth !== "" ? person.placeOfBirth : undefined,
    countryOfBirth: person.countryOfBirth ?? "",
    nameAtBirth: person.nameAtBirth !== "" ? person.nameAtBirth : undefined,
    phoneNumbers: person.phoneNumbers
      ? dropBlankStrings(person?.phoneNumbers)
      : [""],
    emailAddresses: person.emailAddresses
      ? dropBlankStrings(person.emailAddresses)
      : [""],
  };
}

export function mapApiPersonData(
  searchResult: ApiGetReferencePersonResponse,
): LegacyPerson {
  return {
    ...mapToBasePersonData(searchResult),
    dateOfBirth: toDateString(searchResult.dateOfBirth),
    postalAddress:
      searchResult.contactAddress?.type === "DomesticAddress"
        ? mapToBaseAddress(searchResult.contactAddress as ApiDomesticAddress)
        : createEmptyLegacyAddress(ApiFacilityAddressType.Postal),
    referenceId: searchResult.id,
  };
}

export enum Mode {
  // search for person in central file
  searchInCentralFile,
  // create new person or add additional information to person
  editInCentralFile,
  // list all (possible duplicated) procedures for person
  listProceduresForPerson,
}
