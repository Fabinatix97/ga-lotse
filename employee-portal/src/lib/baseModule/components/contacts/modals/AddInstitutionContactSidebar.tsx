/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useState } from "react";

import { ApiInstitutionContact } from "@eshg/base-api";
import {
  SidebarWithFormRefProps,
  createEmptyAddress,
  useResetAlertContextOnChange,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";

import { ContactEntityForm } from "@/lib/baseModule/components/contacts/forms/ContactEntityForm";
import { InstitutionContactImportForm } from "@/lib/baseModule/components/contacts/forms/import/InstitutionContactImportForm";
import { MergeInstitutionContactForm } from "@/lib/baseModule/components/contacts/forms/merge/MergeInstitutionContactForm";
import { InstitutionContactSearchForm } from "@/lib/baseModule/components/contacts/forms/search/InstitutionContactSearchForm";
import {
  AddContactSidebarState,
  InstitutionContactFormValues,
} from "@/lib/baseModule/components/contacts/types";

type AddInstitutionContactSidebarState = AddContactSidebarState<
  InstitutionContactFormValues,
  ApiInstitutionContact
>;

type CreateContactSidebarProps = SidebarWithFormRefProps &
  AddInstitutionContactSidebarState;

const initialCreateContactFormValues = {
  type: "AddInstitutionContactRequest",
  name: "",
  category: "",
  emailAddresses: [""],
  phoneNumbers: [""],
  contactAddress: createEmptyAddress(),
  differentBillingAddress: undefined,
} as const satisfies InstitutionContactFormValues;

export function useAddInstitutionContactSidebar() {
  return useSidebarWithFormRef({
    component: AddInstitutionContactSidebar,
  });
}

function AddInstitutionContactSidebar({
  onClose,
  formRef,
  ...initialState
}: CreateContactSidebarProps) {
  const [formState, setFormState] =
    useState<AddInstitutionContactSidebarState>(initialState);

  useResetAlertContextOnChange(formState.flowStep);

  return (
    <>
      {formState.flowStep === "IMPORT" && (
        <InstitutionContactImportForm
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
          type="INSTITUTION"
          initialValues={formState.initialValues}
          sidebarFormRef={formRef}
          onClose={() => onClose(false)}
        />
      )}
      {formState.flowStep === "SEARCH" && (
        <InstitutionContactSearchForm
          onCreate={(name, street) =>
            setFormState({
              flowStep: "CREATE",
              initialValues: {
                ...initialCreateContactFormValues,
                name,
                contactAddress: {
                  ...createEmptyAddress(),
                  street,
                },
              },
            })
          }
        />
      )}
      {formState.flowStep === "MERGE" && (
        <MergeInstitutionContactForm
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
