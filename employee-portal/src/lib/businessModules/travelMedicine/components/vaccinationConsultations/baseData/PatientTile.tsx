/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiPatient } from "@eshg/employee-portal-api/travelMedicine";
import { ExternalLink } from "@eshg/lib-portal/components/navigation/ExternalLink";
import { useAlertContext } from "@eshg/lib-portal/errorHandling/AlertContext";
import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
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
import { calculateAge } from "@/lib/businessModules/travelMedicine/shared/helper";
import { DetailsCell } from "@/lib/shared/components/detailsSection/DetailsCell";
import { DetailsSection } from "@/lib/shared/components/detailsSection/DetailsSection";
import { InformationSheet } from "@/lib/shared/components/infoTile/InformationSheet";
import { LegacyPerson } from "@/lib/shared/components/legacyPersonSidebar/form/LegacyPersonForm";
import {
  GENDER_VALUES,
  SALUTATION_VALUES,
} from "@/lib/shared/components/personSidebar/constants";
import { translateCountry } from "@/lib/shared/helpers/i18n";
import { useSearchParam } from "@/lib/shared/hooks/searchParams/useSearchParam";

interface PatientTileProps {
  procedureId: string;
  patient: ApiPatient;
  isProcedureClosed: boolean;
}

export function PatientTile({
  procedureId,
  patient,
  isProcedureClosed,
}: Readonly<PatientTileProps>) {
  const [open, setOpen] = useSearchParam("edit-patient", "boolean");

  const updatePatientApi = useUpdatePatient();

  const alertContext = useAlertContext();

  function updateSidebar(sideBarState: boolean) {
    setOpen(sideBarState);
    resetAlertContext();
  }

  function resetAlertContext() {
    if (alertContext !== null) {
      alertContext.setAlert(null);
    }
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
      <InformationSheet>
        <DetailsSection
          name="patient-card-tile"
          title="Patient"
          onEdit={() => {
            updateSidebar(true);
          }}
          canEdit={!isProcedureClosed}
        >
          <Grid container spacing={3}>
            <PersonalInfoTile patient={patient} />
            <Divider orientation="vertical" sx={{ mr: "-1px" }} />
            <DomesticAddressInfoTile patient={patient} />
            <Divider orientation="vertical" sx={{ mr: "-1px" }} />
            <EmailAndPhoneNumbersInfoTile
              emailAddresses={patient.emailAddresses}
            />
          </Grid>
        </DetailsSection>
      </InformationSheet>
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
    </>
  );
}

function PersonalInfoTile({ patient }: { patient: ApiPatient }) {
  return (
    <Grid xs={4}>
      <Grid container columns={4} spacing={2} pl={0} py={0}>
        <Grid xs={12}>
          <DetailsCell
            name="salutation"
            label="Anrede"
            value={patient.salutation && SALUTATION_VALUES[patient.salutation]}
          />
        </Grid>
        <Grid xs={12}>
          <DetailsCell
            name="firstName"
            label="Vorname"
            value={patient.firstName}
          />
        </Grid>
        <Grid xs={12}>
          <DetailsCell
            name="lastName"
            label="Nachname"
            value={patient.lastName}
          />
        </Grid>
        <Grid xs={12}>
          <Grid container spacing={3}>
            <Grid xs={9}>
              <DetailsCell
                name="dateOfBirth"
                label="Geburtsdatum"
                value={formatDate(patient.dateOfBirth)}
              />
            </Grid>
            <Grid xs={1}>
              <DetailsCell
                name="currentAge"
                label="Alter"
                value={calculateAge(patient.dateOfBirth)}
              />
            </Grid>
            <Grid xs={2}>
              <DetailsCell
                name="gender"
                label="Geschlecht"
                value={patient.gender && GENDER_VALUES[patient.gender]}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

function DomesticAddressInfoTile({
  patient,
}: Readonly<{ patient: ApiPatient }>) {
  return (
    <Grid xs={4}>
      <Grid container columns={4} spacing={2} py={0} px={1}>
        <Grid xs={12}>
          <DetailsCell
            name="street"
            label="Straße und Haus-Nr."
            value={
              patient.address?.street !== undefined &&
              patient.address?.houseNumber !== undefined
                ? [patient.address?.street, patient.address?.houseNumber]
                    .join(" ")
                    .trim()
                : "-"
            }
          />
        </Grid>
        <Grid xs={12}>
          <DetailsCell
            name="addressAddition"
            label="Adresszusatz"
            value={patient.address?.addressAddition ?? "-"}
          />
        </Grid>{" "}
        <Grid xs={12}>
          <Grid container spacing={3}>
            <Grid xs={6}>
              <DetailsCell
                name="postalCode"
                label="Postleitzahl"
                value={patient.address?.postalCode ?? "-"}
              />
            </Grid>
            <Grid xs={8}>
              <DetailsCell
                name="city"
                label="Ort"
                value={patient.address?.city ?? "-"}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid xs={12}>
          <DetailsCell
            name="country"
            label="Land"
            value={
              patient.address?.country !== undefined
                ? translateCountry(patient.address?.country)
                : "-"
            }
          />
        </Grid>
      </Grid>
    </Grid>
  );
}

function EmailInfoTile({
  emailAddress,
  index,
}: Readonly<{
  emailAddress: string;
  index: number;
}>) {
  return (
    <Grid xs={12} padding={1}>
      <DetailsCell
        name={`mail-${index}`}
        label="E-Mail-Adresse"
        value={
          <ExternalLink href={`mailto:${emailAddress}`}>
            {emailAddress}
          </ExternalLink>
        }
      />
    </Grid>
  );
}

function EmailAndPhoneNumbersInfoTile({
  emailAddresses,
}: Readonly<{
  emailAddresses: string[] | undefined;
}>) {
  return emailAddresses !== undefined && emailAddresses.length !== 0 ? (
    <Grid xs={4}>
      <Grid container columns={4} spacing={2} py={0} px={1}>
        {emailAddresses?.map((addr, idx) => (
          <EmailInfoTile key={addr} emailAddress={addr} index={idx} />
        ))}
      </Grid>
    </Grid>
  ) : (
    <Grid xs={4}>
      <Grid container columns={4} spacing={2} py={0} px={1}>
        <Grid xs={12} padding={1}>
          <DetailsCell name={`mail-0`} label="E-Mail-Adresse" value={"-"} />
        </Grid>
      </Grid>
    </Grid>
  );
}
