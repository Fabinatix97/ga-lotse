/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { isObjectType } from "remeda";

import {
  mapApiAddressToForm,
  mapBaseAddressToApi,
} from "@eshg/lib-employee-portal";
import {
  AlertProps as SharedAlertProps,
  isAdult,
  mapOptionalValue,
} from "@eshg/lib-portal";
import {
  ApiDraftMeaslesProcedure,
  ApiFacility,
  ApiMeaslesProtectionProcedure,
  ApiPutFacilityRequest,
  ApiReportData,
  ApiReportingReason,
  ApiRoleStatus,
  ApiUpdateProcedureRequest,
} from "@eshg/measles-protection-api";

import { MeaslesProtectionFacilityFormValues } from "@/lib/businessModules/measlesProtection/components/procedures/procedureDetails/NewFacilitySidebar";
import { ReferenceFacilityWithOptionalMeaslesFacilityType } from "@/lib/shared/components/facilitySidebar/FacilityDetailsSidebar";
import { DefaultFacilityFormValues } from "@/lib/shared/components/facilitySidebar/create/FacilityForm";
import { mapApiContactPersonToForm } from "@/lib/shared/helpers/facilityUtils";

export interface UpdateProcedureForm {
  reportData: {
    [K in keyof Omit<ApiReportData, "reportingDate">]:
      | Required<ApiReportData[K]>
      | "";
  } & { reportingDate: string };
  // TODO backend needs to be modified
  roleStatus: ApiRoleStatus | "";
}

export const UPDATE_PROCEDURE_SUCCESS_MESSAGE =
  "Die Zusatzinfos wurde erfolgreich geändert.";
export const CLOSE_PROCEDURE_SUCCESS_MESSAGE =
  "Vorgang wurde erfolgreich abgeschlossen";
export const REOPEN_PROCEDURE_SUCCESS_MESSAGE =
  "Vorgang wurde erfolgreich wiedereröffnet";

export type SubmitProcedure = (
  form: ValidUpdateProcedureForm,
) => void | Promise<unknown>;

export type ValidUpdateProcedureForm<T = UpdateProcedureForm> = T extends object
  ? {
      [K in keyof T]: ValidUpdateProcedureForm<T[K]>;
    }
  : T extends ""
    ? Exclude<T, "">
    : T;

type FormErrors = Partial<
  Record<
    keyof UpdateProcedureForm | "additionalErrors",
    ReturnType<typeof validateProcedure>
  >
>;

export type FormValidator = (form: UpdateProcedureForm) => FormErrors;

export function transformToValid<T = UpdateProcedureForm>(
  current: T,
): ValidUpdateProcedureForm<T> {
  if (isObjectType(current)) {
    return Object.fromEntries(
      Object.entries(current).map(([key, value]) => [
        key,
        transformToValid(value),
      ]),
    ) as ValidUpdateProcedureForm<T>;
  }
  if (current === "") {
    return undefined as ValidUpdateProcedureForm<T>;
  }
  return current as ValidUpdateProcedureForm<T>;
}

export function mapProcedureToAdditionalInfoForm(
  procedure: ApiMeaslesProtectionProcedure | ApiDraftMeaslesProcedure,
): UpdateProcedureForm {
  return {
    reportData: {
      commentReportingReason: "",
      reportingReason: "",
      ...procedure.reportData,
      reportingDate:
        procedure.reportData?.reportingDate.toISOString().slice(0, 10) ?? "",
    },
    roleStatus: procedure.affectedPerson.roleStatus ?? "",
  };
}

export type ErrorMessage = Pick<SharedAlertProps, "title" | "message">;
export const DRAFT_PROCEDURE_ERROR_MESSAGES = {
  missingFacility: {
    title: "Einrichtung hinzufügen",
    message:
      "Um einen Vorgang anzulegen, muss eine Einrichtung zugeordnet werden.",
  },
  missingCustodian: {
    title: "Personensorgeberechtigte:r hinzufügen",
    message:
      "Um einen Vorgang mit einer minderjährigen betroffenen Person anzulegen, muss mindestens eine Personensorgeberechtigte angegeben werden.",
  },
} as const satisfies Record<string, ErrorMessage>;

