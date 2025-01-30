/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiGetReferencePersonResponse } from "@eshg/base-api";
import {
  GENDER_VALUES,
  SALUTATION_VALUES,
  getOptionalTitle,
} from "@eshg/lib-portal/components/formFields/constants";
import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { translateCountry } from "@eshg/lib-portal/helpers/countryOption";
import { createFieldNameMapper } from "@eshg/lib-portal/helpers/form";
import {
  ApiGender,
  ApiPatient,
  ApiSalutation,
} from "@eshg/travel-medicine-api";
import { Divider, Stack, Typography } from "@mui/joy";
import { Formik } from "formik";
import { isDefined } from "remeda";

import { instanceOfApiGetReferencePersonResponse } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/AcceptProcedureSidebar";
import { BaseAddressDetails } from "@/lib/shared/components/address/BaseAddressDetails";
import { DetailsCell } from "@/lib/shared/components/detailsSection/DetailsCell";
import { DetailsRow } from "@/lib/shared/components/detailsSection/DetailsRow";
import { MultiFormButtonBar } from "@/lib/shared/components/form/MultiFormButtonBar";
import { SidebarForm } from "@/lib/shared/components/form/SidebarForm";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";
import { BaseAddress } from "@/lib/shared/helpers/address";

export interface PatientDetailsProps {
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
  const fieldName = createFieldNameMapper<
    ApiGetReferencePersonResponse | ApiPatient
  >();
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
      onSubmit={props.onSubmit}
      enableReinitialize
    >
      {({ isSubmitting }) => (
        <SidebarForm>
          <SidebarContent title={props.title} subtitle="Ausgewählte Person">
            <Stack gap={2}>
              <DetailsRow>
                <DetailsCell
                  name={fieldName("salutation")}
                  label={"Anrede"}
                  value={SALUTATION_VALUES[person.salutation]}
                  flexGrow
                />
                <DetailsCell
                  name={fieldName("title")}
                  label={"Titel"}
                  value={getOptionalTitle(person.title)}
                  flexGrow
                  avoidWrap
                />
              </DetailsRow>
              <DetailsRow>
                <DetailsCell
                  name={fieldName("firstName")}
                  label={"Vorname"}
                  value={person.firstName}
                  flexGrow
                />
                <DetailsCell
                  name={fieldName("lastName")}
                  label={"Name"}
                  value={person.lastName}
                  flexGrow
                  avoidWrap
                />
              </DetailsRow>
              <DetailsRow>
                <DetailsCell
                  name={fieldName("dateOfBirth")}
                  label={"Geburtsdatum"}
                  value={formatDate(person.dateOfBirth)}
                  flexGrow
                />
                <DetailsCell
                  name={fieldName("gender")}
                  label={"Geschlecht"}
                  value={GENDER_VALUES[person.gender]}
                  flexGrow
                />
              </DetailsRow>
              <DetailsCell
                name={fieldName("nameAtBirth")}
                label={"Geburtsname"}
                value={props.person.nameAtBirth}
              />
              <DetailsCell
                name={fieldName("placeOfBirth")}
                label={"Geburtsort"}
                value={props.person.placeOfBirth}
              />
              <DetailsCell
                name={fieldName("countryOfBirth")}
                label={"Geburtsland"}
                value={
                  isDefined(props.person.countryOfBirth)
                    ? translateCountry(props.person.countryOfBirth)
                    : undefined
                }
              />

              {isDefined(person.contactAddress) && (
                <>
                  <Divider />
                  <BaseAddressDetails address={person.contactAddress} />
                </>
              )}

              {showEmailPhoneSection && (
                <>
                  <Divider />
                  {person.emailAddresses.map((email, index) => (
                    <DetailsCell
                      key={`${email}-${index}`}
                      name={fieldName("emailAddresses") + "." + index}
                      label={"E-Mail-Adresse"}
                      value={email}
                    />
                  ))}
                  {person.phoneNumbers.map((phoneNumber, index) => (
                    <DetailsCell
                      key={`${phoneNumber}-${index}`}
                      name={fieldName("phoneNumbers") + "." + index}
                      label={"Telefonnummer"}
                      value={phoneNumber}
                    />
                  ))}
                </>
              )}

              {showInitialPatientEmailPhoneSection && (
                <>
                  <Divider component="div" role="presentation">
                    <Typography level={"title-sm"} color={"neutral"}>
                      Gemeldete Kontaktdaten
                    </Typography>
                  </Divider>
                  {isDefined(props.initialPatient.emailAddresses) &&
                    props.initialPatient.emailAddresses.map((email, index) => (
                      <DetailsCell
                        key={`initialPatient-${email}-${index}`}
                        name={fieldName("emailAddresses") + "." + index}
                        label={"E-Mail-Adresse"}
                        value={email}
                      />
                    ))}
                  {isDefined(props.initialPatient.phoneNumbers) &&
                    props.initialPatient.phoneNumbers.map(
                      (phoneNumber, index) => (
                        <DetailsCell
                          key={`initialPatient-${phoneNumber}-${index}`}
                          name={fieldName("phoneNumbers") + "." + index}
                          label={"Telefonnummer"}
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
