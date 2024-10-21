/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ApiDraftMeaslesProcedure,
  ApiMeaslesProtectionProcedure,
} from "@eshg/employee-portal-api/measlesProtection";

import { PersonDetails } from "@/lib/businessModules/measlesProtection/components/procedures/procedureDetails/PersonDetails";
import { DetailsCard } from "@/lib/shared/components/detailsCard/DetailsCard";

import { ContactDetails } from "./ContactDetails";

export function AffectedPerson({
  procedure,
}: Readonly<{
  procedure: ApiMeaslesProtectionProcedure | ApiDraftMeaslesProcedure;
}>) {
  const title = "Betroffene Person";
  const person = procedure.affectedPerson;

  return (
    <DetailsCard title={title}>
      <PersonDetails person={person} />
      <ContactDetails persons={[person]} />
    </DetailsCard>
  );
}
