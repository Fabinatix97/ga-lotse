/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ApiAddCustodianRequest,
  ApiCustodianDetails,
} from "@eshg/employee-portal-api/measlesProtection";
import { Add } from "@mui/icons-material";
import { Button } from "@mui/joy";

import { DetailCard } from "@/lib/businessModules/measlesProtection/components/procedures/procedureDetails/DetailCard";
import { mapToApiPersonAddress } from "@/lib/businessModules/measlesProtection/shared/helper";
import {
  LegacyPerson,
  LegacyPersonFormConfig,
  PERSON_VALUES,
} from "@/lib/shared/components/legacyPersonSidebar/form/LegacyPersonForm";
import { useSearchParam } from "@/lib/shared/hooks/searchParams/useSearchParam";

export const MEASLES_PROTECTION_CUSTODIAN_CONFIG: LegacyPersonFormConfig = {
  hiddenFields: ["billingAddress"],
  optionalFields: [
    "salutation",
    "title",
    "gender",
    "nameAtBirth",
    "placeOfBirth",
    "countryOfBirth",
    "emailAddresses",
    "phoneNumbers",
  ],
  disabledFields: ["firstName", "lastName", "dateOfBirth"],
};

function excludeEmptyStrings(strings?: string[]): string[] | undefined {
  return strings?.map((a) => a.trim()).filter((a) => a.length > 0);
}

function mapToApiCustodianDetails(
  basePerson: LegacyPerson,
): ApiCustodianDetails {
  return {
    ...PERSON_VALUES,
    address: mapToApiPersonAddress(basePerson.postalAddress),
    dateOfBirth: new Date(basePerson.dateOfBirth),
    firstName: basePerson.firstName,
    lastName: basePerson.lastName,
    salutation: undefined, // TODO: Use ApiGender in backend
    gender: basePerson.gender,
    title: basePerson.title,
    phoneNumbers: excludeEmptyStrings(basePerson.phoneNumbers),
    emailAddresses: excludeEmptyStrings(basePerson.emailAddresses),
  };
}

export function mapToAddCustodianRequest(
  basePerson: LegacyPerson,
): ApiAddCustodianRequest {
  return {
    custodian: mapToApiCustodianDetails(basePerson),
  };
}

export function NewCustodianButton() {
  const [_, setAddCustodianOpen] = useSearchParam("add-custodian", "boolean");
  return (
    <DetailCard title={"PSB - Personensorgeberechtigte:r"}>
      <Button
        startDecorator={<Add />}
        variant="plain"
        onClick={() => setAddCustodianOpen(true)}
      >
        Hinzufügen
      </Button>
    </DetailCard>
  );
}
