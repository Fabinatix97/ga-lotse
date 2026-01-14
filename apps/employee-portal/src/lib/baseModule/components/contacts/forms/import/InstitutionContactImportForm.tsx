/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Ref, useState } from "react";

import {
  ApiImportInstitutionContactResponse,
  ApiInstitutionContact,
  ApiVCardInstitutionContact,
} from "@eshg/base-api";
import { SidebarFormHandle } from "@eshg/lib-employee-portal";

import { useImportInstitutionContactMutation } from "@/lib/baseModule/api/mutations/contacts";
import { InstitutionContactCard } from "@/lib/baseModule/components/contacts/forms/card/InstitutionContactCard";
import { mapVCardAddressToForm } from "@/lib/baseModule/components/contacts/forms/helpers";
import { ImportResultForm } from "@/lib/baseModule/components/contacts/forms/import/ImportResultForm";
import { UploadVCardForm } from "@/lib/baseModule/components/contacts/forms/import/UploadVCardForm";
import { InstitutionContactFormValues } from "@/lib/baseModule/components/contacts/types";

interface ContactImportFormProps {
  onClose: () => void;
  onImported: (values: InstitutionContactFormValues) => void;
  onMerge: (
    into: ApiInstitutionContact,
    from: InstitutionContactFormValues,
  ) => void;
  sidebarFormRef: Ref<SidebarFormHandle>;
}

function mapImportToCreate(
  vcard: ApiVCardInstitutionContact,
): InstitutionContactFormValues {
  const address = vcard.addresses.length > 0 ? vcard.addresses[0] : undefined;
  return {
    type: "AddInstitutionContactRequest",
    name: vcard.fullName,
    category: "",
    subCategory: "",
    phoneNumbers: vcard.phoneNumbers,
    emailAddresses: vcard.emailAddresses,
    contactAddress: mapVCardAddressToForm(address),
    differentBillingAddress: undefined,
  } as const;
}

export function InstitutionContactImportForm(props: ContactImportFormProps) {
  const importInstitutionContact = useImportInstitutionContactMutation();

  const [searchResults, setSearchResults] =
    useState<ApiImportInstitutionContactResponse>();

  async function handleSubmit(file: File) {
    await importInstitutionContact.mutateAsync(file, {
      onSuccess: (response) => {
        setSearchResults(response);
        if (response.totalNumberOfMatches === 0) {
          props.onImported(mapImportToCreate(response.vCard));
        }
      },
    });
  }

  if (searchResults === undefined) {
    return (
      <UploadVCardForm
        sidebarFormRef={props.sidebarFormRef}
        onSubmit={async (file) => {
          await handleSubmit(file);
        }}
        onClose={props.onClose}
      />
    );
  }

  return (
    <ImportResultForm<ApiInstitutionContact>
      label="Institution"
      formRef={props.sidebarFormRef}
      searchResults={searchResults}
      cardComponent={InstitutionContactCard}
      onSubmit={(selected) => {
        const vcard = searchResults.vCard;
        if (selected === "new") {
          props.onImported(mapImportToCreate(vcard));
        } else {
          const contact = searchResults.matches.find(
            (contact) => contact.id === selected,
          )!;
          props.onMerge(contact, mapImportToCreate(vcard));
        }
      }}
    />
  );
}
