/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ApiAddCustodianRequest,
  ApiCustodianDetails,
} from "@eshg/measles-protection-api";
import { Add } from "@mui/icons-material";
import { Button, Sheet } from "@mui/joy";

import { mapToApiPersonAddress } from "@/lib/businessModules/measlesProtection/shared/helpers";
import { DetailsSection } from "@/lib/shared/components/detailsSection/DetailsSection";
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
    <Sheet>
      <DetailsSection title={"PSB - Personensorgeberechtigte:r"}>
        <div>
          <Button
            startDecorator={<Add />}
            variant="plain"
            onClick={() => setAddCustodianOpen(true)}
          >
            Hinzufügen
          </Button>
        </div>
      </DetailsSection>
    </Sheet>
  );
}
