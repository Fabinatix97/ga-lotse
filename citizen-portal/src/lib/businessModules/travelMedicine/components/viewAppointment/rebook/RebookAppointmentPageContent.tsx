/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { addMinutes, isAfter, isEqual } from "date-fns";
import { Formik, FormikErrors } from "formik";
import { useRouter } from "next/navigation";

import {
  PutAppointmentRequest,
  usePutAppointment,
} from "@/lib/businessModules/travelMedicine/api/mutations/citizenAuthApi";
import { useGetFreeAppointmentsForCitizen } from "@/lib/businessModules/travelMedicine/api/queries/citizenPublicApi";
import { NoAppointments } from "@/lib/businessModules/travelMedicine/components/appointment/steps/appointmentSlotStep/NoAppointments";
import { NoAppointmentsContent } from "@/lib/businessModules/travelMedicine/components/appointment/steps/appointmentSlotStep/NoAppointmentsContent";
import { useIdContext } from "@/lib/businessModules/travelMedicine/components/shared/contexts/IdContext";
import { RebookAppointment } from "@/lib/businessModules/travelMedicine/components/viewAppointment/rebook/RebookAppointment";
import { RebookAppointmentSidePanel } from "@/lib/businessModules/travelMedicine/components/viewAppointment/rebook/RebookAppointmentSidePanel";
import { useCitizenRoutes } from "@/lib/businessModules/travelMedicine/shared/routes";
import { useTranslation } from "@/lib/i18n/client";
import { ContentSheet } from "@/lib/shared/components/layout/contentSheet";
import {
  OneColumnGrid,
  TwoColumnGrid,
} from "@/lib/shared/components/layout/grid";
import { useAccessCodeParam } from "@/lib/shared/helpers/accessCode";
import { useIsMobile } from "@/lib/shared/hooks/useIsMobile";

export interface RebookAppointmentFormValues {
  selectedAppointment: string;
}

export function RebookAppointmentPageContent() {
  const { t } = useTranslation(["travelMedicine/rebookAppointment"]);
  const isMobile = useIsMobile();
  const idContext = useIdContext();
  const router = useRouter();
  const citizenRoutes = useCitizenRoutes();
  const accessCode = useAccessCodeParam();
  const putAppointment = usePutAppointment();

  const freeAppointments = useGetFreeAppointmentsForCitizen(
    idContext.appointmentDetails.summaryDto.appointmentType,
  ).data;

  const filteredAppointments = freeAppointments.appointments.filter(
    (appointment) => isDateAfterEarliestDate(appointment.start),
  );

  function isDateAfterEarliestDate(date: Date) {
    const now =
      idContext.appointmentDetails.summaryDto.earliestDate ?? new Date();
    return isEqual(date, now) || isAfter(date, now);
  }

  async function handleSubmit(values: RebookAppointmentFormValues) {
    const split = values.selectedAppointment.split(",");
    const durationInMinutes = Number.parseInt(split.at(1)!);
    const start = new Date(split.at(0)!);
    const request: PutAppointmentRequest = {
      procedureId: idContext.procedureId,
      procedureStepId: idContext.procedureStepId,
      appointment: {
        start: start,
        end: addMinutes(start, durationInMinutes),
      },
    };
    await putAppointment.mutateAsync(request, {
      onSuccess: () => routeBackToDetails(),
    });
  }

  function routeBackToDetails() {
    const url = `${citizenRoutes.viewAppointment.details.index(accessCode)}?procedureId=${idContext.procedureId}&procedureStepId=${idContext.procedureStepId}`;
    router.push(url);
  }

  function validateForm(values: RebookAppointmentFormValues) {
    const errors: FormikErrors<RebookAppointmentFormValues> = {};

    if (values.selectedAppointment === "") {
      errors.selectedAppointment = t("content.errorMessage");
    }

    return errors;
  }

  return (
    <Formik
      initialValues={{ selectedAppointment: "" }}
      onSubmit={handleSubmit}
      validate={validateForm}
    >
      {filteredAppointments.length > 0 ? (
        isMobile ? (
          <OneColumnGrid
            contentTop={null}
            contentCenter={
              <>
                <RebookAppointment appointments={filteredAppointments} />
                <RebookAppointmentSidePanel />
              </>
            }
            contentBottom={null}
          />
        ) : (
          <TwoColumnGrid
            content={<RebookAppointment appointments={filteredAppointments} />}
            sidePanel={<RebookAppointmentSidePanel />}
          />
        )
      ) : (
        <ContentSheet>
          <NoAppointments>
            <NoAppointmentsContent
              backButtonLocation={`${citizenRoutes.viewAppointment.details.index(
                accessCode,
              )}?procedureId=${idContext.procedureId}&procedureStepId=${idContext.procedureStepId}`}
            />
          </NoAppointments>
        </ContentSheet>
      )}
    </Formik>
  );
}
