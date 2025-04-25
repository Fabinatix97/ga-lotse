/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Divider, Grid } from "@mui/joy";
import { Formik } from "formik";
import { useRouter } from "next/navigation";

import { ApiGdprProcedureType, ApiSalutation } from "@eshg/base-api";
import {
  BaseAddressFormInputs,
  ContactAddressForm,
  MultiFormButtonBar,
  SidebarActions,
  SidebarContent,
  SidebarForm,
  SidebarWithFormRefProps,
  createEmptyAddress,
  gdprRoutes,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";
import { DateField } from "@eshg/lib-portal/components/formFields/DateField";
import { EmailField } from "@eshg/lib-portal/components/formFields/EmailField";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { SelectField } from "@eshg/lib-portal/components/formFields/SelectField";
import { SALUTATION_OPTIONS } from "@eshg/lib-portal/components/formFields/constants";
import { createFieldNameMapper } from "@eshg/lib-portal/helpers/form";
import { validateDateOfBirth } from "@eshg/lib-portal/helpers/validators";
import { useValidators } from "@eshg/lib-portal/hooks/useValidators";
import { OptionalFieldValue } from "@eshg/lib-portal/types/form";

import { mapAddGdprProcedureRequest } from "@/lib/baseModule/api/mapper/gdpr";
import { useAddGdprProcedure } from "@/lib/baseModule/api/mutations/gdpr";
import { TYPE_OPTIONS } from "@/lib/baseModule/components/gdpr/i18n";

export interface GDPRProcedureFormInputs {
  type: OptionalFieldValue<ApiGdprProcedureType>;
  salutation: OptionalFieldValue<ApiSalutation>;
  title: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  address: BaseAddressFormInputs;
  emailAddress: string;
  phoneNumber: string;
}

function initialValues(): GDPRProcedureFormInputs {
  return {
    type: "",
    salutation: "",
    title: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    address: createEmptyAddress(),
    emailAddress: "",
    phoneNumber: "",
  };
}

export function useCreateGDPRProcedureSidebar() {
  return useSidebarWithFormRef({
    component: CreateGDPRProcedureSidebar,
  });
}

function CreateGDPRProcedureSidebar({
  onClose,
  formRef,
}: SidebarWithFormRefProps) {
  const { validateLength } = useValidators();
  const router = useRouter();
  const fieldName = createFieldNameMapper<GDPRProcedureFormInputs>();

  const addGdprProcedure = useAddGdprProcedure();

  return (
    <Formik
      initialValues={initialValues()}
      onSubmit={async (values) => {
        await addGdprProcedure.mutateAsync(mapAddGdprProcedureRequest(values), {
          onSuccess: ({ id }) => router.push(gdprRoutes.details(id)),
        });
      }}
    >
      {({ isSubmitting, values }) => (
        <SidebarForm ref={formRef}>
          <SidebarContent title="DSGVO Vorgang anlegen">
            <Grid container spacing={3}>
              <Grid xxs={12}>
                <SelectField
                  options={TYPE_OPTIONS}
                  name={fieldName("type")}
                  label={"Vorgangsart"}
                  required={"Bitte die Art des Vorgangs angeben"}
                />
              </Grid>
              <Grid xxs={12} xs={6}>
                <SelectField
                  options={SALUTATION_OPTIONS}
                  name={fieldName("salutation")}
                  label={"Anrede"}
                />
              </Grid>
              <Grid xxs={12} xs={6}>
                <InputField name={fieldName("title")} label={"Titel"} />
              </Grid>
              <Grid xxs={12}>
                <InputField
                  name={fieldName("firstName")}
                  label={"Vorname"}
                  required={"Bitte einen Vornamen angeben"}
                  validate={validateLength(1, 80)}
                />
              </Grid>
              <Grid xxs={12}>
                <InputField
                  name={fieldName("lastName")}
                  label={"Nachname"}
                  required={"Bitte einen Nachname angeben"}
                  validate={validateLength(1, 120)}
                />
              </Grid>
              <Grid xxs={12}>
                <DateField
                  name={fieldName("dateOfBirth")}
                  label={"Geburtsdatum"}
                  required={"Bitte ein Geburtsdatum eingeben"}
                  validate={validateDateOfBirth}
                />
              </Grid>
              <Grid xxs={12}>
                <Divider />
              </Grid>
              <ContactAddressForm
                type={values.address.type}
                name={fieldName("address")}
              />
              <Grid xxs={12}>
                <Divider />
              </Grid>
              <Grid xxs={12}>
                <EmailField
                  name={fieldName("emailAddress")}
                  label={"E-Mail-Adresse"}
                  validate={validateLength(6, 254)}
                />
              </Grid>
              <Grid xxs={12}>
                <InputField
                  name={fieldName("phoneNumber")}
                  label={"Telefonnummer"}
                  validate={validateLength(1, 23)}
                />
              </Grid>
            </Grid>
          </SidebarContent>
          <SidebarActions>
            <MultiFormButtonBar
              submitLabel={"Anlegen"}
              submitting={isSubmitting}
              onCancel={() => onClose(false)}
            />
          </SidebarActions>
        </SidebarForm>
      )}
    </Formik>
  );
}
