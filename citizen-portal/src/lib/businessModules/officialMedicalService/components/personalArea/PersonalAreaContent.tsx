/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiBookingState,
  ApiOmsAppointment,
} from "@eshg/official-medical-service-api";
import { useSuspenseQueries } from "@tanstack/react-query";

import { useGetProcedureDetails } from "@/lib/businessModules/officialMedicalService/api/queries/citizenAuthApi";
import { useGetDepartmentInfoQuery } from "@/lib/businessModules/officialMedicalService/api/queries/citizenPublicApi";
import { ProcedureDocumentForm } from "@/lib/businessModules/officialMedicalService/components/personalArea/ProcedureDocumentForm";
import { AppointmentDateSection } from "@/lib/businessModules/officialMedicalService/components/personalArea/sections/AppointmentDateSection";
import { AppointmentStatusSection } from "@/lib/businessModules/officialMedicalService/components/personalArea/sections/AppointmentStatusSection";
import { AppointmentTimeSection } from "@/lib/businessModules/officialMedicalService/components/personalArea/sections/AppointmentTimeSection";
import { BirthdateSection } from "@/lib/businessModules/officialMedicalService/components/personalArea/sections/BirthdateSection";
import { ConcernSection } from "@/lib/businessModules/officialMedicalService/components/personalArea/sections/ConcernSection";
import { NameSection } from "@/lib/businessModules/officialMedicalService/components/personalArea/sections/NameSection";
import { useTranslation } from "@/lib/i18n/client";
import { AddressSection } from "@/lib/shared/components/AddressSection";
import { ContactSection } from "@/lib/shared/components/ContactSection";
import { InfoSectionGrid } from "@/lib/shared/components/infoSection";
import {
  ContentSheet,
  ContentSheetTitle,
} from "@/lib/shared/components/layout/contentSheet";
import { GridColumnStack } from "@/lib/shared/components/layout/grid";

export function PersonalAreaContent() {
  const { t } = useTranslation(["officialMedicalService/personalArea"]);
  const [{ data: departmentInfo }, { data: procedureDetails }] =
    useSuspenseQueries({
      queries: [useGetDepartmentInfoQuery(), useGetProcedureDetails()],
    });

  return (
    <GridColumnStack>
      <ContentSheet>
        <ContentSheetTitle>{t("information.title")}</ContentSheetTitle>
        <InfoSectionGrid>
          <NameSection
            person={procedureDetails}
            localePath="officialMedicalService/personalArea"
          />
          <BirthdateSection
            birthdate={procedureDetails.dateOfBirth}
            localePath="officialMedicalService/personalArea"
          />
          <AppointmentStatusSection
            bookingState={
              procedureDetails.appointment?.bookingState ??
              ApiBookingState.Bookable
            }
            localePath={"officialMedicalService/personalArea"}
          />
          <ConcernSection
            concern={procedureDetails.concern}
            localePath="officialMedicalService/personalArea"
          />
          {appointmentHasDate(procedureDetails.appointment) && (
            <AppointmentDateSection
              appointment={procedureDetails.appointment}
              localePath="officialMedicalService/personalArea"
            />
          )}
          {appointmentHasDate(procedureDetails.appointment) && (
            <AppointmentTimeSection
              appointment={procedureDetails.appointment}
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
      <ProcedureDocumentForm documents={procedureDetails.documents} />
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
