/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiAddPersonFileStateRequest,
  ApiGetReferenceFacilityResponse,
} from "@eshg/base-api";
import {
  ApiAffectedPerson,
  ApiFacility,
  ApiPatchAffectedPersonRequest,
  ApiPatchEmployeeOmsProcedureFacilityRequest,
  ApiPostEmployeeOmsProcedureRequest,
  ApiProcedureStatus,
} from "@eshg/official-medical-service-api";

import { DefaultFacilityFormValues } from "@/lib/shared/components/facilitySidebar/create/FacilityForm";
import {
  mapApiAddressToForm,
  mapBaseAddressToApi,
} from "@/lib/shared/components/form/address/helpers";
import { DefaultPersonFormValues } from "@/lib/shared/components/personSidebar/form/DefaultPersonForm";
import {
  mapToPersonAddRequest,
  mapToPersonUpdateRequest,
} from "@/lib/shared/components/personSidebar/helpers";
import {
  mapApiContactPersonToForm,
  mapContactPersonToApi,
} from "@/lib/shared/helpers/facilityUtils";

export function mapToAffectedPerson(
  person: ApiAddPersonFileStateRequest,
): ApiAffectedPerson {
  return {
    ...person,
    contactAddress: person.contactAddress!,
    version: 0,
  };
}

export function mapToCreateProcedureRequest(
  values: DefaultPersonFormValues,
): ApiPostEmployeeOmsProcedureRequest {
  const person = mapToPersonAddRequest(values);
  return {
    affectedPerson: mapToAffectedPerson(person),
  };
}

export function mapToAffectedPersonWithVersionNumber(
  person: ApiAddPersonFileStateRequest & { version: number },
): ApiAffectedPerson {
  return {
    ...person,
    contactAddress: person.contactAddress!,
  };
}

export function mapToPatchAffectedPersonRequest(
  values: DefaultPersonFormValues,
  version: number,
): ApiPatchAffectedPersonRequest {
  const person = mapToPersonUpdateRequest(values, version);
  return {
    affectedPerson: mapToAffectedPersonWithVersionNumber(person),
  };
}

export function mapToDefaultFacilityFormValues(
  facility: ApiGetReferenceFacilityResponse,
): DefaultFacilityFormValues {
  return {
    name: facility.name,
    contactAddress: mapApiAddressToForm(facility.contactAddress!),
    contactPersons:
      facility.contactPersons?.map(mapApiContactPersonToForm) ?? [],
    emailAddresses: facility.emailAddresses,
    phoneNumbers: facility.phoneNumbers,
  };
}

export function mapApiFacilityToDefaultFacilityFormValues(
  facility: ApiFacility,
): DefaultFacilityFormValues {
  return {
    name: facility.name,
    contactAddress: mapApiAddressToForm(facility.contactAddress!),
    contactPersons:
      facility.contactPersons?.map(mapApiContactPersonToForm) ?? [],
    emailAddresses: facility.emailAddresses ?? [],
    phoneNumbers: facility.phoneNumbers ?? [],
  };
}

export function mapToApiPatchFacilityRequest(
  facility: DefaultFacilityFormValues,
  version: number,
): ApiPatchEmployeeOmsProcedureFacilityRequest {
  return {
    updatedFacility: {
      version: version,
      name: facility.name,
      contactAddress: mapBaseAddressToApi(facility.contactAddress!),
      contactPersons: facility.contactPersons?.map(mapContactPersonToApi) ?? [],
      emailAddresses: facility.emailAddresses ?? [],
      phoneNumbers: facility.phoneNumbers ?? [],
    },
  };
}

export function isProcedureFinalized(procedure: {
  status: ApiProcedureStatus;
}): boolean {
  const finalizedStates: ApiProcedureStatus[] = [
    ApiProcedureStatus.Closed,
    ApiProcedureStatus.Aborted,
  ];
  return finalizedStates.includes(procedure.status);
}

export function isProcedureOpenOrInProgress(procedure: {
  status: ApiProcedureStatus;
}): boolean {
  const openOrInProgressStates: ApiProcedureStatus[] = [
    ApiProcedureStatus.Open,
    ApiProcedureStatus.InProgress,
  ];
  return openOrInProgressStates.includes(procedure.status);
}
