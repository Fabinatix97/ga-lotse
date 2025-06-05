/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useState } from "react";

import { ApiPersonContact } from "@eshg/base-api";
import {
  SidebarWithFormRefProps,
  createEmptyAddress,
  useResetAlertContextOnChange,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";

import { ContactEntityForm } from "@/lib/baseModule/components/contacts/forms/ContactEntityForm";
import { PersonContactImportForm } from "@/lib/baseModule/components/contacts/forms/import/PersonContactImportForm";
import { MergePersonContactForm } from "@/lib/baseModule/components/contacts/forms/merge/MergePersonContactForm";
import { PersonContactSearchForm } from "@/lib/baseModule/components/contacts/forms/search/PersonContactSearchForm";
import {
  AddContactSidebarState,
  PersonContactFormValues,
} from "@/lib/baseModule/components/contacts/types";

type AddPersonContactSidebarState = AddContactSidebarState<
  PersonContactFormValues,
  ApiPersonContact
>;

type CreateContactSidebarProps = AddPersonContactSidebarState &
  SidebarWithFormRefProps;

const initialCreateContactFormValues = {
  type: "AddPersonContactRequest",
  title: "",
  gender: "",
  salutation: "",
  name: "",
  nameAtBirth: "",
  firstName: "",
  externalChatUsername: "",
  emailAddresses: [""],
  phoneNumbers: [""],
  contactAddress: createEmptyAddress(),
  differentBillingAddress: undefined,
} as const satisfies PersonContactFormValues;

export function useAddPersonContactSidebar() {
  return useSidebarWithFormRef({
    component: AddPersonContactSidebar,
  });
}

function AddPersonContactSidebar({
  onClose,
  formRef,
  ...initialState
}: CreateContactSidebarProps) {
  const [formState, setFormState] =
    useState<AddPersonContactSidebarState>(initialState);

  useResetAlertContextOnChange(formState.flowStep);

  return (
    <>
      {formState.flowStep === "IMPORT" && (
        <PersonContactImportForm
          sidebarFormRef={formRef}
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
          onClose={() => onClose(false)}
        />
      )}
      {formState.flowStep === "CREATE" && (
        <ContactEntityForm
          type="PERSON"
          initialValues={formState.initialValues}
          sidebarFormRef={formRef}
          onClose={() => onClose(false)}
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
          intoLabel="Aktuell"
          fromLabel="Importiert"
          sidebarFormRef={formRef}
          onCancel={() => onClose(false)}
          onSuccess={() => onClose(true)}
        />
      )}
    </>
  );
}
