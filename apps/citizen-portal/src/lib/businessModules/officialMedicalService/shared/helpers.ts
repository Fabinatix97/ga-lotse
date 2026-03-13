/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { isDefined, isEmpty } from "remeda";

import {
  durationBetweenDatesInMinutes,
  mapOptionalValue,
} from "@eshg/lib-portal";
import {
  ApiAppointmentType,
  ApiConcern,
  ApiConcernCategoryConfig,
  PostCitizenProcedureRequest,
} from "@eshg/official-medical-service-api";

import { AppointmentFormValues } from "@/lib/businessModules/officialMedicalService/components/appointment/AppointmentForm";

export function mapToConcernApiList(
  val: ApiConcernCategoryConfig,
): ApiConcern[] {
  const newArray: ApiConcern[] = [];
  val.concerns.forEach((concern) => {
    newArray.push({
      appointmentType: mapOptionalValue(concern.appointmentType),
      categoryNames: val.names,
      highPriority: concern.highPriority,
      names: concern.names,
      version: 0,
      visibleInOnlinePortal: true,
    });
  });
  return newArray;
}

export function mapToPostCitizenProcedureRequest(
  values: AppointmentFormValues,
): PostCitizenProcedureRequest {
  return {
    files: values.files as Blob[],
    request: {
      affectedPerson: {
        salutation: mapOptionalValue(values.affectedPerson.salutation),
        title: mapOptionalValue(values.affectedPerson.title),
        firstName: values.affectedPerson.firstName,
        lastName: values.affectedPerson.lastName,
        nameAtBirth: mapEmptyStringToUndefined(
          values.affectedPerson.nameAtBirth?.trim(),
        ),
        dateOfBirth: new Date(values.affectedPerson.dateOfBirth),
        contactAddress: {
          type: "DomesticAddress",
          street: values.affectedPerson.contactAddress.street,
          houseNumber: values.affectedPerson.contactAddress.houseNumber,
          addressAddition: mapOptionalValue(
            values.affectedPerson.contactAddress.addressAddition?.trim(),
          ),
          postalCode: values.affectedPerson.contactAddress.postalCode,
          city: values.affectedPerson.contactAddress.city,
          country: "DE",
        },
        emailAddresses: [values.affectedPerson.emailAddresses],
        phoneNumbers: !isEmpty(values.affectedPerson.phoneNumbers)
          ? [values.affectedPerson.phoneNumbers?.trim()]
          : undefined,
        version: 0,
      },
      appointment: {
        appointmentType:
          mapOptionalValue(values.concern.appointmentType) ??
          ApiAppointmentType.OfficialMedicalServiceShort,
        bookingInfo: {
          bookingType: "APPOINTMENT_BLOCK",
          duration: isDefined(values.appointment)
            ? durationBetweenDatesInMinutes(
                values.appointment.start,
                values.appointment.end,
              )
            : 0,
          start: values.appointment!.start,
        },
      },
      concern: {
        appointmentType: mapOptionalValue(values.concern.appointmentType),
        categoryNames: values.concern.categoryNames,
        highPriority: values.concern.highPriority,
        names: values.concern.names,
        version: 0,
        visibleInOnlinePortal: true,
      },
    },
  };
}

// For some reason a falsy check alone doesn't necessarily work
function mapEmptyStringToUndefined(s: string | undefined): string | undefined {
  if (!s) {
    return undefined;
  }
  if (s.length === 0) return undefined;
  return s;
}
