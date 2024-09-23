/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiDraftMeaslesProcedure } from "@eshg/employee-portal-api/measlesProtection";
import { doNothing } from "remeda";

import {
  MeaslesFacility,
  useAddFacilityMutation,
} from "@/lib/businessModules/measlesProtection/api/mutations/procedures";
import { LegacyFacilitySidebar } from "@/lib/shared/components/facilitySidebar/LegacyFacilitySidebar";
import { useSearchParam } from "@/lib/shared/hooks/searchParams/useSearchParam";

import { MeaslesFacilityTypeSelect } from "./MeaslesFacilityTypeSelect";

export function NewFacilitySidebar({
  procedure,
}: {
  procedure: ApiDraftMeaslesProcedure;
}) {
  const [open, setOpen] = useSearchParam("new-facility", "boolean");

  const addFacility = useAddFacilityMutation({
    // nothing to do because FacilitySidebar already displays default save message,
    // closes sidebar and resets form
    onSuccess: doNothing,
  });

  async function handleSaveFacility(facility: MeaslesFacility) {
    return addFacility
      .mutateAsync({ procedureId: procedure.id, facility })
      .catch();
  }

  return (
    <LegacyFacilitySidebar
      open={open}
      onClose={() => setOpen(false)}
      onSubmit={handleSaveFacility}
      extraFieldsTop={<MeaslesFacilityTypeSelect />}
      extraFieldsInitialValues={{
        type: "",
        otherFacilityTypeInformation: "",
      }}
      contactPersonRequired={true}
      contactPersonSalutationRequired={false}
      contactPersonTitleRequired={false}
      contactPersonRoleRequired={false}
    />
  );
}
