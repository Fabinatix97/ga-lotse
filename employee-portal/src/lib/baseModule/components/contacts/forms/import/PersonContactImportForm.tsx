/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Ref, useState } from "react";
import { isDefined } from "remeda";

import {
  ApiImportPersonContactResponse,
  ApiPersonContact,
  ApiVCardPersonContact,
} from "@eshg/base-api";
import { SidebarFormHandle } from "@eshg/lib-employee-portal";

import { useImportPersonContactMutation } from "@/lib/baseModule/api/mutations/contacts";
import { PersonContactCard } from "@/lib/baseModule/components/contacts/forms/card/PersonContactCard";
import { mapVCardAddressToForm } from "@/lib/baseModule/components/contacts/forms/helpers";
import { ImportResultForm } from "@/lib/baseModule/components/contacts/forms/import/ImportResultForm";
import { UploadVCardForm } from "@/lib/baseModule/components/contacts/forms/import/UploadVCardForm";
import { PersonContactFormValues } from "@/lib/baseModule/components/contacts/types";

interface ContactImportFormProps {
  onClose: () => void;
  onImported: (values: PersonContactFormValues) => void;
  onMerge: (into: ApiPersonContact, from: PersonContactFormValues) => void;
  sidebarFormRef: Ref<SidebarFormHandle>;
}

function mapImportToCreate(
  vcard: ApiVCardPersonContact,
): PersonContactFormValues {
  const address = vcard.addresses.length > 0 ? vcard.addresses[0] : undefined;
  return {
    type: "AddPersonContactRequest",
    name: vcard.lastName,
    firstName: vcard.firstName,
    gender: vcard.gender,
    title: "",
    salutation: "",
    externalChatUsername: "",
    phoneNumbers: vcard.phoneNumbers,
    emailAddresses: vcard.emailAddresses,
    contactAddress: mapVCardAddressToForm(address),
    differentBillingAddress: undefined,
    nameAtBirth: "",
  } as const;
}

export function PersonContactImportForm(props: ContactImportFormProps) {
  const importPersonContact = useImportPersonContactMutation();

  const [searchResults, setSearchResults] =
    useState<ApiImportPersonContactResponse>();

  async function handleSubmit(file: File) {
    await importPersonContact.mutateAsync(file, {
      onSuccess: (response) => {
        setSearchResults(response);
        if (response.totalNumberOfMatches === 0) {
          props.onImported(mapImportToCreate(response.vCard));
        }
      },
    });
  }

  return (
    <>
      {isDefined(searchResults) ? (
        <ImportResultForm<ApiPersonContact>
          label={"Person"}
          formRef={props.sidebarFormRef}
          searchResults={searchResults}
          cardComponent={PersonContactCard}
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
      ) : (
        <UploadVCardForm
          sidebarFormRef={props.sidebarFormRef}
          onSubmit={async (file) => {
            await handleSubmit(file);
          }}
          onClose={props.onClose}
        />
      )}
    </>
  );
}
