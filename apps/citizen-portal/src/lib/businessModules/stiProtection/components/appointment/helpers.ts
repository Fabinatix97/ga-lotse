/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import assert from "assert";
import { differenceInMinutes } from "date-fns";

import {
  YesOrNoFieldData,
  mapOptionalValue,
  mapYesOrNoToBool,
  validateRange,
} from "@eshg/lib-portal";
import {
  ApiAddPersonalDetailsRequest,
  ApiAppointment,
  ApiConcern,
  ApiCreateAnonymousUserRequest,
  ApiGender,
} from "@eshg/sti-protection-api";

import { AppointmentFormData } from "./AppointmentStepper";
import { parsePin } from "./PinField";

export function mapToBookAppointment({
  appointment,
  concern,
}: {
  appointment: ApiAppointment;
  concern: ApiConcern;
}) {
  return {
    appointmentStart: appointment.start,
    concern,
    durationInMinutes: differenceInMinutes(appointment.end, appointment.start),
  };
}

type InvalidYearRangeMessage = (minYear: number, maxYear: number) => string;
export function validateYearWithinRange(
  minYear: number,
  maxYear: number,
  message: InvalidYearRangeMessage,
) {
  return (year: number | "") => {
    if (!year || isNaN(year)) {
      return;
    }
    if (validateRange(minYear, maxYear)(year)) {
      return message(minYear, maxYear);
    }
  };
}

export interface PersonalData {
  gender: ApiGender;
  birthYear: number;
  pronouns: string;
  hasSufficientGermanLanguageSkills: YesOrNoFieldData;
  otherKnownLanguages: string;
}

export function mapToAddPersonalDetails(
  data: AppointmentFormData,
): ApiAddPersonalDetailsRequest {
  const { concern, gender, birthYear, appointment } = data;
  assert.ok(gender);
  assert.ok(birthYear);
  assert.ok(appointment);

  return {
    gender,
    yearOfBirth: birthYear.toString(),
    pronouns: mapOptionalValue(data.pronouns),
    hasSufficientGermanLanguageSkills: mapYesOrNoToBool(
      data.hasSufficientGermanLanguageSkills ?? null,
    ),
    otherKnownLanguages: mapOptionalValue(data.otherKnownLanguages),
    appointmentBooking: mapToBookAppointment({
      concern,
      appointment,
    }),
  };
}

export function mapToCreateUser(
  formData: AppointmentFormData,
): ApiCreateAnonymousUserRequest {
  const { pin } = formData;
  assert.ok(pin);
  return {
    pin: parsePin(pin),
    personalDetails: mapToAddPersonalDetails(formData),
  };
}
