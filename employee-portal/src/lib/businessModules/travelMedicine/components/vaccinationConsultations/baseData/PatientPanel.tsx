/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiPatient } from "@eshg/employee-portal-api/travelMedicine";
import { useResetAlertContext } from "@eshg/lib-portal/errorHandling/AlertContext";
import { Divider, Grid } from "@mui/joy";

import { useUpdatePatient } from "@/lib/businessModules/travelMedicine/api/mutations/vaccinationConsultation";
import { PersonSidebar } from "@/lib/businessModules/travelMedicine/components/personSidebar/PersonSidebar";
import { InitialAppointmentFormValuesProps } from "@/lib/businessModules/travelMedicine/components/personSidebar/appointment/InitialAppointmentForm";
import {
  PersonSidebarMode,
  TRAVEL_MEDICINE_EDIT_PERSON_CONFIG,
  mapToApiPatchVaccinationConsultationPatientRequest,
  mapToPersonFormData,
} from "@/lib/businessModules/travelMedicine/components/personSidebar/personSidebarHelper";
import { DomesticAddressInfoSection } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/DomesticAddressInfoSection";
import { EmailAndPhoneNumbersInfoSection } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/EmailAndPhoneNumbersInfoSection";
import { PersonalInfoSection } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/PersonalInfoSection";
import { OverlayBoundary } from "@/lib/shared/components/boundaries/OverlayBoundary";
import { DetailsSection } from "@/lib/shared/components/detailsSection/DetailsSection";
import { InformationSheet } from "@/lib/shared/components/infoTile/InformationSheet";
import { LegacyPerson } from "@/lib/shared/components/legacyPersonSidebar/form/LegacyPersonForm";
import { useSearchParam } from "@/lib/shared/hooks/searchParams/useSearchParam";

interface PatientPanelProps {
  procedureId: string;
  patient: ApiPatient;
  isProcedureClosed: boolean;
}

export function PatientPanel({
  procedureId,
  patient,
  isProcedureClosed,
}: Readonly<PatientPanelProps>) {
  const [open, setOpen] = useSearchParam("edit-patient", "boolean");

  const updatePatientApi = useUpdatePatient();

  const resetAlertContext = useResetAlertContext();

  function updateSidebar(sideBarState: boolean) {
    setOpen(sideBarState);
    resetAlertContext();
  }

  function handleClose() {
    updateSidebar(false);
  }

  async function handleOnSubmit(
    data: InitialAppointmentFormValuesProps | LegacyPerson,
    resetAndClose?: () => void,
  ) {
    const apiRequest = mapToApiPatchVaccinationConsultationPatientRequest(
      data as LegacyPerson,
    );
    const request = { apiRequest, procedureId };
    let options;

    if (resetAndClose) {
      options = { onSuccess: resetAndClose };
    }
    await updatePatientApi.mutateAsync(request, options).catch();
  }

  return (
    <>
      <InformationSheet data-testid={"patient"}>
        <DetailsSection
          name="patient-card-tile"
          title="Patient"
          onEdit={() => {
            updateSidebar(true);
          }}
          canEdit={!isProcedureClosed}
        >
          <Grid container spacing={3}>
            <PersonalInfoSection patient={patient} />
            <Divider orientation="vertical" sx={{ mr: "-1px" }} />
            <DomesticAddressInfoSection patient={patient} />
            <Divider orientation="vertical" sx={{ mr: "-1px" }} />
            <EmailAndPhoneNumbersInfoSection
              emailAddresses={patient.emailAddresses}
            />
          </Grid>
        </DetailsSection>
      </InformationSheet>
      <OverlayBoundary>
        {open && (
          <PersonSidebar
            open={open}
            mode={PersonSidebarMode.editInCentralFile}
            personFormTitle={"Patient bearbeiten"}
            config={TRAVEL_MEDICINE_EDIT_PERSON_CONFIG}
            person={mapToPersonFormData(patient)}
            onClose={handleClose}
            onSubmit={handleOnSubmit}
            showPostalAddress={true}
            skipInitialAppointmentSelection={true}
          />
        )}
      </OverlayBoundary>
    </>
  );
}
