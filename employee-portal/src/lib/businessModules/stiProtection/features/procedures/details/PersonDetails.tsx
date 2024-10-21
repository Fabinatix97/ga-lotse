/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiStiProtectionProcedure } from "@eshg/employee-portal-api/stiProtection";

import { GENDER_VALUES } from "@/lib/businessModules/stiProtection/shared/constants";
import { COUNTRY_CODE_LABELS } from "@/lib/businessModules/stiProtection/shared/countryCodes";
import { createOnlyIfProcedureOpen } from "@/lib/businessModules/stiProtection/shared/helpers";
import { EditButton } from "@/lib/shared/components/buttons/EditButton";
import { DetailsCard } from "@/lib/shared/components/detailsCard/DetailsCard";
import {
  LabeledValue,
  ValueList,
} from "@/lib/shared/components/detailsCard/LabeledValue";

export function PersonDetails({
  procedure,
}: Readonly<{ procedure: ApiStiProtectionProcedure }>) {
  const onlyIfOpen = createOnlyIfProcedureOpen(procedure);
  return (
    <DetailsCard
      title="Person"
      actionButton={onlyIfOpen(<EditButton aria-label="Person bearbeiten" />)}
    >
      <ValueList>
        <LabeledValue label="Aktenzeichen" value="-" />
        <LabeledValue
          label="Geburtsjahr"
          value={procedure.person.yearOfBirth.toString()}
        />
        <LabeledValue
          label="Geschlecht"
          value={GENDER_VALUES[procedure.person.gender]}
        />
      </ValueList>
      <ValueList>
        <LabeledValue
          label="Geburtsland"
          value={
            procedure.person.countryOfBirth
              ? COUNTRY_CODE_LABELS[procedure.person.countryOfBirth]
              : undefined
          }
        />
        <LabeledValue
          label="In Deutschland seit"
          value={procedure.person.inGermanySince?.toString()}
        />
      </ValueList>
    </DetailsCard>
  );
}
