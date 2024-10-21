/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiFacilityContactPerson } from "@eshg/employee-portal-api/measlesProtection";
import { Row } from "@eshg/lib-portal/components/Row";
import { Grid } from "@mui/joy";

import { DetailsCard } from "@/lib/shared/components/detailsCard/DetailsCard";
import {
  LabeledValue,
  ValueList,
} from "@/lib/shared/components/detailsCard/LabeledValue";
import { SALUTATION_VALUES } from "@/lib/shared/components/personSidebar/constants";

export function FacilityContact({
  person,
}: {
  person: ApiFacilityContactPerson;
}) {
  return (
    <DetailsCard title="Kontaktperson der Einrichtung">
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
    </DetailsCard>
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
