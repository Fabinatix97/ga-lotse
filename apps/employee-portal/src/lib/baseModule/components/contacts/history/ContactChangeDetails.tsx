/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Contact } from "@eshg/lib-employee-portal";

import { HistoryChange } from "@/lib/baseModule/components/contacts/history/HistoryChange";
import { HistoryDetailsSheet } from "@/lib/baseModule/components/contacts/history/HistoryDetailsSheet";

export function ContactChangeDetails({ contact }: { contact: Contact }) {
  return (
    <HistoryDetailsSheet>
      {contact.type === "PersonContact" && (
        <>
          <HistoryChange label="Vorname" value={contact.firstName} />
          <HistoryChange label="Name" value={contact.name} />
          <HistoryChange label="Chat-ID" value={contact.externalChatUsername} />
        </>
      )}
      {contact.type === "InstitutionContact" && (
        <>
          <HistoryChange label="Name" value={contact.name} />
          <HistoryChange label="Objekttyp" value={contact.category} />
          <HistoryChange label="Objektart" value={contact.subCategory} />
        </>
      )}
      {contact.emailAddresses?.map((emailAddress, index) => (
        <HistoryChange
          key={`${emailAddress}-${index}`}
          label="E-Mail-Adresse"
          value={emailAddress}
        />
      ))}
      {contact.phoneNumbers?.map((phoneNumber, index) => (
        <HistoryChange
          key={`${phoneNumber}-${index}`}
          label="Telefonnummer"
          value={phoneNumber}
        />
      ))}
    </HistoryDetailsSheet>
  );
}
