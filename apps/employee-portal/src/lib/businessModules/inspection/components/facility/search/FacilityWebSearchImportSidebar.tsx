/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Card, Chip, Typography } from "@mui/joy";
import { useRouter } from "next/navigation";

import { ApiGetReferenceFacilityResponse } from "@eshg/base-api";
import {
  ApiInspAddFacilityResponse,
  ApiProcedureStatus,
  ApiWebSearchEntry,
} from "@eshg/inspection-api";
import {
  SidebarWithFormRefProps,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";
import { useSnackbar } from "@eshg/lib-portal";

import { FacilityCardContent } from "@/lib/baseModule/components/facility/FacilityCardContent";
import {
  useAddInspectionFacility,
  useLinkBaseFacility,
} from "@/lib/businessModules/inspection/api/mutations/facility";
import { routes } from "@/lib/businessModules/inspection/shared/routes";
import { FacilitySidebar } from "@/lib/shared/components/facilitySidebar/FacilitySidebar";
import { DefaultFacilityFormValues } from "@/lib/shared/components/facilitySidebar/create/FacilityForm";
import { BaseFacility } from "@/lib/shared/components/facilitySidebar/types";
import { fullAddress } from "@/lib/shared/helpers/facilityUtils";

type FacilityWebSearchImportSidebarProps = Readonly<{
  webSearchEntry: ApiWebSearchEntry | undefined;
}> &
  SidebarWithFormRefProps;

export function useFacilityWebSearchImportSidebar() {
  return useSidebarWithFormRef({
    component: FacilityWebSearchImportSidebar,
  });
}

function FacilityWebSearchImportSidebar(
  props: FacilityWebSearchImportSidebarProps,
) {
  const snackbar = useSnackbar();
  const router = useRouter();
  const { mutateAsync: linkBaseFacility } = useLinkBaseFacility();
  const { mutateAsync: addInspectionFacility } = useAddInspectionFacility();

  function handleSaveFacility(
    facility: DefaultFacilityFormValues,
    webSearchEntryId: string,
  ) {
    return addInspectionFacility(
      {
        facility,
        webSearchEntryId,
      },
      {
        onSuccess: afterSave,
      },
    );
  }

  function afterSave(addFacilityResponse: ApiInspAddFacilityResponse) {
    snackbar.confirmation("Einrichtung erfolgreich gespeichert.");
    router.push(routes.procedures.new(addFacilityResponse.procedureId));
  }

  function handleSelectFacility(
    facility: ApiGetReferenceFacilityResponse,
    webSearchEntryId: string,
  ) {
    return linkBaseFacility(
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
  }

  const webSearchEntry = props.webSearchEntry;

  if (webSearchEntry === undefined) {
    return null;
  }

  return (
    <FacilitySidebar
      mode="import"
      title="Neuen Vorgang anlegen"
      searchResultHeaderComponent={
        <OsmFacilityCard
          facility={createBaseFacilityFromWebSearchEntry(webSearchEntry)}
        />
      }
      initialSearchInputs={{
        name: webSearchEntry.name,
      }}
      formRef={props.formRef}
      getInitialCreateInputs={() => ({
        ...createBaseFacilityFromWebSearchEntry(webSearchEntry),
      })}
      onCreateNew={async (values) => {
        await handleSaveFacility(values.createInputs, webSearchEntry.id);
      }}
      onSelect={async (values) => {
        await handleSelectFacility(values.facility, webSearchEntry.id);
      }}
      onClose={props.onClose}
    />
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
