/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiAddFacilityFileStateRequest,
  ApiAddFacilityFileStateRequestContactAddress,
  ApiAffectedPerson,
  ApiCountryCode,
  ApiCustodianDetails,
  ApiDomesticAddress,
  ApiFacilityContactPerson,
  ApiGender,
  ApiMPFacilityType,
  ApiReportCaseRequest,
  ApiReportData,
  ApiRoleStatus,
  ApiSalutation,
} from "@eshg/citizen-portal-api/measlesProtection";
import { OptionalFieldValue } from "@eshg/lib-portal/types/form";

export interface AffectedPersonFormInputs
  extends Omit<
    ApiAffectedPerson,
    "roleStatus" | "gender" | "dateOfBirth" | "salutation" | "address"
  > {
  gender: OptionalFieldValue<ApiGender>;
  dateOfBirth: string;
  salutation: OptionalFieldValue<ApiSalutation>;
  custodians?: CustodianFormInputs[];
  address: ApiDomesticAddress;
  roleStatus: ApiRoleStatus | "";
  reportData: {
    [K in keyof Omit<ApiReportData, "reportingDate">]:
      | Required<ApiReportData[K]>
      | "";
  } & { reportingDate: string };
}

export interface CustodianFormInputs
  extends Omit<
    ApiCustodianDetails,
    "gender" | "dateOfBirth" | "salutation" | "address"
  > {
  gender: OptionalFieldValue<ApiGender>;
  dateOfBirth: string;
  salutation: OptionalFieldValue<ApiSalutation>;
  address: ApiDomesticAddress;
}

export type FacilityContactAddressFormInputs =
  ApiAddFacilityFileStateRequestContactAddress & {
    country: OptionalFieldValue<ApiCountryCode>;
  };

export type FacilityContactPersonFormInputs = ApiFacilityContactPerson & {
  salutation?: OptionalFieldValue<ApiSalutation>;
};

export interface FacilityFormInputs extends ApiAddFacilityFileStateRequest {
  type: OptionalFieldValue<ApiMPFacilityType>;
  contactAddress: FacilityContactAddressFormInputs;
  contactPersons: FacilityContactPersonFormInputs[];
}

export interface ReportMeaslesCase
  extends Omit<
    ApiReportCaseRequest,
    "affectedPersons" | "type" | "roleReportData"
  > {
  affectedPersons: AffectedPersonFormInputs[];
  facility: FacilityFormInputs;
  otherFacilityTypeInformation?: string;
  type: OptionalFieldValue<ApiMPFacilityType>;
}
