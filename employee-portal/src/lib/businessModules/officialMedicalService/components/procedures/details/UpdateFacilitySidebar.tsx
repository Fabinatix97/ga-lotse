/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiFacility } from "@eshg/employee-portal-api/officialMedicalService";

import { usePatchFacility } from "@/lib/businessModules/officialMedicalService/api/mutations/employeeOmsProcedureApi";
import {
  mapApiFacilityToDefaultFacilityFormValues,
  mapToApiPatchFacilityRequest,
} from "@/lib/businessModules/officialMedicalService/shared/helpers";
import {
  DefaultFacilityFormValues,
  FacilityForm,
} from "@/lib/shared/components/facilitySidebar/create/FacilityForm";
import { SidebarWithFormRefProps } from "@/lib/shared/hooks/useSidebarWithFormRef";

interface UpdateFacilitySidebarProps extends SidebarWithFormRefProps {
  procedureId: string;
  facility: ApiFacility;
}

export function UpdateFacilitySidebar({
  procedureId,
  facility,
  formRef,
  onClose,
}: Readonly<UpdateFacilitySidebarProps>) {
  const patchFacility = usePatchFacility();

  async function handleSubmit(values: DefaultFacilityFormValues) {
    await patchFacility.mutateAsync(
      {
        id: procedureId,
        request: mapToApiPatchFacilityRequest(values, facility.version),
      },
      {
        onSuccess: () => {
          onClose(true);
        },
      },
    );
  }

  return (
    <FacilityForm
      title="Auftraggeber bearbeiten"
      onSubmit={handleSubmit}
      onCancel={onClose}
      sidebarFormRef={formRef}
      initialValues={mapApiFacilityToDefaultFacilityFormValues(facility)}
      mode="edit"
      submitLabel="Speichern"
    />
  );
}
