/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Box, Divider, Stack } from "@mui/joy";
import { Formik } from "formik";
import { Ref } from "react";
import { isDefined } from "remeda";

import { ApiInstitutionContact } from "@eshg/base-api";
import {
  BaseAddressFormInputs,
  CONTACT_CATEGORY_NAMES,
  MultiFormButtonBar,
  SidebarActions,
  SidebarContent,
  SidebarForm,
  SidebarFormHandle,
  createEmptyAddress,
} from "@eshg/lib-employee-portal";
import {
  InputArrayField,
  getIndexLabel,
} from "@eshg/lib-portal/components/formFields/InputArrayField";
import { createFieldNameMapper } from "@eshg/lib-portal/helpers/form";

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
  InstitutionContactMergeSource,
  MergeInstitutionContactFormValues,
} from "@/lib/baseModule/components/contacts/types";

function initialValues(
  into: ApiInstitutionContact,
  from: InstitutionContactMergeSource,
  contactAddress: BaseAddressFormInputs | undefined,
  billingAddress: BaseAddressFormInputs | undefined,
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
    contactAddress: contactAddress ?? createEmptyAddress(),
    differentBillingAddress: billingAddress,
  };
}

interface MergeInstitutionContactFormProps {
  into: ApiInstitutionContact;
  from: InstitutionContactMergeSource;
  sidebarFormRef: Ref<SidebarFormHandle>;
  onCancel: () => void;
  onSuccess: () => void;
  onBack?: () => void;
  intoLabel: string;
  fromLabel: string;
}

export function MergeInstitutionContactForm({
  into,
  from,
  sidebarFormRef,
  onCancel,
  onSuccess,
  onBack,
  intoLabel,
  fromLabel,
}: MergeInstitutionContactFormProps) {
  const fieldName = createFieldNameMapper<MergeInstitutionContactFormValues>();

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

  async function handleSubmit(values: MergeInstitutionContactFormValues) {
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
          <SidebarContent title="Institution zusammenführen">
            <Stack gap={3} divider={<Divider />}>
              <Stack gap={"inherit"}>
                <MergeStringField
                  target={into.name}
                  source={from.data.name}
                  name={fieldName("name")}
                  label={"Name"}
                  sourceValueLabel={fromLabel}
                  targetValueLabel={intoLabel}
                />
                <MergeStringField
                  target={into.category}
                  source={from.data.category}
                  name={fieldName("category")}
                  label={"Objekttyp"}
                  getOptionLabel={(value) =>
                    CONTACT_CATEGORY_NAMES[
                      value as keyof typeof CONTACT_CATEGORY_NAMES
                    ]
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
