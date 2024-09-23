/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiInstitutionContact,
  ApiPersonContact,
} from "@eshg/employee-portal-api/base";
import { isDefined } from "remeda";

import { contactDiscriminatorToEnum } from "@/lib/baseModule/components/contacts/constants";
import { ContactEntityForm } from "@/lib/baseModule/components/contacts/forms/ContactEntityForm";
import {
  Contact,
  InstitutionContactFormValues,
  PersonContactFormValues,
  isPersonContact,
} from "@/lib/baseModule/components/contacts/types";
import { OverlayBoundary } from "@/lib/shared/components/boundaries/OverlayBoundary";
import {
  createEmptyAddress,
  mapApiAddressToForm,
} from "@/lib/shared/components/form/address/helpers";
import { Sidebar } from "@/lib/shared/components/sidebar/Sidebar";
import { useSidebarForm } from "@/lib/shared/hooks/useSidebarForm";

interface UpdateContactSidebarProps {
  contact: Contact | undefined;
  open: boolean;
  onClose: () => void;
}

export function UpdateContactSidebar(props: UpdateContactSidebarProps) {
  return (
    <OverlayBoundary>
      <UpdateContactSidebarWithinBoundary {...props} />
    </OverlayBoundary>
  );
}

function UpdateContactSidebarWithinBoundary({
  contact,
  open,
  onClose,
}: UpdateContactSidebarProps) {
  const { sidebarFormRef, closeSidebar, handleClose } = useSidebarForm({
    onClose,
  });

  return (
    <Sidebar open={open} onClose={handleClose}>
      {open && isDefined(contact) && (
        <ContactEntityForm
          contactId={contact.id}
          initialValues={mapContactToForm(contact)}
          onClose={handleClose}
          onUpdated={closeSidebar}
          type={contactDiscriminatorToEnum[contact.type]}
          sidebarFormRef={sidebarFormRef}
        />
      )}
    </Sidebar>
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
