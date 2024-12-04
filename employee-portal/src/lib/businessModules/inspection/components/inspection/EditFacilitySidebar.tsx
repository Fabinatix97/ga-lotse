/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiFacilityFileState } from "@eshg/employee-portal-api/inspection";

import {
  DefaultFacilityFormValues,
  FacilityForm,
} from "@/lib/shared/components/facilitySidebar/create/FacilityForm";
import { mapApiFacilityStateToFacilityFormValues } from "@/lib/shared/helpers/facilityUtils";
import {
  SidebarWithFormRefProps,
  useSidebarWithFormRef,
} from "@/lib/shared/hooks/useSidebarWithFormRef";

export function useEditFacilitySidebar() {
  return useSidebarWithFormRef({
    component: EmbeddedEditFacilitySidebar,
  });
}

interface EditFacilitySidebarProps extends SidebarWithFormRefProps {
  facility: ApiFacilityFileState;
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
      onSubmit={handleSubmit}
      onCancel={onClose}
      sidebarFormRef={formRef}
    />
  );
}
