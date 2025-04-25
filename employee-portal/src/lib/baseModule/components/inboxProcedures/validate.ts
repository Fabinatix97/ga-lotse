/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FormikErrors } from "formik";
import { isEmpty } from "remeda";

import {
  isEmptyString,
  isNonEmptyString,
} from "@eshg/lib-portal/helpers/guards";

import { AddressValues } from "./AddressForm";
import { ContactValues } from "./ContactForm";
import { CreateInboxProcedureValues } from "./CreateInboxProcedureForm";

const NO_CONTACT_OPTION_ERROR_MESSAGE =
  "Bitte Emailadresse, Telefonnummer, Adresse oder Postfach angeben.";

export function validatePostboxNumber(value: string) {
  return /^[0-9]*$/.test(value)
    ? undefined
    : "Für die Postfachnummer bitte nur Ziffern verwenden.";
}

export function validateForm(values: CreateInboxProcedureValues) {
  const errors: FormikErrors<CreateInboxProcedureValues> = {};
  const contact = values.contact;
  return validateContact(contact, errors);
}

function validateContact(
  contact: ContactValues,
  errors: FormikErrors<CreateInboxProcedureValues>,
) {
  if (noContactOptionIsSet(contact)) {
    errors.contact = {
      address: {
        country: NO_CONTACT_OPTION_ERROR_MESSAGE,
        city: NO_CONTACT_OPTION_ERROR_MESSAGE,
        street: NO_CONTACT_OPTION_ERROR_MESSAGE,
        emailAddress: NO_CONTACT_OPTION_ERROR_MESSAGE,
        phoneNumber: NO_CONTACT_OPTION_ERROR_MESSAGE,
        postbox: NO_CONTACT_OPTION_ERROR_MESSAGE,
      },
    };
    return errors;
  }
  if (incompleteAddressIsOnlyContactOption(contact)) {
    errors.contact = {
      address: {
        city: !contact.address.city
          ? buildIncompleteAddressErrorMessage("Stadt")
          : undefined,
        country: !contact.address.country
          ? buildIncompleteAddressErrorMessage("Land")
          : undefined,
        street: !contact.address.street
          ? buildIncompleteAddressErrorMessage("Straße")
          : undefined,
      },
    };
  }
  return errors;
}

function noContactOptionIsSet(contact: ContactValues) {
  return (
    isEmpty(contact.address.emailAddress) &&
    isEmpty(contact.address.phoneNumber) &&
    isEmpty(contact.address.postbox) &&
    addressIsEmpty(contact.address)
  );
}

function incompleteAddressIsOnlyContactOption(contact: ContactValues) {
  return (
    isEmpty(contact.address.emailAddress) &&
    isEmpty(contact.address.phoneNumber) &&
    isEmpty(contact.address.postbox) &&
    !addressIsComplete(contact.address)
  );
}

function buildIncompleteAddressErrorMessage(fieldLabel: string) {
  return `Adresse ist unvollständig. Bitte ${fieldLabel} angeben.`;
}

function addressIsEmpty(addressValues: AddressValues) {
  return (
    isEmptyString(addressValues.street) &&
    isEmptyString(addressValues.country) &&
    isEmptyString(addressValues.city)
  );
}

function addressIsComplete(addressValues: AddressValues) {
  return (
    isNonEmptyString(addressValues.street) &&
    isNonEmptyString(addressValues.country) &&
    isNonEmptyString(addressValues.city)
  );
}
