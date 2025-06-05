/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiContactCategory,
  ApiContactSubCategory,
  ApiGender,
  ApiInstitutionContact,
  ApiPersonContact,
  ApiSalutation,
} from "@eshg/base-api";
import { BaseAddressFormInputs } from "@eshg/lib-employee-portal";
import { OptionalFieldValue } from "@eshg/lib-portal";

import {
  OptionalMergeValue,
  RequiredMergeValue,
} from "@/lib/baseModule/components/contacts/forms/helpers";

export type PersonContactWithNameAtBirth = ApiPersonContact & {
  nameAtBirth?: string;
};

export type ContactFormValues =
  | PersonContactFormValues
  | InstitutionContactFormValues;

export interface PersonContactFormValues {
  type: "AddPersonContactRequest";
  title: string;
  gender: OptionalFieldValue<ApiGender>;
  salutation: OptionalFieldValue<ApiSalutation>;
  name: string;
  firstName: string;
  nameAtBirth: string;
  externalChatUsername: string;
  emailAddresses: string[];
  phoneNumbers: string[];
  contactAddress: BaseAddressFormInputs | undefined;
  differentBillingAddress: BaseAddressFormInputs | undefined;
}

export interface InstitutionContactFormValues {
  type: "AddInstitutionContactRequest";
  category: OptionalFieldValue<ApiContactCategory>;
  subCategory: OptionalFieldValue<ApiContactSubCategory>;
  name: string;
  emailAddresses: string[];
  phoneNumbers: string[];
  contactAddress: BaseAddressFormInputs;
  differentBillingAddress?: BaseAddressFormInputs;
}

export interface MergePersonContactFormValues {
  type: "UpdatePersonContactRequest";
  title: RequiredMergeValue<string>;
  gender: OptionalMergeValue<ApiGender>;
  salutation: OptionalMergeValue<ApiSalutation>;
  name: RequiredMergeValue<string>;
  firstName: RequiredMergeValue<string>;
  nameAtBirth: OptionalMergeValue<string>;
  externalChatUsername: OptionalMergeValue<string>;
  emailAddresses: string[];
  phoneNumbers: string[];
  contactAddress: BaseAddressFormInputs | undefined;
  differentBillingAddress: BaseAddressFormInputs | undefined;
}

export interface MergeInstitutionContactFormValues {
  type: "UpdateInstitutionContactRequest";
  category: RequiredMergeValue<ApiContactCategory>;
  subCategory: OptionalMergeValue<ApiContactSubCategory>;
  name: RequiredMergeValue<string>;
  emailAddresses: string[];
  phoneNumbers: string[];
  contactAddress: BaseAddressFormInputs;
  differentBillingAddress?: BaseAddressFormInputs;
}

type MergeSource<TForm, TApiModel> =
  | {
      type: "Entity";
      data: TApiModel;
    }
  | {
      type: "Import";
      data: TForm;
    };

export type InstitutionContactMergeSource = MergeSource<
  InstitutionContactFormValues,
  ApiInstitutionContact
>;

export type PersonContactMergeSource = MergeSource<
  PersonContactFormValues,
  PersonContactWithNameAtBirth
>;

export type AddContactSidebarState<TForm, TApiModel> =
  | {
      flowStep: "CREATE";
      initialValues: TForm;
    }
  | {
      flowStep: "IMPORT" | "SEARCH";
    }
  | {
      flowStep: "MERGE";
      into: TApiModel;
      from: MergeSource<TForm, TApiModel>;
    };
