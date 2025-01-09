/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiContactDetails,
  ApiContactType,
  ApiCreateInboxProcedureRequest,
  ApiCreateInboxProgressEntry,
  ApiInboxProcedureAddress,
  ApiInboxProgressEntryType,
  ApiTitle,
} from "@eshg/employee-portal-api/businessProcedures";
import { AcademicTitle } from "@eshg/lib-portal/components/formFields/constants";
import { toUtcDate } from "@eshg/lib-portal/helpers/dateTime";
import { mapOptionalValue } from "@eshg/lib-portal/helpers/form";
import { isEmpty } from "remeda";

import { AddressValues } from "@/lib/baseModule/components/inboxProcedures/AddressForm";
import { ContactValues } from "@/lib/baseModule/components/inboxProcedures/ContactForm";
import {
  InboxProgressEntryValues,
  PROGRESS_ENTRY_TYPES_WITH_FILE_UPLOAD,
  PROGRESS_ENTRY_TYPES_WITH_SUBJECT_AND_MESSAGE,
} from "@/lib/baseModule/components/inboxProcedures/InboxProgressEntryForm";

import { CreateInboxProcedureValues } from "./CreateInboxProcedureForm";

export function mapValuesToFileData(
  values: CreateInboxProcedureValues,
): FormData {
  const formData = new FormData();
  const progressEntry = values.inboxProgressEntry;
  const file = progressEntry.file;
  const type = progressEntry.type;
  if (PROGRESS_ENTRY_TYPES_WITH_FILE_UPLOAD.includes(type) && file !== null) {
    formData.append("file", file);
  }
  return formData;
}

export function mapValuesToFile(
  values: CreateInboxProcedureValues,
): File | undefined {
  const { file, type } = values.inboxProgressEntry;
  return PROGRESS_ENTRY_TYPES_WITH_FILE_UPLOAD.includes(type) && file !== null
    ? file
    : undefined;
}

export function mapFormValuesToCreateInboxProcedureRequest(
  values: CreateInboxProcedureValues,
): ApiCreateInboxProcedureRequest {
  return {
    inboxProcedureType: mapOptionalValue(values.procedureType),
    inboxProgressEntry: mapInboxProgressEntry(values.inboxProgressEntry),
    contactDetails: mapContact(values.contact),
  };
}

export function mapInboxProgressEntry(
  values: InboxProgressEntryValues,
): ApiCreateInboxProgressEntry {
  return {
    inboxProgressEntryType: values.type as ApiInboxProgressEntryType,
    subject: PROGRESS_ENTRY_TYPES_WITH_SUBJECT_AND_MESSAGE.includes(values.type)
      ? mapOptionalValue(values.subject)
      : undefined,
    messageText: PROGRESS_ENTRY_TYPES_WITH_SUBJECT_AND_MESSAGE.includes(
      values.type,
    )
      ? mapOptionalValue(values.messageText)
      : undefined,
  };
}

export function mapContact(values: ContactValues): ApiContactDetails {
  return {
    salutation: values.salutation,
    firstName: mapOptionalValue(values.firstName),
    lastName: mapOptionalValue(values.lastName),
    title:
      values.title !== AcademicTitle.NotSpecified
        ? (values.title as ApiTitle)
        : undefined,
    dateOfBirth:
      values.dateOfBirth !== "" ? toUtcDate(values.dateOfBirth) : undefined,
    emailAddress: mapOptionalValue(values.address.emailAddress),
    phoneNumber: mapOptionalValue(values.address.phoneNumber),
    facilityName:
      values.type === ApiContactType.Facility
        ? mapOptionalValue(values.facilityName)
        : undefined,
    address: mapAddress(values.address),
    contactType: values.type as ApiContactType,
  };
}

function mapAddress(
  values: AddressValues,
): ApiInboxProcedureAddress | undefined {
  return addressValuesAreEmpty(values)
    ? undefined
    : {
        houseNumber: mapOptionalValue(values.houseNumber),
        city: mapOptionalValue(values.city),
        postalCode: mapOptionalValue(values.postalCode),
        country: mapOptionalValue(values.country),
        addressAddition: mapOptionalValue(values.addressAddition),
        street: mapOptionalValue(values.street),
        postboxNumber: castToNumberOrUndefined(values.postbox),
      };
}

function addressValuesAreEmpty(values: AddressValues) {
  return (
    isEmpty(values.houseNumber) &&
    isEmpty(values.city) &&
    isEmpty(values.postalCode) &&
    isEmpty(values.country) &&
    isEmpty(values.addressAddition) &&
    isEmpty(values.street) &&
    isEmpty(values.postbox)
  );
}

function castToNumberOrUndefined(value: string) {
  if (value === "") return undefined;
  return Number(value);
}
