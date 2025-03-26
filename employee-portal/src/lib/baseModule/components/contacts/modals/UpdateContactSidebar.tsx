/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiInstitutionContact, ApiPersonContact } from "@eshg/base-api";
import {
  SidebarWithFormRefProps,
  createEmptyAddress,
  mapApiAddressToForm,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";
import { isDefined } from "remeda";

import { contactDiscriminatorToEnum } from "@/lib/baseModule/components/contacts/constants";
import { ContactEntityForm } from "@/lib/baseModule/components/contacts/forms/ContactEntityForm";
import {
  Contact,
  InstitutionContactFormValues,
  PersonContactFormValues,
  isPersonContact,
} from "@/lib/baseModule/components/contacts/types";

interface UpdateContactSidebarProps extends SidebarWithFormRefProps {
  contact: Contact;
}

export function useUpdateContactSidebar() {
  return useSidebarWithFormRef({
    component: UpdateContactSidebar,
  });
}

function UpdateContactSidebar({
  contact,
  onClose,
  formRef,
}: UpdateContactSidebarProps) {
  return (
    <ContactEntityForm
      contactId={contact.id}
      initialValues={mapContactToForm(contact)}
      onClose={() => onClose(false)}
      onUpdated={() => onClose(true)}
      type={contactDiscriminatorToEnum[contact.type]}
      sidebarFormRef={formRef}
    />
  );
}

function fallbackList(list: string[] | undefined) {
  return list === undefined || list.length < 1 ? [""] : list;
}

function mapPersonContactToForm(
  contact: ApiPersonContact,
): PersonContactFormValues {
  return {
    type: "AddPersonContactRequest",
    firstName: contact.firstName ?? "",
    name: contact.name,
    title: contact.title ?? "",
    salutation: contact.salutation ?? "",
    externalChatUsername: contact.externalChatUsername ?? "",
    gender: contact.gender ?? "",
    emailAddresses: fallbackList(contact.emailAddresses),
    phoneNumbers: fallbackList(contact.phoneNumbers),
    contactAddress: isDefined(contact.contactAddress)
      ? mapApiAddressToForm(contact.contactAddress)
      : undefined,
    differentBillingAddress: isDefined(contact.differentBillingAddress)
      ? mapApiAddressToForm(contact.differentBillingAddress)
      : undefined,
  };
}

function mapInstitutionContactToForm(
  contact: ApiInstitutionContact,
): InstitutionContactFormValues {
  return {
    type: "AddInstitutionContactRequest",
    name: contact.name,
    category: contact.category ?? "",
    emailAddresses: fallbackList(contact.emailAddresses),
    phoneNumbers: fallbackList(contact.phoneNumbers),
    contactAddress: isDefined(contact.contactAddress)
      ? mapApiAddressToForm(contact.contactAddress)
      : createEmptyAddress(),
    differentBillingAddress: isDefined(contact.differentBillingAddress)
      ? mapApiAddressToForm(contact.differentBillingAddress)
      : undefined,
  };
}

function mapContactToForm(contact: Contact) {
  return isPersonContact(contact)
    ? mapPersonContactToForm(contact)
    : mapInstitutionContactToForm(contact);
}
