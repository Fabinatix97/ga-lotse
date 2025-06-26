/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { differenceInMinutes, startOfMonth } from "date-fns";
import { Formik } from "formik";
import { RefObject, useEffect, useRef, useState } from "react";
import { isNullish, prop, sortBy } from "remeda";

import {
  Alert,
  FormPlus,
  PortalErrorCode,
  useSnackbar,
} from "@eshg/lib-portal";
import { ApiAppointment } from "@eshg/sti-protection-api";

import { useRebookAppointment } from "@/lib/businessModules/stiProtection/api/mutations/citizenApi";
import { useGetProcedure } from "@/lib/businessModules/stiProtection/api/queries/citizenApi";
import { useFreeAppointments } from "@/lib/businessModules/stiProtection/api/queries/publicCitizenApi";
import { NoAppointmentAvailable } from "@/lib/businessModules/stiProtection/components/shared/NoAppointmentAvailable";
import { useCitizenRoutes } from "@/lib/businessModules/stiProtection/shared/routes";
import { useTranslation } from "@/lib/i18n/client";
import { LogoutButton } from "@/lib/shared/components/buttons/LogoutButton";
import { PageContent } from "@/lib/shared/components/layout/PageContent";
import { TwoColumnGrid } from "@/lib/shared/components/layout/grid";
import { PageLayout, PageTitle } from "@/lib/shared/components/layout/page";
import { useScopedRouter } from "@/lib/shared/components/scopedLinks";

import { RebookAppointmentContent } from "./RebookAppointmentContent";
import { RebookAppointmentSidePanel } from "./RebookAppointmentSidePanel";

const initialValues = {
  appointment: null,
  date: null,
};

export interface RebookAppointmentFormValues {
  appointment?: ApiAppointment | null;
  date?: Date | null;
}

export function RebookAppointmentPage() {
  const { t } = useTranslation("stiProtection/rebookAppointment");
  const routes = useCitizenRoutes();
  const { data: procedure } = useGetProcedure();
  const now = startOfMonth(new Date());
  const { data: appointments } = useFreeAppointments({
    concern: procedure.concern,
    earliestDate: now,
  });
  const sortedAppointments = sortBy(appointments, prop("start"));
  const rebookAppointment = useRebookAppointment();

  const router = useScopedRouter();
  const snackbar = useSnackbar();
  const scrollToErrorRef = useRef<() => void>(null);
  const [hasConflict, setHasConflict] = useState(false);

  async function handleSubmit(formData: RebookAppointmentFormValues) {
    if (isNullish(formData.appointment)) {
      return;
    }
    const selectedAppointment = mapToRebookAppointment(formData.appointment);

    await rebookAppointment.mutateAsync(selectedAppointment, {
      onSuccess: (data) => {
        if (data !== PortalErrorCode.Conflict) {
          router.push(routes.personalArea.index(procedure.person.accessCode));
          snackbar.confirmation(t("common.timeslot_booked"));
        } else {
          setHasConflict(true);
          scrollToErrorRef?.current?.();
        }
      },
      onError: () => {
        snackbar.error(t("common.timeslot_taken"));
      },
    });
  }

  return (
    <PageLayout>
      <PageContent>
        <PageTitle
          toolbar={<LogoutButton text={t("translation:common.leave")} />}
        >
          {t("common.appointment_booking_title")}
        </PageTitle>
        <ConflictError
          hasConflict={hasConflict}
          scrollToErrorRef={scrollToErrorRef}
        />
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          <FormPlus sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {sortedAppointments.length > 0 ? (
              <TwoColumnGrid
                content={
                  <RebookAppointmentContent appointments={sortedAppointments} />
                }
                sidePanel={
                  <RebookAppointmentSidePanel concern={procedure.concern} />
                }
              />
            ) : (
              <NoAppointmentAvailable concern={procedure.concern} />
            )}
          </FormPlus>
        </Formik>
      </PageContent>
    </PageLayout>
  );
}

function ConflictError({
  hasConflict,
  scrollToErrorRef,
}: {
  hasConflict: boolean | undefined;
  scrollToErrorRef: RefObject<(() => void) | null>;
}) {
  const { t } = useTranslation("stiProtection/rebookAppointment");
  const alertRef = useRef<HTMLDivElement>(null);

  function scrollToError() {
    alertRef?.current?.scrollIntoView({ behavior: "smooth" });
  }

  scrollToErrorRef.current = scrollToError;
  useEffect(() => () => scrollToErrorRef.current?.(), [scrollToErrorRef]);

  if (!hasConflict) {
    return;
  }

  return (
    <Alert ref={alertRef} color="danger" message={t("common.timeslot_taken")} />
  );
}

function mapToRebookAppointment(appointment: ApiAppointment) {
  return {
    appointmentStart: appointment.start,
    durationInMinutes: differenceInMinutes(appointment.end, appointment.start),
  };
}
