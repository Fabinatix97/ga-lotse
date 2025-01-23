/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiGender, ApiPersonContact, ApiSalutation } from "@eshg/base-api";
import {
  InputArrayField,
  getIndexLabel,
} from "@eshg/lib-portal/components/formFields/InputArrayField";
import {
  GENDER_VALUES,
  SALUTATION_VALUES,
  TITLE_VALUES,
} from "@eshg/lib-portal/components/formFields/constants";
import { createFieldNameMapper } from "@eshg/lib-portal/helpers/form";
import { Box, Divider, Grid, Stack } from "@mui/joy";
import { Formik } from "formik";
import { Ref } from "react";
import { isDefined } from "remeda";

import { mapImportMergeContactRequest } from "@/lib/baseModule/api/mapper/contacts";
import { useUpdateContactMutation } from "@/lib/baseModule/api/mutations/contacts";
import { AddressMergeField } from "@/lib/baseModule/components/contacts/forms/card/AddressMergeField";
import {
  distinctConcat,
  getAddressOptions,
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
import { BaseAddressFormInputs } from "@/lib/shared/components/form/address/helpers";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";

function initialValues(
  into: ApiPersonContact,
  from: PersonContactMergeSource,
  contactAddress: BaseAddressFormInputs | undefined,
  billingAddress: BaseAddressFormInputs | undefined,
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
    contactAddress: contactAddress,
    differentBillingAddress: billingAddress,
  };
}

interface MergePersonContactFormProps {
  into: ApiPersonContact;
  from: PersonContactMergeSource;
  sidebarFormRef: Ref<SidebarFormHandle>;
  onCancel: () => void;
  onSuccess: () => void;
  onBack?: () => void;
  fromLabel: string;
  intoLabel: string;
}

export function MergePersonContactForm({
  into,
  from,
  sidebarFormRef,
  onCancel,
  onSuccess,
  onBack,
  fromLabel,
  intoLabel,
}: MergePersonContactFormProps) {
  const fieldName = createFieldNameMapper<PersonContactFormValues>();

  const {
    from: fromContactAddress,
    into: intoContactAddress,
    requiresMerge: requiresContactAddressMerge,
    initialAddress: initialContactAddress,
  } = getAddressOptions(
    into.contactAddress,
    from.type === "Entity"
      ? { type: "Entity", data: from.data.contactAddress }
      : { type: "Import", data: from.data.contactAddress },
  );

  const {
    from: fromBillingAddress,
    into: intoBillingAddress,
    requiresMerge: requiresBillingAddressMerge,
    initialAddress: initialBillingAddress,
  } = getAddressOptions(
    into.differentBillingAddress,
    from.type === "Entity"
      ? { type: "Entity", data: from.data.differentBillingAddress }
      : { type: "Import", data: from.data.differentBillingAddress },
  );

  const updateContact = useUpdateContactMutation(into.id);

  async function handleSubmit(values: MergePersonContactFormValues) {
    await updateContact.mutateAsync(
      mapImportMergeContactRequest(
        values,
        from.type === "Entity" ? from.data.id : undefined,
      ),
      {
        onSuccess,
      },
    );
  }

  return (
    <Formik
      initialValues={initialValues(
        into,
        from,
        initialContactAddress,
        initialBillingAddress,
      )}
      onSubmit={async (values) => await handleSubmit(values)}
    >
      {({ isSubmitting, values }) => (
        <SidebarForm ref={sidebarFormRef}>
          <SidebarContent title={"Person zusammenführen"}>
            <Stack gap={3} divider={<Divider />}>
              <Stack gap={"inherit"}>
                <Grid container spacing={2}>
                  <Grid xxs={6}>
                    <MergeStringField
                      target={into.salutation}
                      source={from.data.salutation}
                      name={fieldName("salutation")}
                      label={"Anrede"}
                      emptyValue={ApiSalutation.NotSpecified}
                      getOptionLabel={(value) =>
                        SALUTATION_VALUES[
                          value as keyof typeof SALUTATION_VALUES
                        ]
                      }
                      sourceValueLabel={fromLabel}
                      targetValueLabel={intoLabel}
                    />
                  </Grid>
                  <Grid xxs>
                    <MergeStringField
                      target={into.title}
                      source={from.data.title}
                      name={fieldName("title")}
                      label={"Titel"}
                      emptyValue={TITLE_VALUES.NotSpecified}
                      sourceValueLabel={fromLabel}
                      targetValueLabel={intoLabel}
                    />
                  </Grid>
                </Grid>
                <MergeStringField
                  target={into.firstName}
                  source={from.data.firstName}
                  name={fieldName("firstName")}
                  label={"Vorname"}
                  sourceValueLabel={fromLabel}
                  targetValueLabel={intoLabel}
                />
                <MergeStringField
                  target={into.name}
                  source={from.data.name}
                  name={fieldName("name")}
                  label={"Name"}
                  sourceValueLabel={fromLabel}
                  targetValueLabel={intoLabel}
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
                  sourceValueLabel={fromLabel}
                  targetValueLabel={intoLabel}
                />
              </Stack>
              {(isDefined(values.contactAddress) ||
                requiresContactAddressMerge) && (
                <AddressMergeField
                  options={[
                    {
                      label: `Übernehmen von ${intoLabel}`,
                      value: intoContactAddress,
                    },
                    {
                      label: `Übernehmen von ${fromLabel}`,
                      value: fromContactAddress,
                    },
                  ]}
                  name={fieldName("contactAddress")}
                  label={"Kontaktadresse"}
                  required={"Bitte auswählen"}
                  value={values.contactAddress}
                  readOnly={!requiresContactAddressMerge}
                />
              )}
              {(isDefined(values.differentBillingAddress) ||
                requiresBillingAddressMerge) && (
                <AddressMergeField
                  options={[
                    {
                      label: `Übernehmen von ${intoLabel}`,
                      value: intoBillingAddress,
                    },
                    {
                      label: `Übernehmen von ${fromLabel}`,
                      value: fromBillingAddress,
                    },
                  ]}
                  name={fieldName("differentBillingAddress")}
                  label={"Abweichende Rechnungsadresse"}
                  required={"Bitte auswählen"}
                  value={values.differentBillingAddress}
                  readOnly={!requiresBillingAddressMerge}
                />
              )}
              <Stack gap={"inherit"}>
                <Box component={"section"} aria-label={"E-Mail-Adressen"}>
                  <InputArrayField
                    name={fieldName("emailAddresses")}
                    label={(index) => getIndexLabel("E-Mail-Adresse", index)}
                    addMoreLabel={"E-Mail-Adresse hinzufügen"}
                  />
                </Box>
                <Box component={"section"} aria-label={"Telefonnummern"}>
                  <InputArrayField
                    name={fieldName("phoneNumbers")}
                    label={(index) => getIndexLabel("Telefonnummer", index)}
                    addMoreLabel={"Telefonnummer hinzufügen"}
                  />
                </Box>
              </Stack>
            </Stack>
          </SidebarContent>
          <SidebarActions>
            <MultiFormButtonBar
              submitting={isSubmitting}
              submitLabel={"Bestätigen"}
              onCancel={onCancel}
              onBack={onBack}
            />
          </SidebarActions>
        </SidebarForm>
      )}
    </Formik>
  );
}
