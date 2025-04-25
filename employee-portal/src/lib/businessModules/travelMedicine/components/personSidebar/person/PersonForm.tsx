/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { RefObject } from "@fullcalendar/core/preact.js";
import { Divider, Stack } from "@mui/joy";
import { Formik, FormikErrors } from "formik";

import {
  MultiFormButtonBar,
  SidebarActions,
  SidebarContent,
  SidebarForm,
  SidebarFormHandle,
} from "@eshg/lib-employee-portal";

import { LegacyAddressForm } from "@/lib/shared/components/form/address/LegacyAddressForm";
import { ApiFacilityAddressType } from "@/lib/shared/components/form/address/legacyTypes";
import {
  LegacyBasePersonForm,
  LegacyMinimalPerson,
} from "@/lib/shared/components/legacyPersonSidebar/form/LegacyBasePersonForm";
import { LegacyEmailAddressesForm } from "@/lib/shared/components/legacyPersonSidebar/form/LegacyEmailAddressesForm";
import { LegacyPerson } from "@/lib/shared/components/legacyPersonSidebar/form/LegacyPersonForm";
import { LegacyPhoneNumbersForm } from "@/lib/shared/components/legacyPersonSidebar/form/LegacyPhoneNumbersForm";

export interface PersonFormConfig {
  hiddenFields?: (keyof LegacyPerson)[];
  optionalFields?: Exclude<keyof LegacyPerson, keyof LegacyMinimalPerson>[];
  disabledFields?: ("firstName" | "lastName" | "dateOfBirth")[];
}

interface PersonFormProps {
  title: string;
  person: LegacyPerson;
  config: PersonFormConfig;
  onSubmit: (person: LegacyPerson) => void;
  onCancel: () => void;
  validate?: (person: LegacyPerson) => FormikErrors<LegacyPerson>;
  sidebarFormRef?: RefObject<SidebarFormHandle>;
  showPostalAddress?: boolean;
  skipInitialAppointmentSelection?: boolean;
}

export function PersonForm({
  title,
  person,
  config,
  onSubmit,
  onCancel,
  validate,
  sidebarFormRef,
  showPostalAddress = undefined,
  skipInitialAppointmentSelection = false,
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
            <MultiFormButtonBar
              submitLabel={
                skipInitialAppointmentSelection ? "Speichern" : "Weiter"
              }
              submitting={isSubmitting}
              onCancel={onCancel}
            />
          </SidebarActions>
        </SidebarForm>
      )}
    </Formik>
  );
}
