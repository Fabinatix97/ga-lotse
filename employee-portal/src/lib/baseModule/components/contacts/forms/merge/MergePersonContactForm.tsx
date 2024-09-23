/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiGender,
  ApiPersonContact,
  ApiSalutation,
} from "@eshg/employee-portal-api/base";
import { InputArrayField } from "@eshg/lib-portal/components/formFields/InputArrayField";
import { createFieldNameMapper } from "@eshg/lib-portal/helpers/form";
import { Box, Divider, Grid, Stack } from "@mui/joy";
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
  MergePersonContactFormValues,
  PersonContactFormValues,
  PersonContactMergeSource,
} from "@/lib/baseModule/components/contacts/types";
import { MultiFormButtonBar } from "@/lib/shared/components/form/MultiFormButtonBar";
import {
  SidebarForm,
  SidebarFormHandle,
} from "@/lib/shared/components/form/SidebarForm";
import { mapApiAddressToForm } from "@/lib/shared/components/form/address/helpers";
import {
  GENDER_VALUES,
  SALUTATION_VALUES,
  TITLE_VALUES,
} from "@/lib/shared/components/personSidebar/constants";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";

function initialValues(
  into: ApiPersonContact,
  from: PersonContactMergeSource,
): MergePersonContactFormValues {
  return {
    type: "UpdatePersonContactRequest",
    firstName: mapMergeValue(into.firstName, from.data.firstName),
    name: mapMergeValue(into.name, from.data.name),
    title: mapMergeValue(into.title, from.data.title),
    salutation: mapMergeValue(into.salutation, from.data.salutation),
    gender: mapMergeValue(into.gender, from.data.gender),
    externalChatUsername: mapMergeValue(
      into.externalChatUsername,
      from.data.externalChatUsername,
    ),
    phoneNumbers: distinctConcat(into.phoneNumbers, from.data.phoneNumbers),
    emailAddresses: distinctConcat(
      into.emailAddresses,
      from.data.emailAddresses,
    ),
    contactAddress:
      isValidAddress(from.data.contactAddress) ||
      into.contactAddress === undefined
        ? undefined
        : mapApiAddressToForm(into.contactAddress),
    differentBillingAddress: isDefined(into.differentBillingAddress)
      ? mapApiAddressToForm(into.differentBillingAddress)
      : undefined,
  };
}

interface MergePersonContactFormProps {
  into: ApiPersonContact;
  from: PersonContactMergeSource;
  sidebarFormRef: Ref<SidebarFormHandle>;
  onCancel: () => void;
  onSuccess: () => void;
}

export function MergePersonContactForm({
  into,
  from,
  sidebarFormRef,
  onCancel,
  onSuccess,
}: MergePersonContactFormProps) {
  const fieldName = createFieldNameMapper<PersonContactFormValues>();

  const contactAddressChoices = getAddressOptions(into.contactAddress, from);

  const updateContact = useUpdateContactMutation(into.id);

  async function handleSubmit(values: MergePersonContactFormValues) {
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
          <SidebarContent title={"Person zusammenführen"}>
            <Stack gap={3}>
              <Grid container spacing={2}>
                <Grid xxs={6}>
                  <MergeStringField
                    target={into.salutation}
                    source={from.data.salutation}
                    name={fieldName("salutation")}
                    label={"Anrede"}
                    emptyValue={ApiSalutation.NotSpecified}
                    getOptionLabel={(value) =>
                      SALUTATION_VALUES[value as keyof typeof SALUTATION_VALUES]
                    }
                  />
                </Grid>
                <Grid xxs>
                  <MergeStringField
                    target={into.title}
                    source={from.data.title}
                    name={fieldName("title")}
                    label={"Titel"}
                    emptyValue={TITLE_VALUES.NotSpecified}
                  />
                </Grid>
              </Grid>
              <MergeStringField
                target={into.firstName}
                source={from.data.firstName}
                name={fieldName("firstName")}
                label={"Vorname"}
              />
              <MergeStringField
                target={into.name}
                source={from.data.name}
                name={fieldName("name")}
                label={"Name"}
              />
              <MergeStringField
                target={into.gender}
                source={from.data.gender}
                name={fieldName("gender")}
                label={"Geschlecht"}
                emptyValue={ApiGender.NotSpecified}
                getOptionLabel={(value) =>
                  GENDER_VALUES[value as keyof typeof GENDER_VALUES]
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
