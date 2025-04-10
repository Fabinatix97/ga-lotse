/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ApiFacilityContactPerson,
  ApiGetReferenceFacilityResponse,
} from "@eshg/base-api";
import {
  BaseAddressDetailsColumn,
  DetailsRow,
  MultiFormButtonBar,
  SidebarActions,
  SidebarContent,
  SidebarForm,
  formatList,
} from "@eshg/lib-employee-portal";
import {
  SALUTATION_VALUES,
  getOptionalTitle,
} from "@eshg/lib-portal/components/formFields/constants";
import { createFieldNameMapper } from "@eshg/lib-portal/helpers/form";
import {
  Accordion,
  AccordionDetails,
  AccordionGroup,
  AccordionSummary,
  Divider,
  Stack,
  Typography,
  accordionDetailsClasses,
  accordionSummaryClasses,
  styled,
} from "@mui/joy";
import { Formik } from "formik";
import { isDefined } from "remeda";

import { DetailsCell } from "@/lib/shared/components/detailsSection/DetailsCell";

export interface FacilityDetailsSidebarProps {
  title: string;
  submitLabel: string;
  facility: ApiGetReferenceFacilityResponse;
  onSubmit: (values: ApiGetReferenceFacilityResponse) => Promise<void>;
  onBack?: () => void;
  onCancel: () => void;
}

export function FacilityDetailsSidebar(props: FacilityDetailsSidebarProps) {
  const fieldName = createFieldNameMapper<ApiGetReferenceFacilityResponse>();
  const facility = props.facility;
  const showEmailPhoneSection =
    facility.phoneNumbers.length + facility.emailAddresses.length > 0;
  return (
    <Formik
      initialValues={props.facility}
      onSubmit={props.onSubmit}
      enableReinitialize
    >
      {({ isSubmitting }) => (
        <SidebarForm>
          <SidebarContent
            title={props.title}
            subtitle="Ausgewählte Einrichtung"
          >
            <Stack gap={2}>
              <DetailsCell
                name={fieldName("name")}
                label={"Name"}
                value={facility.name}
              />

              {isDefined(facility.contactAddress) && (
                <>
                  <Divider />
                  <BaseAddressDetailsColumn address={facility.contactAddress} />
                  {isDefined(facility.differentBillingAddress) && (
                    <>
                      <Divider />
                      <BaseAddressDetailsColumn
                        address={facility.differentBillingAddress}
                      />
                    </>
                  )}
                </>
              )}

              {showEmailPhoneSection && (
                <>
                  <Divider />

                  {facility.emailAddresses.map((email, index) => (
                    <DetailsCell
                      key={`${email}-${index}`}
                      name={fieldName("emailAddresses") + "." + index}
                      label={"E-Mail-Adresse"}
                      value={email}
                    />
                  ))}
                  {facility.phoneNumbers.map((phoneNumber, index) => (
                    <DetailsCell
                      key={`${phoneNumber}-${index}`}
                      name={fieldName("phoneNumbers") + "." + index}
                      label={"Telefonnummer"}
                      value={phoneNumber}
                    />
                  ))}
                </>
              )}

              <ContactPersonDetails
                contactPersons={facility.contactPersons ?? []}
              />
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

function ContactPersonDetails(props: {
  contactPersons: ApiFacilityContactPerson[];
}) {
  return (
    props.contactPersons.length > 0 && (
      <>
        <Divider />
        <Typography level={"title-md"}>Kontaktpersonen</Typography>
        <StyledAccordionGroup variant={"outlined"}>
          {props.contactPersons.map((person, index) => (
            <Accordion
              key={`${person.firstName}.${person.lastName}.${index}`}
              defaultExpanded={props.contactPersons.length < 2}
            >
              <AccordionSummary>
                {formatList([person.firstName, person.lastName], " ")}
              </AccordionSummary>
              <AccordionDetails>
                <DetailsRow>
                  <DetailsCell
                    name={"salutation"}
                    label={"Anrede"}
                    value={
                      isDefined(person.salutation)
                        ? SALUTATION_VALUES[person.salutation]
                        : undefined
                    }
                  />
                  <DetailsCell
                    name={"title"}
                    label={"Titel"}
                    value={getOptionalTitle(person.title)}
                  />
                </DetailsRow>
                <DetailsCell
                  name={"role"}
                  label={"Rolle"}
                  value={person.role}
                />
                <DetailsRow>
                  <DetailsCell
                    name={"firstName"}
                    label={"Vorname"}
                    value={person.firstName}
                  />
                  <DetailsCell
                    name={"lastName"}
                    label={"Nachname"}
                    value={person.lastName}
                  />
                </DetailsRow>
                <DetailsCell
                  name={"emailAddress"}
                  label={"E-Mail-Adresse"}
                  value={person.emailAddress}
                />
                <DetailsCell
                  name={"phoneNumber"}
                  label={"Telefonnummer"}
                  value={person.phoneNumber}
                />
              </AccordionDetails>
            </Accordion>
          ))}
        </StyledAccordionGroup>
      </>
    )
  );
}

const StyledAccordionGroup = styled(AccordionGroup)(({ theme }) => ({
  borderRadius: "lg",
  [`& .${accordionSummaryClasses.button}.${accordionSummaryClasses.button}:hover`]:
    {
      backgroundColor: "transparent",
      color: theme.palette.text.secondary,
    },
  [`& .${accordionDetailsClasses.content}`]: {
    boxShadow: `inset 0 1px ${theme.vars.palette.divider}`,
    [`&.${accordionDetailsClasses.expanded}`]: {
      paddingBlockStart: 1,
      display: "grid",
      gap: 1,
    },
  },
}));
