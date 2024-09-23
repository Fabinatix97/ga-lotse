/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiAddCentralFileIdToGdprProcedureRequest,
  ApiAddGdprProcedureRequest,
  ApiGetReferencePersonResponse,
} from "@eshg/employee-portal-api/base";
import { toUtcDate } from "@eshg/lib-portal/helpers/dateTime";
import {
  mapOptionalValue,
  mapRequiredValue,
} from "@eshg/lib-portal/helpers/form";

import { GDPRProcedureFormInputs } from "@/lib/baseModule/components/gdpr/overview/CreateGDPRProcedureSidebar";
import { mapBaseAddressToApi } from "@/lib/shared/components/form/address/helpers";

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
  selected: ApiGetReferencePersonResponse,
  procedureVersion: number,
): ApiAddCentralFileIdToGdprProcedureRequest {
  return {
    centralFileId: selected.id,
    version: procedureVersion,
  };
}
