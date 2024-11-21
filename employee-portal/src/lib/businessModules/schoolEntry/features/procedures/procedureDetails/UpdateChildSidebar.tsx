/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  PersonDetails,
  mapPersonDetailsToForm,
} from "@/lib/businessModules/schoolEntry/api/models/Person";
import { useUpdateChild } from "@/lib/businessModules/schoolEntry/api/mutations/schoolEntryApi";
import { PersonEditSidebar } from "@/lib/shared/components/personSidebar/PersonEditSidebar";
import {
  DefaultPersonForm,
  DefaultPersonFormValues,
} from "@/lib/shared/components/personSidebar/form/DefaultPersonForm";
import { mapToPersonUpdateRequest } from "@/lib/shared/components/personSidebar/helpers";
import { useSidebarForm } from "@/lib/shared/hooks/useSidebarForm";

interface UpdateChildSidebarProps {
  child: PersonDetails;
  procedureId: string;
  open: boolean;
  onClose: () => void;
}

export function UpdateChildSidebar({
  child,
  procedureId,
  open,
  onClose,
}: UpdateChildSidebarProps) {
  const { closeSidebar, handleClose, sidebarFormRef } = useSidebarForm({
    onClose,
  });

  const updateChild = useUpdateChild(procedureId);

  async function handleSubmit(values: DefaultPersonFormValues) {
    const request = mapToPersonUpdateRequest(values, child.version);
    await updateChild.mutateAsync(
      {
        procedureId,
        apiUpdatePersonRequest: request,
      },
      {
        onSuccess: closeSidebar,
      },
    );
  }

  return (
    <PersonEditSidebar
      open={open}
      title={"Kind bearbeiten"}
      onCancel={handleClose}
      onSubmit={handleSubmit}
      sidebarFormRef={sidebarFormRef}
      initialValues={mapPersonDetailsToForm(child)}
      component={DefaultPersonForm}
      addressRequired
    />
  );
}
