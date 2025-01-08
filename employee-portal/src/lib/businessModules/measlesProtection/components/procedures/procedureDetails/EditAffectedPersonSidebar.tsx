/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  type ApiAffectedPerson,
  ApiDomesticAddress,
} from "@eshg/employee-portal-api/measlesProtection";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { toDateString } from "@eshg/lib-portal/helpers/dateTime";

import { MEASLES_PROTECTION_AFFECTED_PERSON_CONFIG } from "@/lib/businessModules/measlesProtection/components/procedures/createProceduresForm/NewPersonButton";
import { ApiFacilityAddressType } from "@/lib/shared/components/form/address/legacyTypes";
import { LegacyPersonSidebar } from "@/lib/shared/components/legacyPersonSidebar/LegacyPersonSidebar";
import { BASE_PERSON_VALUES } from "@/lib/shared/components/legacyPersonSidebar/form/LegacyBasePersonForm";
import { LegacyPerson } from "@/lib/shared/components/legacyPersonSidebar/form/LegacyPersonForm";
import { Mode } from "@/lib/shared/components/legacyPersonSidebar/personSidebarHelper";
import { useSearchParam } from "@/lib/shared/hooks/searchParams/useSearchParam";

export function EditAffectedPersonSidebar({
  person,
}: {
  readonly person: ApiAffectedPerson;
}) {
  const [open, setOpen] = useSearchParam("edit-affected", "boolean");
  const snackbar = useSnackbar();

  function handleClose() {
    setOpen(false);
  }

  return (
    <LegacyPersonSidebar
      open={open}
      mode={Mode.editInCentralFile}
      personFormTitle={"Betroffene Person bearbeiten"}
      config={MEASLES_PROTECTION_AFFECTED_PERSON_CONFIG}
      person={toPersonFormData(person)}
      onClose={handleClose}
      onSubmit={(_data) => {
        snackbar.notification("Hier passiert bald was.");
        return Promise.resolve();
      }}
    />
  );
}
function toPersonFormData(person: ApiAffectedPerson): LegacyPerson {
  const address = person.address as ApiDomesticAddress;
  return {
    ...BASE_PERSON_VALUES,
    salutation: person.salutation,
    title: person.title,
    firstName: person.firstName,
    lastName: person.lastName,
    dateOfBirth: toDateString(person.dateOfBirth),
    gender: person.gender,
    nameAtBirth: person.nameAtBirth,
    placeOfBirth: person.placeOfBirth,
    countryOfBirth: person.countryOfBirth ?? "",
    postalAddress: {
      ...address,
      houseNumber: address.houseNumber!,
      type: ApiFacilityAddressType.Postal,
      addressAddition: address.addressAddition?.trim() ?? "",
    },
    emailAddresses: person.emailAddresses ?? [],
    phoneNumbers: person.phoneNumbers ?? [],
  };
}
