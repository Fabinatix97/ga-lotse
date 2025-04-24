/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiGetReferencePersonResponse } from "@eshg/base-api";
import {
  GENDER_VALUES,
  SALUTATION_VALUES,
  getOptionalTitle,
} from "@eshg/lib-portal/components/formFields/constants";
import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { translateCountry } from "@eshg/lib-portal/helpers/countryOption";
import { Divider, Stack } from "@mui/joy";
import { Formik } from "formik";
import { isDefined } from "remeda";

import { BaseAddressDetailsColumn } from "@/components/address/BaseAddressDetailsColumn";
import { DetailsRow } from "@/components/detailsSection/DetailsRow";
import { DetailsItem } from "@/components/detailsSection/items/DetailsItem";
import { MultiFormButtonBar } from "@/components/form/MultiFormButtonBar";
import { SidebarActions } from "@/features/drawer/components/SidebarActions";
import { SidebarContent } from "@/features/drawer/components/SidebarContent";
import { SidebarForm } from "@/features/drawer/components/SidebarForm";

interface PersonDetailsSidebarProps {
  title: string;
  submitLabel: string;
  person: ApiGetReferencePersonResponse;
  onSubmit: (values: ApiGetReferencePersonResponse) => Promise<void>;
  onBack?: () => void;
  onCancel: () => void;
}

export function PersonDetailsSidebar(props: PersonDetailsSidebarProps) {
  const person = props.person;
  const showEmailPhoneSection =
    person.phoneNumbers.length + person.emailAddresses.length > 0;
  return (
    <Formik initialValues={person} onSubmit={props.onSubmit} enableReinitialize>
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
              <DetailsItem label="Geburtsname" value={person.nameAtBirth} />
              <DetailsItem label="Geburtsort" value={person.placeOfBirth} />
              <DetailsItem
                label="Geburtsland"
                value={
                  isDefined(person.countryOfBirth)
                    ? translateCountry(person.countryOfBirth)
                    : undefined
                }
              />

              {isDefined(person.contactAddress) && (
                <>
                  <Divider />
                  <BaseAddressDetailsColumn address={person.contactAddress} />
                  {isDefined(person.differentBillingAddress) && (
                    <>
                      <Divider />
                      <BaseAddressDetailsColumn
                        address={person.differentBillingAddress}
                      />
                    </>
                  )}
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
