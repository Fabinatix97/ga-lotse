/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiGetReferenceFacilityResponse } from "@eshg/employee-portal-api/base";
import {
  ApiInspAddFacilityResponse,
  ApiProcedureStatus,
  ApiWebSearchEntry,
} from "@eshg/employee-portal-api/inspection";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { Card, Chip, Typography } from "@mui/joy";
import { useRouter } from "next/navigation";
import { isDefined } from "remeda";

import { FacilityCardContent } from "@/lib/baseModule/components/facility/FacilityCardContent";
import {
  useAddInspectionFacility,
  useLinkBaseFacility,
} from "@/lib/businessModules/inspection/api/mutations/facility";
import { routes } from "@/lib/businessModules/inspection/shared/routes";
import { OverlayBoundary } from "@/lib/shared/components/boundaries/OverlayBoundary";
import { EmbeddedFacilitySidebar } from "@/lib/shared/components/facilitySidebar/FacilitySidebar";
import { DefaultFacilityFormValues } from "@/lib/shared/components/facilitySidebar/create/FacilityForm";
import { BaseFacility } from "@/lib/shared/components/facilitySidebar/types";
import { Sidebar } from "@/lib/shared/components/sidebar/Sidebar";
import { fullAddress } from "@/lib/shared/helpers/facilityUtils";
import { useSidebarForm } from "@/lib/shared/hooks/useSidebarForm";

type FacilityWebSearchImportSidebarProps = Readonly<{
  open: boolean;
  webSearchEntry: ApiWebSearchEntry | undefined;
  onClose: () => void;
}>;

export function FacilityWebSearchImportSidebar(
  props: FacilityWebSearchImportSidebarProps,
) {
  return (
    <OverlayBoundary>
      <FacilityWebSearchImportSidebarWithinBoundary {...props} />
    </OverlayBoundary>
  );
}

function FacilityWebSearchImportSidebarWithinBoundary(
  props: FacilityWebSearchImportSidebarProps,
) {
  const snackbar = useSnackbar();
  const router = useRouter();
  const { mutate: linkBaseFacility } = useLinkBaseFacility();
  const { mutate: addInspectionFacility } = useAddInspectionFacility();

  const { handleClose, sidebarFormRef } = useSidebarForm({
    onClose: props.onClose,
  });

  function handleSaveFacility(
    facility: DefaultFacilityFormValues,
    webSearchEntryId: string,
  ) {
    addInspectionFacility(
      {
        facility,
        webSearchEntryId,
      },
      {
        onSuccess: afterSave,
      },
    );
    return Promise.resolve();
  }

  function afterSave(addFacilityResponse: ApiInspAddFacilityResponse) {
    snackbar.confirmation("Einrichtung erfolgreich gespeichert.");
    router.push(routes.procedures.new(addFacilityResponse.procedureId));
  }

  function handleSelectFacility(
    facility: ApiGetReferenceFacilityResponse,
    webSearchEntryId: string,
  ) {
    linkBaseFacility(
      {
        facility,
        webSearchEntryId,
      },
      {
        onSuccess: ({ inspectionId, procedureStatus, isNew }) => {
          if (procedureStatus !== ApiProcedureStatus.Draft) {
            router.push(routes.procedures.details(inspectionId));
          } else {
            router.push(routes.procedures.new(inspectionId));
          }
          if (isNew) {
            snackbar.confirmation("Vorgang erfolgreich angelegt.");
          } else {
            snackbar.notification(
              "Dies ist der neueste Vorgang für diese Einrichtung",
            );
          }
        },
      },
    );
    return Promise.resolve();
  }

  const webSearchEntry = props.webSearchEntry;

  return (
    <Sidebar open={props.open} onClose={handleClose}>
      {isDefined(webSearchEntry) && (
        <EmbeddedFacilitySidebar
          mode={"import"}
          title={"Neuen Vorgang anlegen"}
          searchResultHeaderComponent={
            <OsmFacilityCard
              facility={createBaseFacilityFromWebSearchEntry(webSearchEntry)}
            />
          }
          initialSearchInputs={{
            name: webSearchEntry.name,
          }}
          onCreateNew={async (values) => {
            await handleSaveFacility(values.createInputs, webSearchEntry.id);
          }}
          onSelect={async (values) => {
            await handleSelectFacility(values.facility, webSearchEntry.id);
          }}
          sidebarFormRef={sidebarFormRef}
          open={props.open}
          onClose={handleClose}
          getInitialCreateInputs={() => ({
            ...createBaseFacilityFromWebSearchEntry(webSearchEntry),
          })}
        />
      )}
    </Sidebar>
  );
}

function createBaseFacilityFromWebSearchEntry(
  entry: ApiWebSearchEntry,
): BaseFacility {
  return {
    name: entry.name,
    emailAddresses: entry.email ? [entry.email] : [""],
    phoneNumbers: entry.phoneNumber ? [entry.phoneNumber] : [""],
    contactAddress: {
      street: entry.street ?? "",
      houseNumber: entry.houseNumber ?? "",
      addressAddition: entry.addressAddition ?? "",
      postalCode: entry.postalCode,
      city: entry.city,
      type: "DomesticAddress",
      country: "DE",
      differentName: "",
      postbox: "",
    },
    contactPersons: [],
  };
}

function OsmFacilityCard({
  facility,
}: Readonly<{
  facility: BaseFacility | null;
}>) {
  const name = facility?.name ?? "";
  const address = fullAddress(facility?.contactAddress);
  return (
    <>
      <Card
        variant="soft"
        color="success"
        sx={{ mr: 3, border: "1px solid #A1E8A1" }}
      >
        <FacilityCardContent name={name} address={address} {...facility}>
          <Chip
            size="sm"
            variant="solid"
            color="neutral"
            sx={{ alignSelf: "end" }}
          >
            Open Street Map Daten
          </Chip>
        </FacilityCardContent>
      </Card>
      <Typography>Ergebnisse:</Typography>
    </>
  );
}
