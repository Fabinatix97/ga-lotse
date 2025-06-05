/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useMutation } from "@tanstack/react-query";

import { ApiInspLinkBaseFacilityRequest } from "@eshg/inspection-api";
import {
  downloadFileAndOpen,
  formatDate,
  useHandledMutation,
  useSnackbar,
} from "@eshg/lib-portal";

import { useFacilityApi } from "@/lib/businessModules/inspection/api/clients";
import { DefaultFacilityFormValues } from "@/lib/shared/components/facilitySidebar/create/FacilityForm";
import { mapFacilityFormValuesToApiAddFacilityFileStateRequest } from "@/lib/shared/helpers/facilityUtils";

export function useUpdateInspectionFacility() {
  const facilityApi = useFacilityApi();
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: async ({
      procedureId,
      inspectionFacilityId,
      facility,
    }: {
      procedureId: string;
      inspectionFacilityId: string;
      facility: DefaultFacilityFormValues;
    }) => {
      const mappedBaseFacility =
        mapFacilityFormValuesToApiAddFacilityFileStateRequest(facility);
      return await facilityApi.updateFacility(inspectionFacilityId, {
        procedureId,
        baseFacility: mappedBaseFacility,
      });
    },
    onSuccess: () => {
      snackbar.confirmation("Einrichtung erfolgreich gespeichert.");
    },
  });
}

/**
 * This mutation creates a new inspection facility for a base facility.
 * If the optional `webSearchEntryId` parameter is given, then the server links
 * the base facility with the websearch entry, too (with a different state id!).
 * If the optional `inboxProcedureId` parameter is given, then the server copies
 * information form the inbox procedure to a progress entry of the newest
 * inspection procedure of this facility.
 */
export function useAddInspectionFacility() {
  const facilityApi = useFacilityApi();
  return useHandledMutation({
    mutationFn: ({
      facility,
      webSearchEntryId,
      inboxProcedureId,
    }: {
      facility: DefaultFacilityFormValues;
      webSearchEntryId?: string;
      inboxProcedureId?: string;
    }) => {
      const baseFacility =
        mapFacilityFormValuesToApiAddFacilityFileStateRequest(facility);
      return facilityApi.addFacility({
        baseFacility,
        webSearchEntryId,
        inboxProcedureId,
      });
    },
  });
}

/**
 * This mutation links a base facility with an inspection facility. If no
 * inspection facility exists yet, the server automatically creates a new one.
 * If the optional `webSearchEntryId` parameter is given, then the server links
 * the base facility with the websearch entry, too (with a different state id!).
 * If the optional `inboxProcedureId` parameter is given, then the server copies
 * information form the inbox procedure to a progress entry of the newest
 * inspection procedure of this facility.
 */
export function useLinkBaseFacility() {
  const inspFacilityApi = useFacilityApi();

  return useHandledMutation({
    mutationFn: async ({
      facility,
      webSearchEntryId,
      inboxProcedureId,
    }: ApiInspLinkBaseFacilityRequest) => {
      return await inspFacilityApi.linkBaseFacility({
        facility,
        webSearchEntryId,
        inboxProcedureId,
      });
    },
  });
}

export function useExportBannedFacilities() {
  const inspFacilityApi = useFacilityApi();
  const snackbar = useSnackbar();

  return useMutation({
    mutationFn: async () => {
      return await inspFacilityApi.exportBannedFacilities();
    },
    onSuccess: (result) =>
      downloadFileAndOpen(
        new File(
          [result],
          "untersagte-Einrichtungen-" +
            formatDate(new Date(), "de-DE").replaceAll(".", "-") +
            ".xlsx",
        ),
      ),
    onError: () =>
      snackbar.error("Fehler beim Export der untersagten Einrichtungen"),
  });
}
