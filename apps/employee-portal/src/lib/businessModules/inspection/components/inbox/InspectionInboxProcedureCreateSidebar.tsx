/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useRouter } from "next/navigation";

import {
  ApiBusinessModule,
  ApiContactType,
  ApiGetReferenceFacilityResponse,
  ApiInboxProcedure,
  ApiProcedureStatus,
} from "@eshg/inspection-api";
import {
  BaseAddressFormInputs,
  SidebarWithFormRefProps,
  UseSidebarWithFormRefResult,
  useFetchInboxProcedure,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";
import { assertNever, useSnackbar } from "@eshg/lib-portal";

import { useInboxProcedureApi } from "@/lib/businessModules/inspection/api/clients";
import {
  useAddInspectionFacility,
  useLinkBaseFacility,
} from "@/lib/businessModules/inspection/api/mutations/facility";
import { routes } from "@/lib/businessModules/inspection/shared/routes";
import { FacilitySidebar } from "@/lib/shared/components/facilitySidebar/FacilitySidebar";
import { DefaultFacilityFormValues } from "@/lib/shared/components/facilitySidebar/create/FacilityForm";
import { FacilitySearchFormValues } from "@/lib/shared/components/facilitySidebar/search/FacilitySearchForm";

export function useInspectionInboxProcedureCreateSidebar(): UseSidebarWithFormRefResult<InspectionInboxProcedureCreateSidebarProps> {
  return useSidebarWithFormRef({
    component: InspectionInboxProcedureCreateSidebar,
  });
}

interface InspectionInboxProcedureCreateSidebarProps
  extends SidebarWithFormRefProps {
  inboxProcedureId: string;
}

function InspectionInboxProcedureCreateSidebar({
  onClose,
  formRef,
  inboxProcedureId,
}: InspectionInboxProcedureCreateSidebarProps) {
  const inboxProcedureApi = useInboxProcedureApi();
  const { inboxProcedure } = useFetchInboxProcedure(
    inboxProcedureApi,
    ApiBusinessModule.Inspection,
    inboxProcedureId,
  ).data;

  const router = useRouter();
  const snackbar = useSnackbar();
  const { mutateAsync: linkBaseFacility } = useLinkBaseFacility();
  const { mutateAsync: addInspectionFacility } = useAddInspectionFacility();

  function handleSaveFacility(facility: DefaultFacilityFormValues) {
    return addInspectionFacility(
      { facility, inboxProcedureId },
      {
        onSuccess: ({ procedureId }) => {
          snackbar.confirmation("Einrichtung erfolgreich gespeichert.");
          router.push(routes.procedures.new(procedureId));
        },
      },
    );
  }

  function handleSelectFacility(facility: ApiGetReferenceFacilityResponse) {
    return linkBaseFacility(
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
  }

  const initialSearchInputs = inboxProcedure.contactDetails.facilityName
    ? {
        name: inboxProcedure.contactDetails.facilityName,
      }
    : undefined;

  return (
    <FacilitySidebar
      mode="default"
      title="Neuen Vorgang anlegen"
      searchResultHeaderComponent={false}
      initialSearchInputs={initialSearchInputs}
      formRef={formRef}
      getInitialCreateInputs={(searchInputs?: FacilitySearchFormValues) => ({
        ...createBaseFacilityFromInboxProcedure(inboxProcedure, searchInputs),
      })}
      onCreateNew={async (values) => {
        await handleSaveFacility(values.createInputs);
      }}
      onSelect={async (values) => {
        await handleSelectFacility(values.facility);
      }}
      onClose={onClose}
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
