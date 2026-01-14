/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiAddCentralFileIdToGdprProcedureRequest,
  ApiAddGdprProcedureRequest,
} from "@eshg/base-api";
import { mapBaseAddressToApi } from "@eshg/lib-employee-portal";
import {
  mapOptionalValue,
  mapRequiredValue,
  toUtcDate,
} from "@eshg/lib-portal";

import { GDPRProcedureFormInputs } from "@/lib/baseModule/components/gdpr/overview/CreateGDPRProcedureSidebar";

export function mapAddGdprProcedureRequest(
  values: GDPRProcedureFormInputs,
): ApiAddGdprProcedureRequest {
  return {
    type: mapRequiredValue(values.type),
    identificationData: {
      type: "GdprPerson",
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      phoneNumber: mapOptionalValue(values.phoneNumber.trim()),
      title: mapOptionalValue(values.title.trim()),
      dateOfBirth: toUtcDate(values.dateOfBirth),
      address: mapBaseAddressToApi(values.address),
      emailAddress: mapOptionalValue(values.emailAddress.trim()),
      salutation: mapOptionalValue(values.salutation),
    },
  };
}

export function mapAddCentralFileIdToGdprProcedureRequest(
  selectedId: string,
  procedureVersion: number,
): ApiAddCentralFileIdToGdprProcedureRequest {
  return {
    centralFileIds: [selectedId],
    version: procedureVersion,
  };
}
