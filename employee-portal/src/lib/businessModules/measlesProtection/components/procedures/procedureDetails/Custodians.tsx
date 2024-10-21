/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiDraftMeaslesProcedure,
  ApiMeaslesProtectionProcedure,
} from "@eshg/employee-portal-api/measlesProtection";

import { PersonDetails } from "@/lib/businessModules/measlesProtection/components/procedures/procedureDetails/PersonDetails";
import { DetailsCard } from "@/lib/shared/components/detailsCard/DetailsCard";

import { ContactDetails } from "./ContactDetails";

export function Custodians({
  procedure,
}: {
  procedure: ApiMeaslesProtectionProcedure | ApiDraftMeaslesProcedure;
}) {
  const length = procedure?.custodians?.length ?? 0;
  if (procedure?.custodians == null || length === 0) {
    return;
  }
  const custodians = procedure.custodians ?? [];

  return custodians.map((person, index) => (
    <DetailsCard
      key={`custodian-${index}`}
      title="PSB - Personensorgeberechtigte:r"
    >
      <PersonDetails person={person} />
      <ContactDetails persons={[person]} />
    </DetailsCard>
  ));
}
