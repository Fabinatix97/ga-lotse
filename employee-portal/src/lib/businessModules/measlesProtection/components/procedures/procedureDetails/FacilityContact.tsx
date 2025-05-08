/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Grid, Stack } from "@mui/joy";

import { DetailsItem } from "@eshg/lib-employee-portal";
import { Row } from "@eshg/lib-portal/components/Row";
import { SALUTATION_VALUES } from "@eshg/lib-portal/components/formFields/constants";
import { ApiFacilityContactPerson } from "@eshg/measles-protection-api";

import {
  ExternalLinkDetailsCell,
  emailHref,
} from "@/lib/shared/components/detailsSection/ExternalLinkDetailsCell";
import { InfoTile } from "@/lib/shared/components/infoTile/InfoTile";

function FacilityContact({ person }: { person: ApiFacilityContactPerson }) {
  return (
    <InfoTile
      title="Kontaktperson der Einrichtung"
      name="facilityContactPerson"
    >
      <Stack gap={1}>
        <Row>
          <DetailsItem
            label="Anrede"
            value={person.salutation && SALUTATION_VALUES[person.salutation]}
          />
          <DetailsItem label="Titel" value={person.title} />
        </Row>
        <Row>
          <DetailsItem label="Vorname" value={person.firstName} />
          <DetailsItem label="Name" value={person.lastName} />
        </Row>
      </Stack>
      <Stack gap={1}>
        <ExternalLinkDetailsCell
          label="E-Mail-Adresse"
          value={person.emailAddress}
          href={emailHref}
        />
        <DetailsItem label="Telefonnummer" value={person.phoneNumber} />
      </Stack>
    </InfoTile>
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
          key={person.firstName + person.lastName + person.emailAddress}
          xs={6}
        >
          <FacilityContact person={person} />
        </Grid>
      ))}
    </Grid>
  );
}
