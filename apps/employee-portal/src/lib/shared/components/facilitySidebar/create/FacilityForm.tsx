/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Box, Divider, Grid, Stack } from "@mui/joy";
import { Formik } from "formik";
import { Ref } from "react";
import { isDefined } from "remeda";

import {
  BaseAddressFormInputs,
  MultiFormButtonBar,
  OptionalBillingAddressForm,
  OptionalContactAddressForm,
  SidebarActions,
  SidebarContent,
  SidebarForm,
  SidebarFormHandle,
  createEmptyAddress,
} from "@eshg/lib-employee-portal";
import {
  EmailField,
  InputArrayField,
  InputField,
  PhoneNumberField,
  createFieldNameMapper,
  getIndexLabel,
  useValidateLength,
} from "@eshg/lib-portal";

import {
  MeaslesFacilityTypeSelect,
  MeaslesFacilityTypeSelectFormValues,
} from "@/lib/businessModules/measlesProtection/components/procedures/procedureDetails/MeaslesFacilityTypeSelect";
import { FacilityContactPersonArrayForm } from "@/lib/shared/components/facilitySidebar/create/FacilityContactPersonArrayForm";
import { FacilitySearchFormValues } from "@/lib/shared/components/facilitySidebar/search/FacilitySearchForm";
import { BaseFacilityContactPerson } from "@/lib/shared/components/facilitySidebar/types";
import { createEmptyContactPerson } from "@/lib/shared/helpers/facilityUtils";

export interface DefaultFacilityFormValues {
  name: string;
  emailAddresses: string[];
  phoneNumbers: string[];
  contactAddress?: BaseAddressFormInputs;
  differentBillingAddress?: BaseAddressFormInputs;
  contactPersons: BaseFacilityContactPerson[];
  measlesFacilityType?: MeaslesFacilityTypeSelectFormValues;
}

// TODO: Make this accept an object instead
export function getInitialFacilityFormValues(
  searchInputs?: FacilitySearchFormValues,
  requiresContactPerson?: boolean,
  defaultValues?: Partial<DefaultFacilityFormValues>,
): DefaultFacilityFormValues {
  return {
    name: defaultValues?.name ?? searchInputs?.name ?? "",
    emailAddresses: defaultValues?.emailAddresses ?? [""],
    phoneNumbers: defaultValues?.phoneNumbers ?? [""],
    contactAddress: defaultValues?.contactAddress ?? createEmptyAddress(),
    contactPersons:
      defaultValues?.contactPersons ??
      (requiresContactPerson ? [createEmptyContactPerson()] : []),
    measlesFacilityType: {
      type: defaultValues?.measlesFacilityType?.type ?? "",
      otherFacilityTypeInformation:
        defaultValues?.measlesFacilityType?.otherFacilityTypeInformation ?? "",
    },
  };
}

interface FacilityFormProps {
  title: string;
  submitLabel?: string;
  searchInputs?: FacilitySearchFormValues;
  initialValues?: DefaultFacilityFormValues;
  requiresContactPerson?: boolean;
  mode?: "create" | "edit";
  addressOptional?: boolean;

  sidebarFormRef?: Ref<SidebarFormHandle>;
  onSubmit: (values: DefaultFacilityFormValues) => Promise<void>;
  onCancel: () => void;
  onBack?: (values: DefaultFacilityFormValues) => void;

  allowMainContactPerson?: boolean;
  showMeaslesFacilityType?: boolean;
  submitting?: boolean;
}

export function FacilityForm(props: FacilityFormProps) {
  const validateLength = useValidateLength();
  const initialValues: DefaultFacilityFormValues =
    props.initialValues ?? getInitialFacilityFormValues(props.searchInputs);

  const fieldName = createFieldNameMapper<DefaultFacilityFormValues>();

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      onSubmit={props.onSubmit}
    >
      {({ isSubmitting, values }) => (
        <SidebarForm ref={props.sidebarFormRef}>
          <SidebarContent
            title={props.title}
            subtitle={
              props.mode === "create" ? "Neue Einrichtung anlegen" : undefined
            }
          >
            <Stack gap={2}>
              <InputField
                name={fieldName("name")}
                label="Name"
                validate={validateLength(1, 300)}
                required={
                  props.mode === "edit"
                    ? "Bitte einen Namen angeben"
                    : undefined
                }
                readOnly={props.mode !== "edit"}
              />

              <Divider />
              {props.showMeaslesFacilityType && (
                <>
                  <MeaslesFacilityTypeSelect />
                  <Divider />
                </>
              )}

              <Grid container spacing={2}>
                <OptionalContactAddressForm
                  name={fieldName("contactAddress")}
                  values={values.contactAddress}
                  optional={props.addressOptional}
                />
                {isDefined(
                  values.contactAddress ?? values.differentBillingAddress,
                ) && (
                  <OptionalBillingAddressForm
                    name={fieldName("differentBillingAddress")}
                    values={values.differentBillingAddress}
                  />
                )}
              </Grid>

              <Divider />

              <Box
                component="section"
                aria-label="E-Mail-Adressen"
                sx={{ display: "contents" }}
              >
                <InputArrayField
                  name={fieldName("emailAddresses")}
                  addMoreLabel="E-Mail-Adresse hinzufügen"
                  fieldComponent={EmailField}
                  label={(index) => getIndexLabel("E-Mail-Adresse", index)}
                  validateEach={validateLength(6, 254)}
                />
              </Box>

              <Box
                component="section"
                aria-label="Telefonnummern"
                sx={{ display: "contents" }}
              >
                <InputArrayField
                  name={fieldName("phoneNumbers")}
                  addMoreLabel="Telefonnummer hinzufügen"
                  fieldComponent={PhoneNumberField}
                  label={(index) => getIndexLabel("Telefonnummer", index)}
                  validateEach={validateLength(1, 23)}
                />
              </Box>

              <FacilityContactPersonArrayForm
                name={fieldName("contactPersons")}
                values={values.contactPersons}
                contactPersonRequired={props.requiresContactPerson === true}
                allowMainContactPerson={props.allowMainContactPerson}
              />
            </Stack>
          </SidebarContent>
          <SidebarActions>
            <MultiFormButtonBar
              submitLabel={props.submitLabel ?? "Anlegen"}
              submitting={
                isDefined(props.submitting)
                  ? isSubmitting && props.submitting
                  : isSubmitting
              }
              onBack={
                isDefined(props.onBack)
                  ? () => props.onBack!(values)
                  : undefined
              }
              onCancel={props.onCancel}
            />
          </SidebarActions>
        </SidebarForm>
      )}
    </Formik>
  );
}
