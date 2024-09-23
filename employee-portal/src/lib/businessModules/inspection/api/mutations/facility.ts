/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiInspLinkBaseFacilityRequest } from "@eshg/employee-portal-api/inspection";
import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";

import { useFacilityApi } from "@/lib/businessModules/inspection/api/clients";
import { DefaultFacilityFormValues } from "@/lib/shared/components/facilitySidebar/create/FacilityForm";
import { BaseFacility } from "@/lib/shared/components/facilitySidebar/types";
import { mapBaseFacilityToApiAddFacilityFileStateRequest } from "@/lib/shared/helpers/facilityUtils";

export function useUpdateInspectionFacility() {
  const facilityApi = useFacilityApi();
  return useHandledMutation({
    mutationFn: async ({
      procedureId,
      inspectionFacilityId,
      baseFacility,
    }: {
      procedureId: string;
      inspectionFacilityId: string;
      baseFacility: BaseFacility;
    }) => {
      const mappedBaseFacility =
        mapBaseFacilityToApiAddFacilityFileStateRequest(baseFacility);
      return await facilityApi.updateFacility(inspectionFacilityId, {
        ...baseFacility,
        procedureId,
        baseFacility: mappedBaseFacility,
      });
    },
  });
}

/**
 * This mutation creates a new inspection facility for a base facility.
 * If the optional `webSearchEntryId` parameter is given, then the server links
 * the base facility with the websearch entry, too (with a different state id!).
 */
export function useAddInspectionFacility() {
  const facilityApi = useFacilityApi();
  return useHandledMutation({
    mutationFn: ({
      facility,
      webSearchEntryId,
    }: {
      facility: DefaultFacilityFormValues;
      webSearchEntryId?: string;
    }) => {
      const baseFacility =
        mapBaseFacilityToApiAddFacilityFileStateRequest(facility);
      return facilityApi.addFacility({
        baseFacility,
        webSearchEntryId,
      });
    },
  });
}

/**
 * This mutation links a base facility with an inspection facility. If no
 * inspection facility exists yet, the server automatically creates a new one.
 * If the optional `webSearchEntryId` parameter is given, then the server links
 * the base facility with the websearch entry, too (with a different state id!).
 */
export function useLinkBaseFacility() {
  const inspFacilityApi = useFacilityApi();

  return useHandledMutation({
    mutationFn: async ({
      facility,
      webSearchEntryId,
    }: ApiInspLinkBaseFacilityRequest) => {
      return await inspFacilityApi.linkBaseFacility({
        facility,
        webSearchEntryId,
      });
    },
  });
}
