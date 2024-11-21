/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiInspLinkBaseFacilityRequest } from "@eshg/employee-portal-api/inspection";
import { downloadFileAndOpen } from "@eshg/lib-portal/api/files/download";
import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { formatDate } from "@eshg/lib-portal/formatters/dateTime";

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
        mapBaseFacilityToApiAddFacilityFileStateRequest(facility);
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

  return useHandledMutation({
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
        document.body,
      ),
    onError: () =>
      snackbar.error("Fehler beim Export der untersagten Einrichtungen"),
  });
}
