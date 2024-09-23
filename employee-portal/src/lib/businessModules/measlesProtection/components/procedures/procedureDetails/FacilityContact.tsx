/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiFacilityContactPerson } from "@eshg/employee-portal-api/measlesProtection";
import { Grid } from "@mui/joy";

import { Row } from "@/lib/shared/Row";
import { SALUTATION_VALUES } from "@/lib/shared/components/personSidebar/constants";

import { DetailCard } from "./DetailCard";
import { LabeledValue, ValueList } from "./LabeledValue";

export function FacilityContact({
  person,
}: {
  person: ApiFacilityContactPerson;
}) {
  return (
    <DetailCard title="Kontaktperson der Einrichtung">
      <ValueList>
        <Row>
          <LabeledValue
            label="Anrede"
            value={person.salutation && SALUTATION_VALUES[person.salutation]}
          />
          <LabeledValue label="Titel" value={person.title} />
        </Row>
        <Row>
          <LabeledValue label="Vorname" value={person.firstName} />
          <LabeledValue label="Name" value={person.lastName} />
        </Row>
      </ValueList>
      <ValueList>
        <LabeledValue
          label="E-Mail-Adresse"
          value={person.emailAddress}
          href={`mailto:${person.emailAddress}`}
        />
        <LabeledValue
          label="Telefonnummer"
          value={person.phoneNumber}
          href={`tel:${person.phoneNumber}`}
        />
      </ValueList>
    </DetailCard>
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
