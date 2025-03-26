/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { mapOptionalValue } from "@eshg/lib-portal/helpers/form";
import { validateRange } from "@eshg/lib-portal/helpers/validators";
import {
  ApiAddPersonalDetailsRequest,
  ApiAppointment,
  ApiConcern,
  ApiCountryCode,
  ApiCreateAnonymousUserRequest,
  ApiGender,
} from "@eshg/sti-protection-api";
import assert from "assert";
import { differenceInMinutes } from "date-fns";

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

export type InvalidYearRangeMessage = (
  minYear: number,
  maxYear: number,
) => string;
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
  countryOfBirth: ApiCountryCode | null;
  inGermanySince: number | "";
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
    yearOfBirth: birthYear,
    countryOfBirth: data.countryOfBirth ?? undefined,
    inGermanySince: mapOptionalValue(data.inGermanySince),
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
