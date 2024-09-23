/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiInstitutionContact } from "@eshg/employee-portal-api/base";
import { InputArrayField } from "@eshg/lib-portal/components/formFields/InputArrayField";
import { createFieldNameMapper } from "@eshg/lib-portal/helpers/form";
import { Box, Divider, Stack } from "@mui/joy";
import { Formik } from "formik";
import { Ref } from "react";
import { isDefined } from "remeda";

import { mapImportMergeContactRequest } from "@/lib/baseModule/api/mapper/contacts";
import { useUpdateContactMutation } from "@/lib/baseModule/api/mutations/contacts";
import { AddressCardsField } from "@/lib/baseModule/components/contacts/forms/card/AddressCardsField";
import {
  distinctConcat,
  getAddressOptions,
  isValidAddress,
  mapMergeValue,
} from "@/lib/baseModule/components/contacts/forms/helpers";
import { MergeStringField } from "@/lib/baseModule/components/contacts/forms/merge/MergeStringField";
import {
  InstitutionContactMergeSource,
  MergeInstitutionContactFormValues,
} from "@/lib/baseModule/components/contacts/types";
import { contactCategoryNames } from "@/lib/baseModule/shared/translations";
import { MultiFormButtonBar } from "@/lib/shared/components/form/MultiFormButtonBar";
import {
  SidebarForm,
  SidebarFormHandle,
} from "@/lib/shared/components/form/SidebarForm";
import {
  createEmptyAddress,
  mapApiAddressToForm,
} from "@/lib/shared/components/form/address/helpers";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";

function initialValues(
  into: ApiInstitutionContact,
  from: InstitutionContactMergeSource,
): MergeInstitutionContactFormValues {
  return {
    type: "UpdateInstitutionContactRequest",
    name: mapMergeValue(into.name, from.data.name),
    category: into.category!,
    phoneNumbers: distinctConcat(into.phoneNumbers, from.data.phoneNumbers),
    emailAddresses: distinctConcat(
      into.emailAddresses,
      from.data.emailAddresses,
    ),
    contactAddress:
      isValidAddress(from.data.contactAddress) ||
      into.contactAddress === undefined
        ? createEmptyAddress()
        : mapApiAddressToForm(into.contactAddress),
    differentBillingAddress: isDefined(into.differentBillingAddress)
      ? mapApiAddressToForm(into.differentBillingAddress)
      : undefined,
  };
}

interface MergeInstitutionContactFormProps {
  into: ApiInstitutionContact;
  from: InstitutionContactMergeSource;
  sidebarFormRef: Ref<SidebarFormHandle>;
  onCancel: () => void;
  onSuccess: () => void;
}

export function MergeInstitutionContactForm({
  into,
  from,
  sidebarFormRef,
  onCancel,
  onSuccess,
}: MergeInstitutionContactFormProps) {
  const fieldName = createFieldNameMapper<MergeInstitutionContactFormValues>();

  const contactAddressChoices = getAddressOptions(into.contactAddress, from);

  const updateContact = useUpdateContactMutation(into.id);

  async function handleSubmit(values: MergeInstitutionContactFormValues) {
    await updateContact
      .mutateAsync(mapImportMergeContactRequest(values), {
        onSuccess: () => {
          onSuccess();
        },
      })
      .catch();
  }

  return (
    <Formik
      initialValues={initialValues(into, from)}
      onSubmit={async (values) => await handleSubmit(values)}
    >
      {({ isSubmitting }) => (
        <SidebarForm ref={sidebarFormRef}>
          <SidebarContent title={"Institution zusammenführen"}>
            <Stack gap={3}>
              <MergeStringField
                target={into.name}
                source={from.data.name}
                name={fieldName("name")}
                label={"Name"}
              />
              <MergeStringField
                target={into.category}
                source={from.data.category}
                name={fieldName("category")}
                label={"Objekttyp"}
                getOptionLabel={(value) =>
                  contactCategoryNames[
                    value as keyof typeof contactCategoryNames
                  ]
                }
              />
              {contactAddressChoices.length > 0 && (
                <>
                  <Divider />
                  <AddressCardsField
                    options={contactAddressChoices}
                    name={fieldName("contactAddress")}
                    label={"Kontaktadresse"}
                    required={"Bitte auswählen"}
                  />
                </>
              )}
              <Divider />
              <Box component={"section"} aria-label={"E-Mail-Adressen"}>
                <InputArrayField
                  name={fieldName("emailAddresses")}
                  label={"E-Mail-Adresse"}
                  addMoreLabel={"E-Mail-Adresse hinzufügen"}
                />
              </Box>
              <Box component={"section"} aria-label={"Telefonnummern"}>
                <InputArrayField
                  name={fieldName("phoneNumbers")}
                  label={"Telefonnummer"}
                  addMoreLabel={"Telefonnummer hinzufügen"}
                />
              </Box>
            </Stack>
          </SidebarContent>
          <SidebarActions>
            <MultiFormButtonBar
              submitting={isSubmitting}
              submitLabel={"Bestätigen"}
              onCancel={onCancel}
            />
          </SidebarActions>
        </SidebarForm>
      )}
    </Formik>
  );
}
