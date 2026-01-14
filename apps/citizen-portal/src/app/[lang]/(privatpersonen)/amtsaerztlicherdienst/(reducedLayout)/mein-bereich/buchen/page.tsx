/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useSuspenseQueries } from "@tanstack/react-query";
import { Formik } from "formik";

import { ApiBookingState } from "@eshg/official-medical-service-api";

import { useHandleConcurrentAppointment } from "@/lib/businessModules/officialMedicalService/api/helpers";
import { usePutAppointmentCitizen } from "@/lib/businessModules/officialMedicalService/api/mutations/citizenAuthApi";
import { useGetProcedureDetails } from "@/lib/businessModules/officialMedicalService/api/queries/citizenAuthApi";
import {
  BookAppointmentFormValues,
  BookAppointmentWrapper,
} from "@/lib/businessModules/officialMedicalService/components/personalArea/bookAppointment/BookAppointmentWrapper";
import { useCitizenRoutes } from "@/lib/businessModules/officialMedicalService/shared/routes";
import { useTranslation } from "@/lib/i18n/client";
import { LogoutButton } from "@/lib/shared/components/buttons/LogoutButton";
import { PageContent } from "@/lib/shared/components/layout/PageContent";
import { PageTitle } from "@/lib/shared/components/layout/page";
import { useScopedRouter } from "@/lib/shared/components/scopedLinks";
import { useAccessCodeParam } from "@/lib/shared/helpers/accessCode";

const INITIAL_VALUES: BookAppointmentFormValues = {
  appointment: undefined,
};

export default function CitizenOmsEntryPage() {
  const { t } = useTranslation(["officialMedicalService/rebookAppointment"]);
  const [{ data: procedure }] = useSuspenseQueries({
    queries: [useGetProcedureDetails()],
  });
  const router = useScopedRouter();
  const citizenRoutes = useCitizenRoutes();
  const accessCode = useAccessCodeParam();
  const handleConcurrentAppointments = useHandleConcurrentAppointment();
  const bookAppointment = usePutAppointmentCitizen(
    procedure.appointment?.bookingState === ApiBookingState.Booked
      ? t("snackbar.rebook_success")
      : t("snackbar.book_success"),
  );

  async function handleSubmit(values: BookAppointmentFormValues) {
    if (!values.appointment) {
      return;
    }

    await bookAppointment.mutateAsync(
      {
        appointmentId: procedure.appointment?.appointmentId ?? "",
        apiAppointment: {
          start: values.appointment.start,
          end: values.appointment.end,
        },
      },
      {
        onSuccess: () =>
          router.push(citizenRoutes.personalArea.index(accessCode)),
        onError: handleConcurrentAppointments({
          message: t("common.errors.concurrentAppointment", {
            context: "errorMessage",
          }),
        }),
      },
    );
  }

  return (
    <PageContent>
      <PageTitle toolbar={<LogoutButton text={t("common.logout")} />}>
        {t("common.title")}
      </PageTitle>
      <Formik initialValues={INITIAL_VALUES} onSubmit={handleSubmit}>
        <BookAppointmentWrapper procedure={procedure} />
      </Formik>
    </PageContent>
  );
}
