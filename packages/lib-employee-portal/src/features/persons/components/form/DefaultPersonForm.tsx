/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Divider, Stack } from "@mui/joy";

import { ApiCountryCode, ApiGender, ApiSalutation } from "@eshg/base-api";
import { OptionalFieldValue } from "@eshg/lib-portal";

import { BaseAddressFormInputs } from "../../../../components/address/addressForms";
import { createEmptyAddress } from "../../../../components/address/helpers";
import { MultiFormButtonBar } from "../../../../components/form/MultiFormButtonBar";
import { SidebarActions } from "../../../drawer/components/SidebarActions";
import { SidebarContent } from "../../../drawer/components/SidebarContent";
import { PersonFormProps, PersonFormValues } from "../../types/personForm";
import { SearchPersonFormValues } from "../search/SearchPersonSidebar";

import { AddressFormSection } from "./AddressFormSection";
import { ContactInfoFormSection } from "./ContactInfoFormSection";
import { PersonalFormSection } from "./PersonalFormSection";

export interface DefaultPersonFormValues extends PersonFormValues {
  gender: OptionalFieldValue<ApiGender>;
  salutation: OptionalFieldValue<ApiSalutation>;
  title: string;
  nameAtBirth: string;
  placeOfBirth: string;
  countryOfBirth: OptionalFieldValue<ApiCountryCode>;
  emailAddresses: string[];
  phoneNumbers: string[];
  contactAddress?: BaseAddressFormInputs;
  differentBillingAddress?: BaseAddressFormInputs;
}

export function defaultPersonFormValues({
  inputs,
  addressRequired,
}: {
  inputs: SearchPersonFormValues;
  addressRequired?: boolean;
}): DefaultPersonFormValues {
  return {
    firstName: inputs.firstName,
    lastName: inputs.lastName,
    dateOfBirth: inputs.dateOfBirth,
    title: "",
    salutation: "",
    gender: "",
    nameAtBirth: "",
    placeOfBirth: "",
    countryOfBirth: "",
    emailAddresses: [""],
    phoneNumbers: [""],
    contactAddress: addressRequired ? createEmptyAddress() : undefined,
    differentBillingAddress: undefined,
  };
}

export function DefaultPersonForm<TValues extends DefaultPersonFormValues>(
  props: PersonFormProps<TValues>,
) {
  return (
    <>
      <SidebarContent title={props.title} subtitle={props.subtitle}>
        <Stack gap={3}>
          <PersonalFormSection {...props} />
          <Divider />
          <AddressFormSection {...props} />
          <Divider />
          <ContactInfoFormSection />
        </Stack>
      </SidebarContent>
      <SidebarActions>
        <MultiFormButtonBar
          submitting={props.isSubmitting}
          submitLabel={props.submitLabel}
          onBack={props.onBack}
          onCancel={props.onCancel}
          onDelete={props.onDelete}
        />
      </SidebarActions>
    </>
  );
}
