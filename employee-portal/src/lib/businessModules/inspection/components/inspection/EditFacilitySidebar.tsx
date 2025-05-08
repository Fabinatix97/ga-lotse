/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiGetFacilityFileStateResponse } from "@eshg/inspection-api";
import {
  SidebarWithFormRefProps,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";

import {
  DefaultFacilityFormValues,
  FacilityForm,
} from "@/lib/shared/components/facilitySidebar/create/FacilityForm";
import { mapApiFacilityStateToFacilityFormValues } from "@/lib/shared/helpers/facilityUtils";

export function useEditFacilitySidebar() {
  return useSidebarWithFormRef({
    component: EmbeddedEditFacilitySidebar,
  });
}

interface EditFacilitySidebarProps extends SidebarWithFormRefProps {
  facility: ApiGetFacilityFileStateResponse;
  onSave: (facility: DefaultFacilityFormValues) => Promise<void>;
}

function EmbeddedEditFacilitySidebar({
  formRef,
  onClose,
  facility,
  onSave,
}: Readonly<EditFacilitySidebarProps>) {
  const initialInputs = mapApiFacilityStateToFacilityFormValues(facility);

  async function handleSubmit(inputs: DefaultFacilityFormValues) {
    await onSave(inputs);
    onClose(true);
  }

  return (
    <FacilityForm
      mode="edit"
      title="Einrichtung bearbeiten"
      submitLabel="Speichern"
      initialValues={initialInputs}
      sidebarFormRef={formRef}
      onSubmit={handleSubmit}
      onCancel={onClose}
    />
  );
}
