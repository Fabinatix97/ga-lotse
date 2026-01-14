/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

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

import {
  ApiFacilityContactPerson,
  ApiGetReferenceFacilityResponse,
} from "@eshg/base-api";
import {
  BaseAddressDetailsColumn,
  DetailsItem,
  DetailsRow,
  MultiFormButtonBar,
  SidebarActions,
  SidebarContent,
  SidebarForm,
} from "@eshg/lib-employee-portal";
import {
  DetailsList,
  SALUTATION_VALUES,
  formatList,
  getOptionalTitle,
} from "@eshg/lib-portal";

import {
  MeaslesFacilityTypeSelect,
  MeaslesFacilityTypeSelectFormValues,
} from "@/lib/businessModules/measlesProtection/components/procedures/procedureDetails/MeaslesFacilityTypeSelect";

export type ReferenceFacilityWithOptionalMeaslesFacilityType =
  ApiGetReferenceFacilityResponse & {
    measlesFacilityType?: MeaslesFacilityTypeSelectFormValues;
  };

interface FacilityDetailsSidebarProps {
  title: string;
  submitLabel: string;
  facility: ReferenceFacilityWithOptionalMeaslesFacilityType;
  onSubmit: (
    values: ReferenceFacilityWithOptionalMeaslesFacilityType,
  ) => Promise<void>;
  onBack?: () => void;
  onCancel: () => void;
  showMeaslesFacilityType?: boolean;
}

export function FacilityDetailsSidebar(props: FacilityDetailsSidebarProps) {
  const facility = props.facility;
  const showEmailPhoneSection =
    facility.phoneNumbers.length + facility.emailAddresses.length > 0;
  return (
    <Formik
      initialValues={{
        ...props.facility,
        measlesFacilityType: { type: "", otherFacilityTypeInformation: "" },
      }}
      enableReinitialize
      onSubmit={props.onSubmit}
    >
      {({ isSubmitting }) => (
        <SidebarForm aria-label={props.title}>
          <SidebarContent
            title={props.title}
            subtitle="Ausgewählte Einrichtung"
          >
            <DetailsList>
              <Stack gap={2}>
                <DetailsItem label="Name" value={facility.name} />
                {props.showMeaslesFacilityType && <MeaslesFacilityTypeSelect />}

                {isDefined(facility.contactAddress) && (
                  <>
                    <Divider />
                    <BaseAddressDetailsColumn
                      address={facility.contactAddress}
                    />
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
                      <DetailsItem
                        key={`${email}-${index}`}
                        label="E-Mail-Adresse"
                        value={email}
                      />
                    ))}
                    {facility.phoneNumbers.map((phoneNumber, index) => (
                      <DetailsItem
                        key={`${phoneNumber}-${index}`}
                        label="Telefonnummer"
                        value={phoneNumber}
                      />
                    ))}
                  </>
                )}

                <ContactPersonDetails
                  contactPersons={facility.contactPersons ?? []}
                />
              </Stack>
            </DetailsList>
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
        <Typography level="title-md">Kontaktpersonen</Typography>
        <StyledAccordionGroup variant="outlined">
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
                  <DetailsItem
                    label="Anrede"
                    value={
                      isDefined(person.salutation)
                        ? SALUTATION_VALUES[person.salutation]
                        : undefined
                    }
                  />
                  <DetailsItem
                    label="Titel"
                    value={getOptionalTitle(person.title)}
                  />
                </DetailsRow>
                <DetailsItem label="Rolle" value={person.role} />
                <DetailsRow>
                  <DetailsItem label="Vorname" value={person.firstName} />
                  <DetailsItem label="Nachname" value={person.lastName} />
                </DetailsRow>
                <DetailsItem
                  label="E-Mail-Adresse"
                  value={person.emailAddress}
                />
                <DetailsItem label="Telefonnummer" value={person.phoneNumber} />
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
