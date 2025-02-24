/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { durationBetweenDatesInMinutes } from "@eshg/lib-portal/helpers/dateTime";
import { mapOptionalValue } from "@eshg/lib-portal/helpers/form";
import { PostCitizenProcedureRequest } from "@eshg/official-medical-service-api";
import { isDefined, isEmpty } from "remeda";

import { AppointmentFormValues } from "@/lib/businessModules/officialMedicalService/components/appointment/AppointmentForm";

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
        appointmentType: "OFFICIAL_MEDICAL_SERVICE_SHORT", // ToDo: change in upcoming ticket
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
      // ToDo: change in upcoming ticket
      concern: {
        categoryNameDe: "categoryNameDe",
        categoryNameEn: "categoryNameEn",
        highPriority: true,
        nameDe: "nameDe",
        nameEn: "nameEn",
        version: 0,
        visibleInOnlinePortal: true,
      },
    },
  };
}
