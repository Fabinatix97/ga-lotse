/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { InputArrayField } from "@eshg/lib-portal/components/formFields/InputArrayField";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { createFieldNameMapper } from "@eshg/lib-portal/helpers/form";
import { validateLength } from "@eshg/lib-portal/helpers/validators";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button, Divider, Grid, IconButton, Stack, Typography } from "@mui/joy";
import { FieldArray, Formik } from "formik";
import { Fragment, ReactNode, RefObject } from "react";

import { Row } from "@/lib/shared/Row";
import { BaseFacility } from "@/lib/shared/components/facilitySidebar/types";
import { FormButtonBar } from "@/lib/shared/components/form/FormButtonBar";
import {
  SidebarForm,
  SidebarFormHandle,
} from "@/lib/shared/components/form/SidebarForm";
import {
  ContactAddressForm,
  OptionalBillingAddressForm,
} from "@/lib/shared/components/form/address/BaseAddressForm";
import { EmailField } from "@/lib/shared/components/formFields/EmailField";
import { PhoneNumberField } from "@/lib/shared/components/formFields/PhoneNumberField";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";
import { createEmptyContactPerson } from "@/lib/shared/helpers/facilityUtils";

import { ContactPersonForm } from "./ContactPersonForm";

interface FacilityFormProps {
  facility: BaseFacility;
  onSubmit: (facility: BaseFacility) => Promise<void>;
  onCancel: () => void;
  extraFieldsTop?: ReactNode;
  extraFieldsBottom?: ReactNode;
  sidebarFormRef?: RefObject<SidebarFormHandle>;
  title: string;
  contactPersonRequired?: boolean;
  contactPersonSalutationRequired?: boolean;
  contactPersonTitleRequired?: boolean;
  contactPersonRoleRequired?: boolean;
}

export function FacilityForm({
  facility,
  onSubmit,
  onCancel,
  extraFieldsTop,
  extraFieldsBottom,
  sidebarFormRef,
  title,
  contactPersonRequired,
  contactPersonSalutationRequired,
  contactPersonTitleRequired,
  contactPersonRoleRequired,
}: FacilityFormProps) {
  const fieldName = createFieldNameMapper<BaseFacility>();
  return (
    <Formik initialValues={facility} onSubmit={onSubmit} enableReinitialize>
      {({ values, isSubmitting }) => (
        <SidebarForm ref={sidebarFormRef} aria-label={title}>
          <SidebarContent title={title}>
            <Stack gap={2}>
              <Stack component="section" gap={2} aria-label="Einrichtungsdaten">
                <InputField
                  name={fieldName("name")}
                  label="Name"
                  required="Bitte den Namen der Einrichtung eingeben."
                  validate={validateLength(1, 300)}
                />

                {extraFieldsTop}

                <Divider />

                <Grid container spacing={2} data-testid={"contactAddress"}>
                  <ContactAddressForm
                    type={values.contactAddress.type}
                    name={fieldName("contactAddress")}
                  />
                </Grid>
                <Grid container spacing={2} data-testid={"billingAddress"}>
                  <OptionalBillingAddressForm
                    name={fieldName("billingAddress")}
                    values={values.billingAddress}
                  />
                </Grid>

                <Divider />

                <Grid xxs={12} data-testid={"emailAddresses"}>
                  <InputArrayField
                    name={fieldName("emailAddresses")}
                    label={"E-Mail-Adresse"}
                    addMoreLabel={"E-Mail-Adresse hinzufügen"}
                    fieldComponent={EmailField}
                  />
                </Grid>
                <Grid xxs={12} data-testid={"phoneNumbers"}>
                  <InputArrayField
                    name={fieldName("phoneNumbers")}
                    label={"Telefonnummer"}
                    addMoreLabel={"Telefonnummer hinzufügen"}
                    fieldComponent={PhoneNumberField}
                  />
                </Grid>
              </Stack>

              <ContactPersonsFieldArray
                values={values}
                salutationRequired={contactPersonSalutationRequired}
                titleRequired={contactPersonTitleRequired}
                roleRequired={contactPersonRoleRequired}
                contactPersonRequired={contactPersonRequired}
              />

              {extraFieldsBottom && (
                <>
                  <Divider />
                  {extraFieldsBottom}
                </>
              )}
            </Stack>
          </SidebarContent>

          <SidebarActions>
            <FormButtonBar
              submitLabel="Anlegen"
              submitting={isSubmitting}
              onCancel={onCancel}
            />
          </SidebarActions>
        </SidebarForm>
      )}
    </Formik>
  );
}

interface ContactPersonFieldArrayProps {
  values: BaseFacility;
  salutationRequired?: boolean;
  titleRequired?: boolean;
  roleRequired?: boolean;
  contactPersonRequired?: boolean;
}
function ContactPersonsFieldArray({
  values,
  salutationRequired = true,
  titleRequired = true,
  roleRequired = true,
  contactPersonRequired,
}: ContactPersonFieldArrayProps) {
  return (
    <FieldArray name="contactPersons" validateOnChange={false}>
      {({ push, remove }) => (
        <>
          {values.contactPersons?.map((contactPerson, index) => {
            // don't include any values in the key, as this would cause the input fields to lose focus
            const key = `contactPerson.${index}`;
            const sectionHeader = `Kontaktperson${index != 0 ? " " + (index + 1) : ""}`;
            return (
              <section key={key}>
                <Divider />
                <Row justifyContent="space-between">
                  <Typography
                    level="body-md"
                    component="h2"
                    paddingTop={3}
                    paddingBottom={3}
                    fontWeight="bold"
                    alignSelf="center"
                  >
                    {sectionHeader}
                  </Typography>
                  {!(index == 0 && contactPersonRequired) && (
                    <IconButton
                      color="primary"
                      onClick={() => remove(index)}
                      aria-label={`${sectionHeader} löschen`}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Row>
                <ContactPersonForm
                  name={`contactPersons.${index}`}
                  salutationRequired={salutationRequired}
                  titleRequired={titleRequired}
                  roleRequired={roleRequired}
                />
              </section>
            );
          })}
          <Button
            onClick={() => push(createEmptyContactPerson())}
            variant="plain"
            color="primary"
            startDecorator={<AddIcon />}
            size={"sm"}
            sx={{
              padding: 0,
              margin: 0,
              "--Button-minHeight": 0,
              alignSelf: "flex-start",
            }}
          >
            Kontaktperson hinzufügen
          </Button>
        </>
      )}
    </FieldArray>
  );
}
