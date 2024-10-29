/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiDraftMeaslesProcedure,
  ApiMeaslesProtectionProcedure,
  ApiReportData,
  ApiReportingReason,
  ApiRoleStatus,
  ApiUpdateProcedureRequest,
} from "@eshg/employee-portal-api/measlesProtection";
import { AlertProps as SharedAlertProps } from "@eshg/lib-portal/components/Alert";
import { isAdult } from "@eshg/lib-portal/helpers/dateTime";
import { isObjectType } from "remeda";

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
  if (
    !isAdult(proc.affectedPerson.dateOfBirth) &&
    (proc.custodians?.length ?? 0) < 1
  ) {
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

export type PersonType = "AffectedPerson" | "Custodian";

export interface DisplayPerson {
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
