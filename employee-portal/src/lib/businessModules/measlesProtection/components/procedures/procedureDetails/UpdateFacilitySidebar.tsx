/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  SidebarWithFormRefProps,
  UseSidebarWithFormRefResult,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";
import { ApiFacility } from "@eshg/measles-protection-api";

import { useEditFacility } from "@/lib/businessModules/measlesProtection/api/mutations/procedures";
import { mapApiFacilityToDefaultFacilityFormValues } from "@/lib/businessModules/measlesProtection/components/procedures/procedureDetails/helpers";
import {
  DefaultFacilityFormValues,
  FacilityForm,
} from "@/lib/shared/components/facilitySidebar/create/FacilityForm";

export function useUpdateFacilitySidebar(): UseSidebarWithFormRefResult<UpdateFacilitySidebarProps> {
  return useSidebarWithFormRef({ component: UpdateFacilitySidebar });
}

interface UpdateFacilitySidebarProps extends SidebarWithFormRefProps {
  procedureId: string;
  facility: ApiFacility;
}

function UpdateFacilitySidebar({
  procedureId,
  facility,
  formRef,
  onClose,
}: Readonly<UpdateFacilitySidebarProps>) {
  const editFacility = useEditFacility();

  async function handleSubmit(values: DefaultFacilityFormValues) {
    await editFacility.mutateAsync(
      {
        procedureId: procedureId,
        facility: values,
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
      title="Einrichtung bearbeiten"
      onSubmit={handleSubmit}
      onCancel={onClose}
      sidebarFormRef={formRef}
      initialValues={mapApiFacilityToDefaultFacilityFormValues(facility)}
      mode="edit"
      submitLabel="Speichern"
    />
  );
}
