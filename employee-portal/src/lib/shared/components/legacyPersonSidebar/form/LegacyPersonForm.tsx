/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  FormButtonBar,
  SidebarActions,
  SidebarContent,
  SidebarForm,
  SidebarFormHandle,
} from "@eshg/lib-employee-portal";
import { RefObject } from "@fullcalendar/core/preact.js";
import { Divider, Stack } from "@mui/joy";
import { Formik, FormikErrors } from "formik";

import {
  LegacyAddressForm,
  LegacyBaseAddress,
  createEmptyLegacyAddress,
} from "@/lib/shared/components/form/address/LegacyAddressForm";
import { ApiFacilityAddressType } from "@/lib/shared/components/form/address/legacyTypes";
import {
  BASE_PERSON_VALUES,
  LegacyBasePerson,
  LegacyBasePersonForm,
  LegacyMinimalPerson,
} from "@/lib/shared/components/legacyPersonSidebar/form/LegacyBasePersonForm";
import { LegacyEmailAddressesForm } from "@/lib/shared/components/legacyPersonSidebar/form/LegacyEmailAddressesForm";
import { LegacyPhoneNumbersForm } from "@/lib/shared/components/legacyPersonSidebar/form/LegacyPhoneNumbersForm";

export interface LegacyPersonFormConfig {
  hiddenFields?: (keyof LegacyPerson)[];
  optionalFields?: Exclude<keyof LegacyPerson, keyof LegacyMinimalPerson>[];
  disabledFields?: ("firstName" | "lastName" | "dateOfBirth")[];
}

export interface LegacyPerson extends LegacyBasePerson {
  postalAddress: LegacyBaseAddress;
  billingAddress?: LegacyBaseAddress;
  phoneNumbers: string[];
  emailAddresses: string[];
  referenceId?: string;
}

export const PERSON_VALUES = {
  ...BASE_PERSON_VALUES,
  postalAddress: createEmptyLegacyAddress(ApiFacilityAddressType.Postal),
  billingAddress: createEmptyLegacyAddress(ApiFacilityAddressType.Billing),
  emailAddresses: [""],
  phoneNumbers: [""],
} as LegacyPerson;

interface PersonFormProps {
  title: string;
  person: LegacyPerson;
  config: LegacyPersonFormConfig;
  onSubmit: (person: LegacyPerson) => Promise<unknown>;
  onCancel: () => void;
  validate?: (person: LegacyPerson) => FormikErrors<LegacyPerson>;
  sidebarFormRef?: RefObject<SidebarFormHandle>;
  showPostalAddress?: boolean;
}

export function LegacyPersonForm({
  title,
  person,
  config,
  onSubmit,
  onCancel,
  validate,
  sidebarFormRef,
  showPostalAddress = undefined,
}: PersonFormProps) {
  const { hiddenFields, optionalFields, disabledFields } = config;

  return (
    <Formik
      initialValues={person}
      onSubmit={onSubmit}
      validate={validate}
      enableReinitialize
    >
      {({ values, isSubmitting }) => (
        <SidebarForm ref={sidebarFormRef}>
          <SidebarContent title={title}>
            <Stack gap={2} rowGap={2}>
              <LegacyBasePersonForm
                hiddenFields={hiddenFields}
                optionalFields={optionalFields}
                disabledFields={disabledFields}
              />

              {(!hiddenFields?.includes("postalAddress") ||
                !hiddenFields?.includes("billingAddress")) && (
                <>
                  <Divider />

                  {!hiddenFields?.includes("postalAddress") && (
                    <LegacyAddressForm
                      name="postalAddress"
                      isOptional={!!optionalFields?.includes("postalAddress")}
                      type={ApiFacilityAddressType.Postal}
                      show={showPostalAddress}
                    />
                  )}

                  {!hiddenFields?.includes("billingAddress") && (
                    <LegacyAddressForm
                      name="billingAddress"
                      isOptional={!!optionalFields?.includes("billingAddress")}
                      type={ApiFacilityAddressType.Billing}
                    />
                  )}
                </>
              )}

              {(!hiddenFields?.includes("emailAddresses") ||
                !hiddenFields?.includes("phoneNumbers")) && (
                <>
                  <Divider />

                  <LegacyEmailAddressesForm
                    emailAddresses={values.emailAddresses}
                    isOptional={!!optionalFields?.includes("emailAddresses")}
                  />
                  <LegacyPhoneNumbersForm
                    phoneNumbers={values.phoneNumbers}
                    isOptional={!!optionalFields?.includes("phoneNumbers")}
                  />
                </>
              )}
            </Stack>
          </SidebarContent>

          <SidebarActions>
            <FormButtonBar
              submitLabel="Anlegen"
              submitting={isSubmitting}
              onCancel={() => onCancel()}
            />
          </SidebarActions>
        </SidebarForm>
      )}
    </Formik>
  );
}
