/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiAffectedPersonDetails,
  ApiAffectedPersonSupplementalData,
  ApiDomesticAddress,
  ApiReportPerson,
} from "@eshg/citizen-portal-api/measlesProtection";

import { mapOptionalValue } from "@/lib/businessModules/measlesProtection/shared/helpers";

import {
  AffectedPersonFormInputs,
  CustodianFormInputs,
  FacilityContactPersonFormInputs,
} from "./types";

export function formatAddress(address: ApiDomesticAddress) {
  const { city, houseNumber, postalCode, street } = address;
  return `${street} ${houseNumber}, ${postalCode} ${city}`;
}

export function formatName({
  firstName = "",
  lastName = "",
}:
  | AffectedPersonFormInputs
  | CustodianFormInputs
  | FacilityContactPersonFormInputs) {
  return `${firstName} ${lastName}`;
}

export function mapAffectedPersonToApi(
  affectedPerson: AffectedPersonFormInputs,
): ApiReportPerson {
  const apiAffectedPersonDetails: ApiAffectedPersonDetails = {
    salutation: mapOptionalValue(affectedPerson.salutation),
    title: mapOptionalValue(affectedPerson.title),
    firstName: affectedPerson.firstName,
    lastName: affectedPerson.lastName,
    gender: mapOptionalValue(affectedPerson.gender),
    dateOfBirth: new Date(affectedPerson.dateOfBirth),
    nameAtBirth: mapOptionalValue(affectedPerson.nameAtBirth),
    placeOfBirth: mapOptionalValue(affectedPerson.placeOfBirth),
    countryOfBirth: mapOptionalValue(affectedPerson.countryOfBirth),
    emailAddresses: mapOptionalValue(affectedPerson.emailAddresses),
    phoneNumbers: mapOptionalValue(affectedPerson.phoneNumbers),
    address: {
      addressAddition: mapOptionalValue(
        affectedPerson.address.addressAddition?.trim(),
      ),
      city: affectedPerson.address.city,
      country: affectedPerson.address.country,
      houseNumber: affectedPerson.address.houseNumber,
      postalCode: affectedPerson.address.postalCode,
      street: affectedPerson.address.street,
      type: "DomesticAddress",
    },
    custodians: affectedPerson.custodians?.map((custodian) => ({
      salutation: mapOptionalValue(custodian.salutation),
      title: mapOptionalValue(custodian.title),
      firstName: custodian.firstName,
      lastName: custodian.lastName,
      gender: mapOptionalValue(custodian.gender),
      dateOfBirth: new Date(custodian.dateOfBirth),
      emailAddresses: mapOptionalValue(custodian.emailAddresses),
      phoneNumbers: mapOptionalValue(custodian.phoneNumbers),
      address: {
        addressAddition: mapOptionalValue(
          custodian.address.addressAddition?.trim(),
        ),
        city: custodian.address.city,
        country: custodian.address.country,
        houseNumber: custodian.address.houseNumber,
        postalCode: custodian.address.postalCode,
        street: custodian.address.street,
        type: "DomesticAddress",
      },
    })),
  };

  const apiAffectedPersonSupplementalData: ApiAffectedPersonSupplementalData = {
    roleStatus: mapOptionalValue(affectedPerson.roleStatus),
    reportData: {
      reportingDate: new Date(),
      reportingReason: affectedPerson.reportData.reportingReason || "OTHER",
      commentReportingReason: affectedPerson.reportData.reportingReason
        ? affectedPerson.reportData.commentReportingReason
        : undefined,
    },
  };

  return {
    affectedPersonDetails: apiAffectedPersonDetails,
    affectedPersonSupplementalData: apiAffectedPersonSupplementalData,
  };
}
