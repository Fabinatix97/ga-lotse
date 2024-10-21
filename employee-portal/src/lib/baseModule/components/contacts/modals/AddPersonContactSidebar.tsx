/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiPersonContact } from "@eshg/employee-portal-api/base";
import { Ref, useState } from "react";

import { ContactEntityForm } from "@/lib/baseModule/components/contacts/forms/ContactEntityForm";
import { PersonContactImportForm } from "@/lib/baseModule/components/contacts/forms/import/PersonContactImportForm";
import { MergePersonContactForm } from "@/lib/baseModule/components/contacts/forms/merge/MergePersonContactForm";
import { PersonContactSearchForm } from "@/lib/baseModule/components/contacts/forms/search/PersonContactSearchForm";
import {
  AddContactSidebarState,
  PersonContactFormValues,
} from "@/lib/baseModule/components/contacts/types";
import { SidebarFormHandle } from "@/lib/shared/components/form/SidebarForm";
import { createEmptyAddress } from "@/lib/shared/components/form/address/helpers";

type AddPersonContactSidebarState = AddContactSidebarState<
  PersonContactFormValues,
  ApiPersonContact
>;

type CreateContactSidebarProps = AddPersonContactSidebarState & {
  onClose: () => void;
  onSuccess: () => void;
  sidebarFormRef: Ref<SidebarFormHandle>;
};

const initialCreateContactFormValues = {
  type: "AddPersonContactRequest",
  title: "",
  gender: "",
  salutation: "",
  name: "",
  firstName: "",
  externalChatUsername: "",
  emailAddresses: [""],
  phoneNumbers: [""],
  contactAddress: createEmptyAddress(),
  differentBillingAddress: undefined,
} as const satisfies PersonContactFormValues;

export function AddPersonContactSidebar({
  onClose,
  onSuccess,
  sidebarFormRef,
  ...initialState
}: CreateContactSidebarProps) {
  const [formState, setFormState] =
    useState<AddPersonContactSidebarState>(initialState);

  return (
    <>
      {formState.flowStep === "IMPORT" && (
        <PersonContactImportForm
          onImported={(values) =>
            setFormState({
              initialValues: values,
              flowStep: "CREATE",
            })
          }
          onMerge={(into, from) =>
            setFormState({
              flowStep: "MERGE",
              from: { type: "Import", data: from },
              into: into,
            })
          }
          onClose={onClose}
          sidebarFormRef={sidebarFormRef}
        />
      )}
      {formState.flowStep === "CREATE" && (
        <ContactEntityForm
          type={"PERSON"}
          initialValues={formState.initialValues}
          onClose={onClose}
          sidebarFormRef={sidebarFormRef}
        />
      )}
      {formState.flowStep === "SEARCH" && (
        <PersonContactSearchForm
          onCreate={(firstName, lastName) =>
            setFormState({
              flowStep: "CREATE",
              initialValues: {
                ...initialCreateContactFormValues,
                name: lastName,
                firstName,
              },
            })
          }
        />
      )}
      {formState.flowStep === "MERGE" && (
        <MergePersonContactForm
          into={formState.into}
          from={formState.from}
          intoLabel={"Aktuell"}
          fromLabel={"Importiert"}
          onCancel={onClose}
          onSuccess={onSuccess}
          sidebarFormRef={sidebarFormRef}
        />
      )}
    </>
  );
}
