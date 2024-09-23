/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiGetReferencePersonResponse } from "@eshg/employee-portal-api/base";
import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { createFieldNameMapper } from "@eshg/lib-portal/helpers/form";
import { Divider, Stack } from "@mui/joy";
import { Formik } from "formik";
import { isDefined } from "remeda";

import { BaseAddressDetails } from "@/lib/shared/components/address/BaseAddressDetails";
import { DetailsCell } from "@/lib/shared/components/detailsSection/DetailsCell";
import { DetailsRow } from "@/lib/shared/components/detailsSection/DetailsRow";
import { MultiFormButtonBar } from "@/lib/shared/components/form/MultiFormButtonBar";
import { SidebarForm } from "@/lib/shared/components/form/SidebarForm";
import {
  GENDER_VALUES,
  SALUTATION_VALUES,
  getOptionalTitle,
} from "@/lib/shared/components/personSidebar/constants";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";
import { translateCountry } from "@/lib/shared/helpers/i18n";

export interface PersonDetailsSidebarProps {
  title: string;
  submitLabel: string;
  person: ApiGetReferencePersonResponse;
  onSubmit: (values: ApiGetReferencePersonResponse) => Promise<void>;
  onBack?: () => void;
  onCancel: () => void;
}

export function PersonDetailsSidebar(props: PersonDetailsSidebarProps) {
  const fieldName = createFieldNameMapper<ApiGetReferencePersonResponse>();
  const person = props.person;
  const showEmailPhoneSection =
    person.phoneNumbers.length + person.emailAddresses.length > 0;
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
                  value={SALUTATION_VALUES[props.person.salutation]}
                  flexGrow
                />
                <DetailsCell
                  name={fieldName("title")}
                  label={"Titel"}
                  value={getOptionalTitle(props.person.title)}
                  flexGrow
                  avoidWrap
                />
              </DetailsRow>
              <DetailsRow>
                <DetailsCell
                  name={fieldName("firstName")}
                  label={"Vorname"}
                  value={props.person.firstName}
                  flexGrow
                />
                <DetailsCell
                  name={fieldName("lastName")}
                  label={"Name"}
                  value={props.person.lastName}
                  flexGrow
                  avoidWrap
                />
              </DetailsRow>
              <DetailsRow>
                <DetailsCell
                  name={fieldName("dateOfBirth")}
                  label={"Geburtsdatum"}
                  value={formatDate(props.person.dateOfBirth)}
                  flexGrow
                />
                <DetailsCell
                  name={fieldName("gender")}
                  label={"Geschlecht"}
                  value={GENDER_VALUES[props.person.gender]}
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
                  {isDefined(person.differentBillingAddress) && (
                    <>
                      <Divider />
                      <BaseAddressDetails
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
