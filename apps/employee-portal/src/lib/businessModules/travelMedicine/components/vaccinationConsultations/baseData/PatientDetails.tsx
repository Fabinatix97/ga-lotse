/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Divider, Stack, Typography } from "@mui/joy";
import { Formik } from "formik";
import { isDefined } from "remeda";

import { ApiGetReferencePersonResponse } from "@eshg/base-api";
import {
  BaseAddress,
  BaseAddressDetailsColumn,
  DetailsItem,
  DetailsRow,
  MultiFormButtonBar,
  SidebarActions,
  SidebarContent,
  SidebarForm,
} from "@eshg/lib-employee-portal";
import {
  GENDER_VALUES,
  SALUTATION_VALUES,
  formatDate,
  getOptionalTitle,
  translateCountry,
} from "@eshg/lib-portal";
import {
  ApiGender,
  ApiPatient,
  ApiSalutation,
} from "@eshg/travel-medicine-api";

import { instanceOfApiGetReferencePersonResponse } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/AcceptProcedureSidebar";

interface PatientDetailsProps {
  title: string;
  submitLabel: string;
  person: ApiGetReferencePersonResponse | ApiPatient;
  initialPatient: ApiPatient;
  onSubmit: (
    values: ApiGetReferencePersonResponse | ApiPatient,
  ) => Promise<void>;
  onBack?: () => void;
  onCancel: () => void;
}

export function PatientDetails(props: Readonly<PatientDetailsProps>) {
  const person = instanceOfApiGetReferencePersonResponse(props.person)
    ? props.person
    : {
        ...props.person,
        contactAddress: isDefined(props.person.address)
          ? ({
              type: "DomesticAddress",
              ...props.person.address,
            } satisfies BaseAddress)
          : undefined,
        salutation: isDefined(props.person.salutation)
          ? props.person.salutation
          : ApiSalutation.NotSpecified,
        gender: isDefined(props.person.gender)
          ? props.person.gender
          : ApiGender.NotSpecified,
        emailAddresses: isDefined(props.person.emailAddresses)
          ? props.person.emailAddresses
          : [],
        phoneNumbers: isDefined(props.person.phoneNumbers)
          ? props.person.phoneNumbers
          : [],
      };

  const showEmailPhoneSection =
    isDefined(person.phoneNumbers) && isDefined(person.emailAddresses)
      ? person.phoneNumbers.length + person.emailAddresses.length > 0
      : false;

  const showInitialPatientEmailPhoneSection =
    instanceOfApiGetReferencePersonResponse(props.person) &&
    isDefined(props.initialPatient.phoneNumbers) &&
    isDefined(props.initialPatient.emailAddresses)
      ? props.initialPatient.phoneNumbers.length +
          props.initialPatient.emailAddresses.length >
        0
      : false;

  return (
    <Formik
      initialValues={props.person}
      enableReinitialize
      onSubmit={props.onSubmit}
    >
      {({ isSubmitting }) => (
        <SidebarForm>
          <SidebarContent title={props.title} subtitle="Ausgewählte Person">
            <Stack gap={2}>
              <DetailsRow>
                <DetailsItem
                  label="Anrede"
                  value={SALUTATION_VALUES[person.salutation]}
                />
                <DetailsItem
                  label="Titel"
                  value={getOptionalTitle(person.title)}
                  avoidWrap
                />
              </DetailsRow>
              <DetailsRow>
                <DetailsItem label="Vorname" value={person.firstName} />
                <DetailsItem label="Name" value={person.lastName} avoidWrap />
              </DetailsRow>
              <DetailsRow>
                <DetailsItem
                  label="Geburtsdatum"
                  value={formatDate(person.dateOfBirth)}
                />
                <DetailsItem
                  label="Geschlecht"
                  value={GENDER_VALUES[person.gender]}
                />
              </DetailsRow>
              <DetailsItem
                label="Geburtsname"
                value={props.person.nameAtBirth}
              />
              <DetailsItem
                label="Geburtsort"
                value={props.person.placeOfBirth}
              />
              <DetailsItem
                label="Geburtsland"
                value={
                  isDefined(props.person.countryOfBirth)
                    ? translateCountry(props.person.countryOfBirth)
                    : undefined
                }
              />

              {isDefined(person.contactAddress) && (
                <>
                  <Divider />
                  <BaseAddressDetailsColumn address={person.contactAddress} />
                </>
              )}

              {showEmailPhoneSection && (
                <>
                  <Divider />
                  {person.emailAddresses.map((email, index) => (
                    <DetailsItem
                      key={`${email}-${index}`}
                      label="E-Mail-Adresse"
                      value={email}
                    />
                  ))}
                  {person.phoneNumbers.map((phoneNumber, index) => (
                    <DetailsItem
                      key={`${phoneNumber}-${index}`}
                      label="Telefonnummer"
                      value={phoneNumber}
                    />
                  ))}
                </>
              )}

              {showInitialPatientEmailPhoneSection && (
                <>
                  <Divider component="div" role="presentation">
                    <Typography level="title-sm" color="neutral">
                      Gemeldete Kontaktdaten
                    </Typography>
                  </Divider>
                  {isDefined(props.initialPatient.emailAddresses) &&
                    props.initialPatient.emailAddresses.map((email, index) => (
                      <DetailsItem
                        key={`initialPatient-${email}-${index}`}
                        label="E-Mail-Adresse"
                        value={email}
                      />
                    ))}
                  {isDefined(props.initialPatient.phoneNumbers) &&
                    props.initialPatient.phoneNumbers.map(
                      (phoneNumber, index) => (
                        <DetailsItem
                          key={`initialPatient-${phoneNumber}-${index}`}
                          label="Telefonnummer"
                          value={phoneNumber}
                        />
                      ),
                    )}
                </>
              )}
            </Stack>
          </SidebarContent>
          <SidebarActions>
            <MultiFormButtonBar
              submitting={isSubmitting}
              submitLabel={props.submitLabel}
              onBack={props.onBack}
              onCancel={props.onCancel}
            />
          </SidebarActions>
        </SidebarForm>
      )}
    </Formik>
  );
}
