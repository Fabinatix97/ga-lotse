/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { differenceInMinutes } from "date-fns/differenceInMinutes";

import { GENDER_OPTIONS } from "@eshg/lib-portal/components/formFields/constants";
import { mapOptionalValue } from "@eshg/lib-portal/helpers/form";
import { isNonEmptyString } from "@eshg/lib-portal/helpers/guards";
import {
  ApiAppointmentBookingType,
  ApiCreateFollowUpProcedureRequest,
  ApiCreateProcedureRequest,
  ApiGender,
} from "@eshg/sti-protection-api";

import {
  AddNewProcedureForm,
  CombinedAppointmentForm,
} from "@/lib/businessModules/stiProtection/features/procedures/addNewProcedure/AddNewProcedureSidebar";
import { CreateFollowUpProcedureForm } from "@/lib/businessModules/stiProtection/features/procedures/details/CreateFollowUpProcedureSidebar";
import {
  deleteUndefined,
  optionalInt,
} from "@/lib/businessModules/stiProtection/shared/helpers";

import { CONCERN_OPTIONS } from "./helpers";

export function mapFollowUpProcedureFormToApi(
  form: CreateFollowUpProcedureForm,
): ApiCreateFollowUpProcedureRequest {
  if (!form.appointmentBookingType) {
    throw new Error("Appointment booking type must be defined");
  }

  const isCustomAppointment =
    form.appointmentBookingType === ApiAppointmentBookingType.UserDefined;

  const appointmentStart = isCustomAppointment
    ? new Date(form.customAppointmentDate)
    : form.blockAppointment?.start;

  if (!appointmentStart) {
    throw new Error("Appointment start must be defined");
  }

  const blockAppointmentEnd = form.blockAppointment?.end;
  if (!isCustomAppointment && blockAppointmentEnd == null) {
    throw new Error("Appointment end must be defined");
  }

  return deleteUndefined({
    appointmentBookingType: form.appointmentBookingType,
    concern: CONCERN_OPTIONS.find((t) => t.value === form.concern)?.value,
    durationInMinutes: isCustomAppointment
      ? optionalInt(form.customAppointmentDuration)
      : differenceInMinutes(blockAppointmentEnd!, appointmentStart),
    appointmentStart,
  });
}

export function mapProcedureFormToApi(
  form: AddNewProcedureForm,
): ApiCreateProcedureRequest {
  if (!form.yearOfBirth) {
    throw new Error("Year of birth must be defined");
  }
  if (!form.appointmentBookingType) {
    throw new Error("Appointment booking type must be defined");
  }

  return deleteUndefined({
    ...mapFollowUpProcedureFormToApi(form),
    pronouns: mapOptionalValue(form.pronouns),
    gender: GENDER_OPTIONS.find((t) => t.value === form.gender)?.value as
      | ApiGender
      | undefined,
    hasSufficientGermanLanguageSkills:
      form.hasSufficientGermanLanguageSkills ?? undefined,
    otherKnownLanguages: mapOptionalValue(form.otherKnownLanguages),
    yearOfBirth: parseInt(form.yearOfBirth, 10),
  });
}

export function getAppointmentDate(form: CombinedAppointmentForm) {
  const customAppointmentDate = isNonEmptyString(form.customAppointmentDate)
    ? new Date(form.customAppointmentDate)
    : undefined;
  const date =
    form.appointmentBookingType === ApiAppointmentBookingType.AppointmentBlock
      ? form.blockAppointment?.start
      : customAppointmentDate;
  return date ?? undefined;
}
