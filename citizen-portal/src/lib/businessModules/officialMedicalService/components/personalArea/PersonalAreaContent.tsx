/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiBookingState,
  ApiGetCitizenProcedureDetailsResponse,
  ApiOmsAppointment,
} from "@eshg/official-medical-service-api";
import { useSuspenseQueries } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { isDefined } from "remeda";

import { useGetDepartmentInfoQuery } from "@/lib/businessModules/officialMedicalService/api/queries/citizenPublicApi";
import { ProcedureDocumentForm } from "@/lib/businessModules/officialMedicalService/components/personalArea/ProcedureDocumentForm";
import { AppointmentDateSection } from "@/lib/businessModules/officialMedicalService/components/personalArea/sections/AppointmentDateSection";
import { AppointmentStatusSection } from "@/lib/businessModules/officialMedicalService/components/personalArea/sections/AppointmentStatusSection";
import { AppointmentTimeSection } from "@/lib/businessModules/officialMedicalService/components/personalArea/sections/AppointmentTimeSection";
import { BirthdateSection } from "@/lib/businessModules/officialMedicalService/components/personalArea/sections/BirthdateSection";
import { ConcernSection } from "@/lib/businessModules/officialMedicalService/components/personalArea/sections/ConcernSection";
import { NameSection } from "@/lib/businessModules/officialMedicalService/components/personalArea/sections/NameSection";
import { useCitizenRoutes } from "@/lib/businessModules/officialMedicalService/shared/routes";
import { useTranslation } from "@/lib/i18n/client";
import { AddressSection } from "@/lib/shared/components/AddressSection";
import { ContactSection } from "@/lib/shared/components/ContactSection";
import { InfoSectionGrid } from "@/lib/shared/components/infoSection";
import {
  ContentSheet,
  ContentSheetTitle,
} from "@/lib/shared/components/layout/contentSheet";
import { GridColumnStack } from "@/lib/shared/components/layout/grid";
import { useAccessCodeParam } from "@/lib/shared/helpers/accessCode";
import { useConfirmationDialog } from "@/lib/shared/hooks/useConfirmationDialog";

interface PersonalAreaContentProps {
  procedure: ApiGetCitizenProcedureDetailsResponse;
}

export function PersonalAreaContent({ procedure }: PersonalAreaContentProps) {
  const { t } = useTranslation(["officialMedicalService/personalArea"]);
  const [{ data: departmentInfo }] = useSuspenseQueries({
    queries: [useGetDepartmentInfoQuery()],
  });
  const { openConfirmationDialog } = useConfirmationDialog();

  const router = useRouter();
  const citizenRoutes = useCitizenRoutes();
  const accessCode = useAccessCodeParam();

  function handleConfirm() {
    // TODO ApiBookingState.Cancelled
    if (
      procedure.appointment?.bookingState === ApiBookingState.Bookable &&
      procedure.appointment?.bookingsRemaining > 0
    ) {
      openConfirmationDialog({
        onConfirm: () =>
          router.push(citizenRoutes.personalArea.rebook(accessCode)),
        title: "",
        description: t(
          "information.appointment_status_section.modal.description",
          { context: procedure.appointment?.bookingState },
        ),
        confirmLabel: t(
          "information.appointment_status_section.modal.bookAppointment",
          { context: procedure.appointment?.bookingState },
        ),
      });
    }
  }

  return (
    <GridColumnStack>
      <ContentSheet>
        <ContentSheetTitle>{t("information.title")}</ContentSheetTitle>
        <InfoSectionGrid>
          <NameSection
            person={procedure}
            localePath="officialMedicalService/personalArea"
          />
          <BirthdateSection
            birthdate={procedure.dateOfBirth}
            localePath="officialMedicalService/personalArea"
          />
          {isDefined(procedure.appointment?.bookingState) && (
            <AppointmentStatusSection
              bookingState={procedure.appointment?.bookingState}
              localePath={"officialMedicalService/personalArea"}
              onConfirm={handleConfirm}
            />
          )}
          <ConcernSection
            concern={procedure.concern}
            localePath="officialMedicalService/personalArea"
          />
          {appointmentHasDate(procedure.appointment) && (
            <AppointmentDateSection
              appointment={procedure.appointment}
              localePath="officialMedicalService/personalArea"
            />
          )}
          {appointmentHasDate(procedure.appointment) && (
            <AppointmentTimeSection
              appointment={procedure.appointment}
              localePath="officialMedicalService/personalArea"
            />
          )}
          <AddressSection
            department={departmentInfo}
            localePath="officialMedicalService/personalArea"
          />
          <ContactSection
            department={departmentInfo}
            localePath="officialMedicalService/personalArea"
          />
        </InfoSectionGrid>
      </ContentSheet>
      <ProcedureDocumentForm documents={procedure.documents} />
    </GridColumnStack>
  );
}

function appointmentHasDate(
  appointment: ApiOmsAppointment | undefined,
): appointment is ApiOmsAppointment {
  return (
    appointment !== undefined &&
    appointment.bookingState !== ApiBookingState.Bookable
  );
}
