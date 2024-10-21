/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiAffectedPerson,
  ApiCustodian,
} from "@eshg/employee-portal-api/measlesProtection";
import { Row } from "@eshg/lib-portal/components/Row";
import { formatDate } from "@eshg/lib-portal/formatters/dateTime";

import { AddressDetails } from "@/lib/businessModules/measlesProtection/components/procedures/procedureDetails/AddressDetails";
import {
  LabeledValue,
  ValueList,
} from "@/lib/shared/components/detailsCard/LabeledValue";
import {
  GENDER_VALUES,
  SALUTATION_VALUES,
  getOptionalTitle,
} from "@/lib/shared/components/personSidebar/constants";

type Person = ApiAffectedPerson | ApiCustodian;
interface PersonDetailsProps {
  person: Person;
}

export function PersonDetails({ person }: PersonDetailsProps) {
  return (
    <>
      <ValueList>
        {(person.salutation ?? person.title) && (
          <Row justifyContent="start">
            <LabeledValue
              label="Anrede"
              value={person.salutation && SALUTATION_VALUES[person.salutation]}
            />
            <LabeledValue
              label="Titel"
              value={getOptionalTitle(person.title)}
            />
          </Row>
        )}
        <LabeledValue label="Vorname" value={person.firstName} />
        <LabeledValue label="Name" value={person.lastName} />
        <Row justifyContent="start">
          <LabeledValue
            label="Geburtsdatum"
            value={formatDate(person.dateOfBirth)}
          />
          <LabeledValue
            label="Geschlecht"
            value={person.gender && GENDER_VALUES[person.gender]}
          />
        </Row>
      </ValueList>
      <AddressDetails address={person.address} />
    </>
  );
}
