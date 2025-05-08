/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useQueryClient, useSuspenseQueries } from "@tanstack/react-query";
import { Formik } from "formik";
import { useRouter } from "next/navigation";

import { useAlert } from "@eshg/lib-portal/errorHandling/AlertContext";
import {
  getCloseable,
  getErrorAction,
  getErrorDescription,
} from "@eshg/lib-portal/errorHandling/errorMappers";
import { resolveError } from "@eshg/lib-portal/errorHandling/errorResolvers";
import { ApiBookingState } from "@eshg/official-medical-service-api";

import { usePutAppointmentCitizen } from "@/lib/businessModules/officialMedicalService/api/mutations/citizenAuthApi";
import { citizenPublicApiQueryKey } from "@/lib/businessModules/officialMedicalService/api/queries/apiQueryKeys";
import { useGetProcedureDetails } from "@/lib/businessModules/officialMedicalService/api/queries/citizenAuthApi";
import {
  BookAppointmentFormValues,
  BookAppointmentWrapper,
} from "@/lib/businessModules/officialMedicalService/components/personalArea/bookAppointment/BookAppointmentWrapper";
import { useCitizenRoutes } from "@/lib/businessModules/officialMedicalService/shared/routes";
import { useTranslation } from "@/lib/i18n/client";
import { LogoutButton } from "@/lib/shared/components/buttons/LogoutButton";
import { PageContent } from "@/lib/shared/components/layout/PageContent";
import { PageLayout, PageTitle } from "@/lib/shared/components/layout/page";
import { useAccessCodeParam } from "@/lib/shared/helpers/accessCode";

const INITIAL_VALUES: BookAppointmentFormValues = {
  appointment: undefined,
};

export default function CitizenOmsEntryPage() {
  const { t } = useTranslation(["officialMedicalService/rebookAppointment"]);
  const [{ data: procedure }] = useSuspenseQueries({
    queries: [useGetProcedureDetails()],
  });
  const router = useRouter();
  const citizenRoutes = useCitizenRoutes();
  const accessCode = useAccessCodeParam();
  const alert = useAlert();
  const queryClient = useQueryClient();

  const bookAppointment = usePutAppointmentCitizen(
    procedure.appointment?.bookingState === ApiBookingState.Booked
      ? t("snackbar.rebook_success")
      : t("snackbar.book_success"),
  );

  async function handleSubmit(values: BookAppointmentFormValues) {
    if (!values.appointment) return;
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
        onError: (error) => {
          if (
            error instanceof Error &&
            error.message.startsWith("The requested time slot does not")
          ) {
            alert.error({
              message: t("common.errors.concurrentAppointment", {
                context: "errorMessage",
              }),
            });
            void (async () =>
              await queryClient.invalidateQueries({
                queryKey: citizenPublicApiQueryKey([
                  "getFreeAppointmentsForCitizen",
                ]),
              }));
          } else {
            const { errorCode } = resolveError(error);
            const { title, message } = getErrorDescription(errorCode);

            alert.error({
              title,
              message,
              action: getErrorAction(errorCode),
              closeable: getCloseable(errorCode),
            });
          }
        },
      },
    );
  }

  return (
    <PageLayout banner="private">
      <PageContent>
        <PageTitle toolbar={<LogoutButton text={t("common.logout")} />}>
          {t("common.title")}
        </PageTitle>
        <Formik initialValues={INITIAL_VALUES} onSubmit={handleSubmit}>
          <BookAppointmentWrapper procedure={procedure} />
        </Formik>
      </PageContent>
    </PageLayout>
  );
}
