/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  PersonDetails,
  mapPersonDetailsToForm,
} from "@/lib/businessModules/schoolEntry/api/models/Person";
import { useUpdateCustodian } from "@/lib/businessModules/schoolEntry/api/mutations/schoolEntryApi";
import { PersonEditSidebar } from "@/lib/shared/components/personSidebar/PersonEditSidebar";
import {
  DefaultPersonForm,
  DefaultPersonFormValues,
} from "@/lib/shared/components/personSidebar/form/DefaultPersonForm";
import { mapToPersonUpdateRequest } from "@/lib/shared/components/personSidebar/helpers";
import { useSidebarForm } from "@/lib/shared/hooks/useSidebarForm";

interface UpdateCustodianSidebarProps {
  custodian: PersonDetails;
  procedureId: string;
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
}

export function UpdateCustodianSidebar({
  custodian,
  procedureId,
  open,
  onClose,
  onDelete,
}: UpdateCustodianSidebarProps) {
  const { closeSidebar, handleClose, sidebarFormRef } = useSidebarForm({
    onClose,
  });

  const updateCustodian = useUpdateCustodian(
    procedureId,
    custodian.fileStateId,
  );

  async function handleSubmit(values: DefaultPersonFormValues) {
    const request = mapToPersonUpdateRequest(values, custodian.version);
    await updateCustodian.mutateAsync(request, {
      onSuccess: closeSidebar,
    });
  }

  return (
    <PersonEditSidebar
      open={open}
      title={"Person bearbeiten"}
      onCancel={handleClose}
      onSubmit={handleSubmit}
      onDelete={onDelete}
      sidebarFormRef={sidebarFormRef}
      initialValues={mapPersonDetailsToForm(custodian)}
      component={DefaultPersonForm}
    />
  );
}