export function validateProcedure(
  proc: ApiMeaslesProtectionProcedure | ApiDraftMeaslesProcedure,
) {
  let errors: (keyof typeof DRAFT_PROCEDURE_ERROR_MESSAGES)[] = [];
  const numberCustodians =
    (proc.custodians?.length ?? 0) + (proc.custodiansWithoutDoB?.length ?? 0);
  if (!isAdult(proc.affectedPerson.dateOfBirth) && numberCustodians < 1) {
    errors = [...errors, "missingCustodian"];
  }
  if (!proc.facility) {
    errors = [...errors, "missingFacility"];
  }
  if (errors.length === 0) {
    return;
  }
  return errors.map((t) => DRAFT_PROCEDURE_ERROR_MESSAGES[t]);
}

export function mapAdditionalInfoFormToApi(
  form: ValidUpdateProcedureForm,
): ApiUpdateProcedureRequest {
  return {
    ...form,
    reportData: form.reportData && {
      ...form.reportData,
      reportingDate: form.reportData.reportingDate
        ? new Date(form.reportData.reportingDate)
        : undefined,
      commentReportingReason:
        form.reportData.reportingReason === ApiReportingReason.Other
          ? form.reportData.commentReportingReason
          : undefined,
    },
  };
}

type PersonType = "AffectedPerson" | "Custodian";

interface DisplayPerson {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  personType: PersonType;
}

const defaultPerson = {
  firstName: "Vorname",
  lastName: "Nachname",
  dateOfBirth: new Date("1970-1-1"),
  personType: "AffectedPerson",
} as DisplayPerson;

export function getPersonByIdFromProcedure(
  personId: string,
  procedure: ApiMeaslesProtectionProcedure | ApiDraftMeaslesProcedure,
): DisplayPerson {
  const affectedPerson = procedure.affectedPerson ?? {};
  const custodians = procedure.custodians ?? [];

  if (affectedPerson.id === personId) {
    return { ...affectedPerson, personType: "AffectedPerson" };
  }

  const recipient =
    custodians.find((custodian) => custodian.custodianId === personId) ??
    defaultPerson;
  return { ...recipient, personType: "Custodian" };
}

function getPersonPrefix(type: PersonType) {
  switch (type) {
    case "Custodian":
      return "PSB - ";
    case "AffectedPerson":
    default:
      return "";
  }
}

export function formatName(
  person: {
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    personType?: PersonType;
  },
  customPrefix?: string,
) {
  let prefix = person.personType ? getPersonPrefix(person.personType) : "";
  prefix = customPrefix ?? prefix;
  return `${prefix}${person.firstName} ${person.lastName}`;
}

export function mapToDefaultFacilityFormValues(
  facility: ReferenceFacilityWithOptionalMeaslesFacilityType,
): MeaslesProtectionFacilityFormValues {
  return {
    name: facility.name,
    contactAddress: mapApiAddressToForm(facility.contactAddress!),
    contactPersons:
      facility.contactPersons?.map(mapApiContactPersonToForm) ?? [],
    emailAddresses: facility.emailAddresses,
    phoneNumbers: facility.phoneNumbers,
    measlesFacilityType: facility.measlesFacilityType
      ? {
          type: facility.measlesFacilityType.type,
          otherFacilityTypeInformation:
            facility.measlesFacilityType.otherFacilityTypeInformation,
        }
      : undefined,
  };
}

export function mapApiFacilityToDefaultFacilityFormValues(
  facility: ApiFacility,
): DefaultFacilityFormValues {
  return {
    name: facility.name,
    contactAddress: mapApiAddressToForm(facility.contactAddress),
    differentBillingAddress: facility.differentBillingAddress
      ? mapApiAddressToForm(facility.differentBillingAddress)
      : undefined,
    contactPersons:
      facility.contactPersons?.map(mapApiContactPersonToForm) ?? [],
    emailAddresses: facility.emailAddress ? [facility.emailAddress] : [],
    phoneNumbers: facility.phoneNumber ? [facility.phoneNumber] : [],
  };
}

export function mapDefaultFacilityFormValuesToApiPutFacilityRequest(
  facility: DefaultFacilityFormValues,
): ApiPutFacilityRequest {
  return {
    updatedFacility: {
      ...facility,
      contactAddress: mapBaseAddressToApi(facility.contactAddress),
      differentBillingAddress: facility.differentBillingAddress
        ? mapBaseAddressToApi(facility.differentBillingAddress)
        : undefined,
      contactPersons: facility.contactPersons?.map((person) => ({
        ...person,
        firstName: mapOptionalValue(person.firstName),
        emailAddress: mapOptionalValue(person.emailAddress),
        phoneNumber: mapOptionalValue(person.phoneNumber),
        salutation: mapOptionalValue(person.salutation),
        title: mapOptionalValue(person.title),
        role: mapOptionalValue(person.role),
      })),
    },
  };
}
