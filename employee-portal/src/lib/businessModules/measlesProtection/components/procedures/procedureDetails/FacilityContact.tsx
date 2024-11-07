/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiFacilityContactPerson } from "@eshg/employee-portal-api/measlesProtection";
import { Row } from "@eshg/lib-portal/components/Row";
import { Grid, Sheet, Stack } from "@mui/joy";

import { DetailsCell } from "@/lib/shared/components/detailsSection/DetailsCell";
import { DetailsSection } from "@/lib/shared/components/detailsSection/DetailsSection";
import {
  ExternalLinkDetailsCell,
  emailHref,
} from "@/lib/shared/components/detailsSection/ExternalLinkDetailsCell";
import { SALUTATION_VALUES } from "@/lib/shared/components/personSidebar/constants";

export function FacilityContact({
  person,
}: {
  person: ApiFacilityContactPerson;
}) {
  return (
    <Sheet>
      <DetailsSection title="Kontaktperson der Einrichtung">
        <Stack gap={1}>
          <Row>
            <DetailsCell
              label="Anrede"
              value={person.salutation && SALUTATION_VALUES[person.salutation]}
            />
            <DetailsCell label="Titel" value={person.title} />
          </Row>
          <Row>
            <DetailsCell label="Vorname" value={person.firstName} />
            <DetailsCell label="Name" value={person.lastName} />
          </Row>
        </Stack>
        <Stack gap={1}>
          <ExternalLinkDetailsCell
            label="E-Mail-Adresse"
            value={person.emailAddress}
            href={emailHref}
          />
          <DetailsCell label="Telefonnummer" value={person.phoneNumber} />
        </Stack>
      </DetailsSection>
    </Sheet>
  );
}

export function FacilityContacts({
  persons = [],
}: {
  persons: ApiFacilityContactPerson[] | undefined;
}) {
  return (
    <Grid container spacing={3}>
      {persons.map((person) => (
        <Grid
          xs={6}
          key={person.firstName + person.lastName + person.emailAddress}
        >
          <FacilityContact person={person} />
        </Grid>
      ))}
    </Grid>
  );
}
