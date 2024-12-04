/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ApiPatient,
  ApiPersonSync,
  ApiSalutation,
} from "@eshg/employee-portal-api/travelMedicine";
import { useResetAlertContext } from "@eshg/lib-portal/errorHandling/AlertContext";
import { isDefined } from "remeda";

import { PersonDetails } from "@/lib/businessModules/schoolEntry/api/models/Person";
import { useUpdatePatient } from "@/lib/businessModules/travelMedicine/api/mutations/vaccinationConsultation";
import { PersonSidebar } from "@/lib/businessModules/travelMedicine/components/personSidebar/PersonSidebar";
import { InitialAppointmentFormValuesProps } from "@/lib/businessModules/travelMedicine/components/personSidebar/appointment/InitialAppointmentForm";
import {
  PersonSidebarMode,
  TRAVEL_MEDICINE_EDIT_PERSON_CONFIG,
  mapToApiPatchVaccinationConsultationPatientRequest,
  mapToPersonFormData,
} from "@/lib/businessModules/travelMedicine/components/personSidebar/personSidebarHelper";
import { routes } from "@/lib/businessModules/travelMedicine/shared/routes";
import { OverlayBoundary } from "@/lib/shared/components/boundaries/OverlayBoundary";
import { EditButton } from "@/lib/shared/components/buttons/EditButton";
import { CentralFilePersonDetails } from "@/lib/shared/components/centralFile/display/CentralFilePersonDetails";
import {
  SyncBarrier,
  useSyncBarrier,
} from "@/lib/shared/components/centralFile/sync/SyncBarrier";
import { DetailsSection } from "@/lib/shared/components/detailsSection/DetailsSection";
import { InformationSheet } from "@/lib/shared/components/infoTile/InformationSheet";
import { LegacyPerson } from "@/lib/shared/components/legacyPersonSidebar/form/LegacyPersonForm";
import { useSearchParam } from "@/lib/shared/hooks/searchParams/useSearchParam";

interface PatientPanelProps {
  procedureId: string;
  patient: ApiPatient;
  person: ApiPersonSync;
  isProcedureClosed: boolean;
  isProcedureDraft: boolean;
}

export function PatientPanel({
  procedureId,
  patient,
  person,
  isProcedureClosed,
  isProcedureDraft,
}: Readonly<PatientPanelProps>) {
  const [open, setOpen] = useSearchParam("edit-patient", "boolean");

  const updatePatientApi = useUpdatePatient();

  const resetAlertContext = useResetAlertContext();

  const syncRoute = routes.procedures.syncPerson(
    procedureId,
    person.fileStateId,
    person.version,
  );

  const personParams = {
    fileStateId: person.fileStateId,
    version: person.version,
    outdated: person.outdated,
    salutation: patient.salutation ?? ApiSalutation.NotSpecified,
  };
  const { syncBarrier } = useSyncBarrier(
    syncRoute,
    personParams as PersonDetails,
  );

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
    await updatePatientApi.mutateAsync(request, options);
  }

  return (
    <>
      <InformationSheet data-testid={"patient"}>
        <DetailsSection
          data-testid="patient-card-tile"
          title="Patient"
          buttons={
            !isProcedureDraft &&
            !isProcedureClosed && (
              <SyncBarrier outdated={person.outdated} syncHref={syncRoute}>
                <EditButton
                  aria-label="Patient ändern"
                  onClick={syncBarrier(() => {
                    updateSidebar(true);
                  })}
                />
              </SyncBarrier>
            )
          }
        >
          <CentralFilePersonDetails
            showAge
            person={{
              ...patient,
              contactAddress: isDefined(patient.address)
                ? {
                    // TODO: Support postbox type
                    type: "DomesticAddress",
                    ...patient.address,
                  }
                : undefined,
            }}
          />
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
