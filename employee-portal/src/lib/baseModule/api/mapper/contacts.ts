/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiAddContactRequest, ApiUpdateContactRequest } from "@eshg/base-api";
import { mapBaseAddressToApi } from "@eshg/lib-employee-portal";
import {
  dropBlankStrings,
  mapOptionalValue,
  mapRequiredValue,
} from "@eshg/lib-portal";

import {
  mapOptionalMergeValue,
  mapRequiredMergeValue,
} from "@/lib/baseModule/components/contacts/forms/helpers";
import {
  ContactFormValues,
  MergeInstitutionContactFormValues,
  MergePersonContactFormValues,
} from "@/lib/baseModule/components/contacts/types";

export function mapAddContactRequest(
  values: ContactFormValues,
): ApiAddContactRequest {
  switch (values.type) {
    case "AddPersonContactRequest":
      return {
        type: "AddPersonContactRequest",
        name: values.name.trim(),
        firstName: mapOptionalValue(values.firstName.trim()),
        gender: mapOptionalValue(values.gender),
        title: mapOptionalValue(values.title),
        salutation: mapOptionalValue(values.salutation),
        externalChatUsername: mapOptionalValue(
          values.externalChatUsername.trim(),
        ),
        phoneNumbers: dropBlankStrings(values.phoneNumbers),
        emailAddresses: dropBlankStrings(values.emailAddresses),
        contactAddress: mapBaseAddressToApi(values.contactAddress),
        differentBillingAddress: mapBaseAddressToApi(
          values.differentBillingAddress,
        ),
      };
    case "AddInstitutionContactRequest":
      return {
        type: "AddInstitutionContactRequest",
        name: values.name.trim(),
        category: mapRequiredValue(values.category),
        phoneNumbers: dropBlankStrings(values.phoneNumbers),
        emailAddresses: dropBlankStrings(values.emailAddresses),
        contactAddress: mapBaseAddressToApi(values.contactAddress),
        differentBillingAddress: mapBaseAddressToApi(
          values.differentBillingAddress,
        ),
      };
  }
}

export function mapImportMergeContactRequest(
  values: MergePersonContactFormValues | MergeInstitutionContactFormValues,
  mergedFrom?: string,
): ApiUpdateContactRequest {
  switch (values.type) {
    case "UpdatePersonContactRequest":
      return {
        type: "UpdatePersonContactRequest",
        name: mapRequiredMergeValue(values.name).trim(),
        firstName: mapOptionalMergeValue(values.firstName)?.trim(),
        gender: mapOptionalMergeValue(values.gender),
        title: mapOptionalMergeValue(values.title),
        salutation: mapOptionalMergeValue(values.salutation),
        externalChatUsername: mapOptionalMergeValue(
          values.externalChatUsername,
        )?.trim(),
        phoneNumbers: dropBlankStrings(values.phoneNumbers),
        emailAddresses: dropBlankStrings(values.emailAddresses),
        contactAddress: mapBaseAddressToApi(values.contactAddress),
        differentBillingAddress: mapBaseAddressToApi(
          values.differentBillingAddress,
        ),
        mergedFrom,
      };
    case "UpdateInstitutionContactRequest":
      return {
        type: "UpdateInstitutionContactRequest",
        name: mapRequiredMergeValue(values.name).trim(),
        category: mapRequiredMergeValue(values.category),
        phoneNumbers: dropBlankStrings(values.phoneNumbers),
        emailAddresses: dropBlankStrings(values.emailAddresses),
        contactAddress: mapBaseAddressToApi(values.contactAddress),
        differentBillingAddress: mapBaseAddressToApi(
          values.differentBillingAddress,
        ),
        mergedFrom,
      };
  }
}

export function mapUpdateContactRequest(
  values: ContactFormValues,
): ApiUpdateContactRequest {
  switch (values.type) {
    case "AddPersonContactRequest":
      return {
        type: "UpdatePersonContactRequest",
        name: mapRequiredMergeValue(values.name).trim(),
        firstName: mapOptionalMergeValue(values.firstName)?.trim(),
        gender: mapOptionalMergeValue(values.gender),
        title: mapOptionalMergeValue(values.title),
        salutation: mapOptionalMergeValue(values.salutation),
        externalChatUsername: mapOptionalMergeValue(
          values.externalChatUsername,
        )?.trim(),
        phoneNumbers: dropBlankStrings(values.phoneNumbers),
        emailAddresses: dropBlankStrings(values.emailAddresses),
        contactAddress: mapBaseAddressToApi(values.contactAddress),
        differentBillingAddress: mapBaseAddressToApi(
          values.differentBillingAddress,
        ),
      };
    case "AddInstitutionContactRequest":
      return {
        type: "UpdateInstitutionContactRequest",
        name: mapRequiredMergeValue(values.name).trim(),
        category: mapOptionalValue(values.category),
        phoneNumbers: dropBlankStrings(values.phoneNumbers),
        emailAddresses: dropBlankStrings(values.emailAddresses),
        contactAddress: mapBaseAddressToApi(values.contactAddress),
        differentBillingAddress: mapBaseAddressToApi(
          values.differentBillingAddress,
        ),
      };
  }
}
