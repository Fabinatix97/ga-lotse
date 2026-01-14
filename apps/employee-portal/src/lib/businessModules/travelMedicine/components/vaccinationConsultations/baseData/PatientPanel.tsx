/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { isDefined } from "remeda";

import {
  CentralFilePersonDetails,
  DetailsSection,
  EditButton,
  InformationSheet,
  SyncBarrier,
  useSyncBarrier,
} from "@eshg/lib-employee-portal";
import {
  ApiPatient,
  ApiPersonSync,
  ApiSalutation,
} from "@eshg/travel-medicine-api";

import { useEditPersonDetailsSidebar } from "@/lib/businessModules/travelMedicine/components/personSidebar/PersonSidebar";
import { routes } from "@/lib/businessModules/travelMedicine/shared/routes";

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
  const { open } = useEditPersonDetailsSidebar({ patient, procedureId });

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

  const { syncBarrier } = useSyncBarrier(syncRoute, personParams);

  return (
    <InformationSheet data-testid="patient">
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
                  open();
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
  );
}
