/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiGetPersonDiffResponse } from "@eshg/base-api";
import { Stack } from "@mui/joy";
import { useRouter } from "next/navigation";

import { centralFilePlaygroundRoutes } from "@/app/playground/centralFile/centralFilePlaygroundRoutes";
import { CentralFileSyncForm } from "@/lib/shared/components/centralFile/sync/CentralFileSyncForm";
import { BasePersonDiffForm } from "@/lib/shared/components/centralFile/sync/sections/BasePersonDiffForm";

const personUpdate: ApiGetPersonDiffResponse = {
  referenceVersion: 1,
  personDetailsDiff: {
    differingFields: [
      "salutation",
      "title",
      "lastName",
      "emailAddresses",
      "phoneNumbers",
    ],
    fileState: {
      title: "DR",
      lastName: "Meier",
      emailAddresses: ["test@test.com", "old@test.com"],
      phoneNumbers: ["+12345"],
      salutation: "NOT_SPECIFIED",

      firstName: "Günther",
      dateOfBirth: new Date("01-02-2004"),
    },
    reference: {
      salutation: "MALE",
      title: "PROF",
      lastName: "Maier",
      emailAddresses: ["new@test.com"],
      phoneNumbers: ["+54321", "+12345"],

      firstName: "Günther",
      dateOfBirth: new Date("01-02-2004"),
    },
  },
  contactAddressDiff: {
    differingFields: ["street", "houseNumber", "postalCode", "city"],
    fileState: undefined,
    reference: {
      type: "DomesticAddress",
      street: "Kleiner Weg",
      houseNumber: "1",
      postalCode: "54321",
      city: "Musterort",
      country: "DE",
    },
  },
  billingAddressDiff: {
    differingFields: [],
  },
};

export default function EditFlowApplyPage() {
  const router = useRouter();

  return (
    <Stack gap={3} marginBottom={3}>
      <CentralFileSyncForm
        title="Max Mustermann"
        onCancel={centralFilePlaygroundRoutes.acceptUpdate.index}
        onAccept={() => {
          router.push(centralFilePlaygroundRoutes.acceptUpdate.index);
          return Promise.resolve();
        }}
      >
        <BasePersonDiffForm diff={personUpdate} />
      </CentralFileSyncForm>
    </Stack>
  );
}
