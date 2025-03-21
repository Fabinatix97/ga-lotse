/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { mapApiAddressToForm } from "@eshg/lib-employee-portal";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { ApiFacility } from "@eshg/measles-protection-api";

import {
  MeaslesFacility,
  usePatchFacilityMutation,
} from "@/lib/businessModules/measlesProtection/api/mutations/procedures";
import {
  LegacyFacilitySidebar,
  Mode,
} from "@/lib/shared/components/facilitySidebar/LegacyFacilitySidebar";
import { mapApiContactPersonToForm } from "@/lib/shared/helpers/facilityUtils";
import { useSearchParam } from "@/lib/shared/hooks/searchParams/useSearchParam";

import { MeaslesFacilityTypeSelect } from "./MeaslesFacilityTypeSelect";

function mapApiFacilityToBaseFacility(facility: ApiFacility): MeaslesFacility {
  return {
    name: facility.name,
    emailAddresses: facility.emailAddress ? [facility.emailAddress] : [],
    phoneNumbers: facility.phoneNumber ? [facility.phoneNumber] : [],
    type: facility.type,
    otherFacilityTypeInformation: facility.otherFacilityTypeInformation,
    contactPersons:
      facility.contactPersons?.map(mapApiContactPersonToForm) ?? [],
    contactAddress: mapApiAddressToForm(facility.contactAddress),
  };
}

export function EditFacilitySidebar({
  facility,
}: {
  facility: ApiFacility | undefined;
}) {
  const [open, setOpen] = useSearchParam("edit-facility", "boolean");
  const snackbar = useSnackbar();
  const patchFacilityMutation = usePatchFacilityMutation();

  function patchFacility(data: MeaslesFacility) {
    return patchFacilityMutation.mutateAsync({ facility: data }).then(() => {
      snackbar.confirmation("Einrichtung erfolgreich geändert.");
    });
  }

  if (!facility) {
    return;
  }
  return (
    <LegacyFacilitySidebar
      titleEdit="Einrichtung bearbeiten"
      open={open}
      onClose={() => setOpen(false)}
      onSubmit={patchFacility}
      mode={Mode.edit}
      facility={mapApiFacilityToBaseFacility(facility)}
      extraFieldsTop={<MeaslesFacilityTypeSelect />}
      extraFieldsInitialValues={{
        type: "",
        otherFacilityTypeInformation: "",
      }}
      contactPersonRequired={true}
    />
  );
}
