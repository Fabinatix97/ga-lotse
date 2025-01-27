/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { toDateString } from "@eshg/lib-portal/helpers/dateTime";
import { ApiCustodian, ApiDomesticAddress } from "@eshg/measles-protection-api";

import { MEASLES_PROTECTION_CUSTODIAN_CONFIG } from "@/lib/businessModules/measlesProtection/components/procedures/procedureDetails/NewCustodianButton";
import { ApiFacilityAddressType } from "@/lib/shared/components/form/address/legacyTypes";
import { LegacyPersonSidebar } from "@/lib/shared/components/legacyPersonSidebar/LegacyPersonSidebar";
import { BASE_PERSON_VALUES } from "@/lib/shared/components/legacyPersonSidebar/form/LegacyBasePersonForm";
import { LegacyPerson } from "@/lib/shared/components/legacyPersonSidebar/form/LegacyPersonForm";
import { Mode } from "@/lib/shared/components/legacyPersonSidebar/personSidebarHelper";
import { useSearchParam } from "@/lib/shared/hooks/searchParams/useSearchParam";

export function EditCustodianSidebar({
  custodians,
}: {
  custodians: ApiCustodian[] | undefined;
}) {
  const [editIndex, setEditIndex] = useSearchParam("edit-custodian", "number");
  const open = editIndex != null;
  const custodian =
    editIndex != null ? (custodians ?? [])[editIndex] : undefined;
  const snackbar = useSnackbar();

  function onClose() {
    setEditIndex(null);
  }

  function onSubmit() {
    snackbar.confirmation("Änderungen an PSB erfolgreich gespeichert.");
    return Promise.resolve();
  }

  return (
    <LegacyPersonSidebar
      open={open}
      onClose={onClose}
      personFormTitle={"PSB bearbeiten"}
      config={MEASLES_PROTECTION_CUSTODIAN_CONFIG}
      onSubmit={onSubmit}
      mode={Mode.editInCentralFile}
      person={mapToPerson(custodian)}
    />
  );
}
export function mapToPerson(
  custodian: ApiCustodian | undefined,
): LegacyPerson | undefined {
  if (!custodian) {
    return;
  }
  const address = custodian.address as ApiDomesticAddress;
  return {
    ...BASE_PERSON_VALUES,
    ...custodian,
    dateOfBirth: toDateString(custodian.dateOfBirth),
    emailAddresses: custodian.emailAddresses ?? [],
    phoneNumbers: custodian.phoneNumbers ?? [],
    postalAddress: {
      ...address,
      houseNumber: address.houseNumber!,
      addressAddition: address.addressAddition ?? "",
      type: ApiFacilityAddressType.Postal,
    },
  };
}
