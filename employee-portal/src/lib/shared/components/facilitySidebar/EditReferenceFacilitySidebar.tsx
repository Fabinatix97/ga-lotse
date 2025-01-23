/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiGetReferenceFacilityResponse } from "@eshg/base-api";
import { isDefined } from "remeda";

import { useUpdateReferenceFacility } from "@/lib/baseModule/api/mutations/facility";
import {
  DefaultFacilityFormValues,
  FacilityForm,
} from "@/lib/shared/components/facilitySidebar/create/FacilityForm";
import { mapApiAddressToForm } from "@/lib/shared/components/form/address/helpers";
import { mapApiContactPersonToForm } from "@/lib/shared/helpers/facilityUtils";
import {
  SidebarWithFormRefProps,
  useSidebarWithFormRef,
} from "@/lib/shared/hooks/useSidebarWithFormRef";

interface EditReferenceFacilitySidebarProps extends SidebarWithFormRefProps {
  facility: ApiGetReferenceFacilityResponse;
}

function EditReferenceFacilitySidebar(
  props: EditReferenceFacilitySidebarProps,
) {
  const updateReferenceFacility = useUpdateReferenceFacility(
    props.facility.id,
    props.facility.version,
  );

  async function handleSubmit(values: DefaultFacilityFormValues) {
    await updateReferenceFacility.mutateAsync(values, {
      onSuccess: () => props.onClose(true),
    });
  }

  return (
    <FacilityForm
      title="Einrichtung bearbeiten"
      onSubmit={handleSubmit}
      onCancel={() => props.onClose()}
      sidebarFormRef={props.formRef}
      initialValues={mapReferenceFacilityToForm(props.facility)}
      addressOptional
      mode="edit"
      submitLabel="Speichern"
    />
  );
}

export function useEditReferenceFacilitySidebar() {
  return useSidebarWithFormRef({
    component: EditReferenceFacilitySidebar,
  });
}

function mapReferenceFacilityToForm(
  facility: ApiGetReferenceFacilityResponse,
): DefaultFacilityFormValues {
  return {
    name: facility.name,
    emailAddresses:
      facility.emailAddresses.length > 0 ? facility.emailAddresses : [""],
    phoneNumbers:
      facility.phoneNumbers.length > 0 ? facility.phoneNumbers : [""],
    contactPersons: facility.contactPersons.map(mapApiContactPersonToForm),
    contactAddress: isDefined(facility.contactAddress)
      ? mapApiAddressToForm(facility.contactAddress)
      : undefined,
    differentBillingAddress: isDefined(facility.differentBillingAddress)
      ? mapApiAddressToForm(facility.differentBillingAddress)
      : undefined,
  };
}
