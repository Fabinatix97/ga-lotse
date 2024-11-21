/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ApiContactType,
  ApiGetReferenceFacilityResponse,
  ApiInboxProcedure,
  ApiProcedureStatus,
} from "@eshg/employee-portal-api/inspection";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { assertNever } from "@eshg/lib-portal/helpers/assertions";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

import {
  useAddInspectionFacility,
  useLinkBaseFacility,
} from "@/lib/businessModules/inspection/api/mutations/facility";
import { useFetchInboxProcedure } from "@/lib/businessModules/inspection/api/queries/inboxProcedures";
import { routes } from "@/lib/businessModules/inspection/shared/routes";
import { EmbeddedFacilitySidebar } from "@/lib/shared/components/facilitySidebar/FacilitySidebar";
import { DefaultFacilityFormValues } from "@/lib/shared/components/facilitySidebar/create/FacilityForm";
import { FacilitySearchFormValues } from "@/lib/shared/components/facilitySidebar/search/FacilitySearchForm";
import { BaseFacility } from "@/lib/shared/components/facilitySidebar/types";
import { BaseAddressFormInputs } from "@/lib/shared/components/form/address/helpers";
import {
  SidebarWithFormRefProps,
  useSidebarWithFormRef,
} from "@/lib/shared/hooks/useSidebarWithFormRef";

export function useInspectionInboxProcedureCreateSidebar() {
  const inboxProcedureId = useParams().id;

  const { open } = useSidebarWithFormRef({
    component: InspectionInboxProcedureCreateEmbeddedSidebar,
  });

  useEffect(() => {
    if (typeof inboxProcedureId === "string") {
      open({ inboxProcedureId });
    }
  }, [open, inboxProcedureId]);
}

function InspectionInboxProcedureCreateEmbeddedSidebar({
  onClose,
  formRef,
  inboxProcedureId,
}: SidebarWithFormRefProps & {
  inboxProcedureId: string;
}) {
  const { inboxProcedure } = useFetchInboxProcedure(inboxProcedureId).data;

  const router = useRouter();
  const snackbar = useSnackbar();
  const { mutate: linkBaseFacility } = useLinkBaseFacility();
  const { mutate: addInspectionFacility } = useAddInspectionFacility();

  function handleSaveFacility(facility: BaseFacility) {
    addInspectionFacility(
      { facility, inboxProcedureId },
      {
        onSuccess: ({ procedureId }) => {
          snackbar.confirmation("Einrichtung erfolgreich gespeichert.");
          router.push(routes.procedures.new(procedureId));
        },
      },
    );
    return Promise.resolve();
  }

  function handleSelectFacility(facility: ApiGetReferenceFacilityResponse) {
    linkBaseFacility(
      { facility, inboxProcedureId },
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

  const initialSearchInputs = inboxProcedure.contactDetails.facilityName
    ? {
        name: inboxProcedure.contactDetails.facilityName,
      }
    : undefined;

  return (
    <EmbeddedFacilitySidebar
      mode="default"
      title="Neuen Vorgang anlegen"
      searchResultHeaderComponent={false}
      initialSearchInputs={initialSearchInputs}
      onCreateNew={async (values) => {
        await handleSaveFacility(values.createInputs);
      }}
      onSelect={async (values) => {
        await handleSelectFacility(values.facility);
      }}
      sidebarFormRef={formRef}
      open={true}
      onClose={onClose}
      getInitialCreateInputs={(searchInputs?: FacilitySearchFormValues) => ({
        ...createBaseFacilityFromInboxProcedure(inboxProcedure, searchInputs),
      })}
    />
  );
}

function createBaseFacilityFromInboxProcedure(
  entry: ApiInboxProcedure,
  searchInputs?: FacilitySearchFormValues,
): Partial<DefaultFacilityFormValues> {
  const { contactDetails } = entry;
  const { address } = contactDetails;

  let contactAddress: BaseAddressFormInputs;
  switch (contactDetails.contactType) {
    case ApiContactType.PrivatePerson:
      contactAddress = {
        street: "",
        houseNumber: "",
        addressAddition: "",
        postalCode: "",
        city: "",
        type: "DomesticAddress",
        country: "DE",
        differentName: "",
        postbox: "",
      };
      break;
    case ApiContactType.Facility:
      contactAddress = {
        street: address?.street ?? "",
        houseNumber: address?.houseNumber ?? "",
        addressAddition: address?.addressAddition ?? "",
        postalCode: address?.postalCode ?? "",
        city: address?.city ?? "",
        type: address?.postboxNumber ? "PostboxAddress" : "DomesticAddress",
        country: "DE",
        differentName: "",
        postbox: address?.postboxNumber?.toString() ?? "",
      };
      break;
    default:
      assertNever(contactDetails.contactType, "Unknown contactType");
  }

  return {
    name: contactDetails.facilityName ?? searchInputs?.name ?? "",
    emailAddresses: contactDetails.emailAddress
      ? [contactDetails.emailAddress]
      : [""],
    phoneNumbers: contactDetails.phoneNumber
      ? [contactDetails.phoneNumber]
      : [""],
    contactAddress,
    contactPersons: [],
  };
}
