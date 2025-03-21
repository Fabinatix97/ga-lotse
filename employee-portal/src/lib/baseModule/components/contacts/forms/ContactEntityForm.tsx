/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiContactType } from "@eshg/base-api";
import { createEmptyAddress } from "@eshg/lib-employee-portal";
import { FormAddMoreButton } from "@eshg/lib-portal/components/form/FormAddMoreButton";
import { EmailField } from "@eshg/lib-portal/components/formFields/EmailField";
import {
  InputArrayField,
  getIndexLabel,
} from "@eshg/lib-portal/components/formFields/InputArrayField";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import { Box, Divider, Grid, IconButton, Stack, Typography } from "@mui/joy";
import { Formik } from "formik";
import { useRouter } from "next/navigation";
import { Ref } from "react";
import { isDefined } from "remeda";

import {
  mapAddContactRequest,
  mapUpdateContactRequest,
} from "@/lib/baseModule/api/mapper/contacts";
import {
  useAddContactMutation,
  useUpdateContactMutation,
} from "@/lib/baseModule/api/mutations/contacts";
import { InstitutionFormFields } from "@/lib/baseModule/components/contacts/forms/InstitutionFormFields";
import { PersonFormFields } from "@/lib/baseModule/components/contacts/forms/PersonFormFields";
import { ContactFormValues } from "@/lib/baseModule/components/contacts/types";
import { routes } from "@/lib/baseModule/shared/routes";
import { MultiFormButtonBar } from "@/lib/shared/components/form/MultiFormButtonBar";
import {
  SidebarForm,
  SidebarFormHandle,
} from "@/lib/shared/components/form/SidebarForm";
import {
  ContactAddressForm,
  OptionalBillingAddressForm,
} from "@/lib/shared/components/form/address/BaseAddressForm";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";

interface ContactEntityFormProps {
  contactId?: string;
  initialValues: ContactFormValues;
  onClose: () => void;
  onUpdated?: () => void;
  type: ApiContactType;
  sidebarFormRef: Ref<SidebarFormHandle>;
}

const contactTypeTranslation = {
  PERSON: "Person",
  INSTITUTION: "Institution",
} as const satisfies Record<ApiContactType, string>;

function translateType(type: ApiContactType) {
  return contactTypeTranslation[type];
}

export function ContactEntityForm({
  initialValues,
  contactId,
  onClose,
  onUpdated,
  type,
  sidebarFormRef,
}: ContactEntityFormProps) {
  const router = useRouter();
  const createContact = useAddContactMutation();
  const updateContact = useUpdateContactMutation(contactId ?? "");

  async function handleSubmit(values: ContactFormValues) {
    if (isDefined(contactId)) {
      await updateContact.mutateAsync(mapUpdateContactRequest(values), {
        onSuccess: () => onUpdated?.(),
      });
    } else {
      await createContact.mutateAsync(mapAddContactRequest(values), {
        onSuccess: ({ id }) => router.push(routes.contacts.details(id)),
      });
    }
  }

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      onSubmit={async (values) => {
        await handleSubmit(values);
      }}
    >
      {({ isSubmitting, values, setFieldValue }) => (
        <SidebarForm ref={sidebarFormRef}>
          <SidebarContent
            title={
              isDefined(contactId)
                ? "Kontakt bearbeiten"
                : `Neue ${translateType(type)} anlegen`
            }
          >
            <Grid container spacing={3}>
              {type === "PERSON" ? (
                <PersonFormFields />
              ) : (
                <InstitutionFormFields />
              )}
              {isDefined(values.contactAddress) ? (
                <Box
                  component={"section"}
                  sx={{ display: "contents" }}
                  aria-labelledby={"address-section-header"}
                >
                  <Grid xxs={12}>
                    <Stack
                      gap={1}
                      direction={"row"}
                      justifyContent={"space-between"}
                      alignItems={"center"}
                    >
                      <Typography
                        level={"title-lg"}
                        id={"address-section-header"}
                      >
                        Kontaktadresse
                      </Typography>
                      {type === "PERSON" && (
                        <IconButton
                          aria-label={"Kontaktadresse entfernen"}
                          color={"primary"}
                          onClick={() =>
                            setFieldValue("contactAddress", undefined, false)
                          }
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </Stack>
                  </Grid>
                  <ContactAddressForm
                    type={values.contactAddress.type}
                    name={"contactAddress"}
                  />
                  <OptionalBillingAddressForm
                    name={"differentBillingAddress"}
                    values={values.differentBillingAddress}
                  />
                </Box>
              ) : (
                <Grid xxs={12}>
                  <FormAddMoreButton
                    onClick={() =>
                      setFieldValue(
                        "contactAddress",
                        createEmptyAddress(),
                        false,
                      )
                    }
                  >
                    Kontaktadresse hinzufügen
                  </FormAddMoreButton>
                </Grid>
              )}
              <Grid xxs={12}>
                <Divider />
              </Grid>
              <Grid
                component={"section"}
                xxs={12}
                data-testid={"email-address-array"}
                aria-label={"E-Mail Adressen"}
              >
                <InputArrayField
                  name={"emailAddresses"}
                  label={(index) => getIndexLabel("E-Mail-Adresse", index)}
                  addMoreLabel={"E-Mail-Adresse hinzufügen"}
                  fieldComponent={EmailField}
                />
              </Grid>
              <Grid
                component={"section"}
                xxs={12}
                data-testid={"phone-number-array"}
                aria-label={"Telefonnummern"}
              >
                <InputArrayField
                  name={"phoneNumbers"}
                  label={(index) => getIndexLabel("Telefonnummer", index)}
                  addMoreLabel={"Telefonnummer hinzufügen"}
                />
              </Grid>
            </Grid>
          </SidebarContent>
          <SidebarActions>
            <MultiFormButtonBar
              submitLabel="Speichern"
              submitting={isSubmitting}
              onCancel={onClose}
            />
          </SidebarActions>
        </SidebarForm>
      )}
    </Formik>
  );
}
