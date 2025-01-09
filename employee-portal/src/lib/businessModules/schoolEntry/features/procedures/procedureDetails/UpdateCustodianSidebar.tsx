/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  PersonDetails,
  mapPersonDetailsToForm,
} from "@/lib/businessModules/schoolEntry/api/models/Person";
import {
  useRemoveCustodian,
  useUpdateCustodian,
} from "@/lib/businessModules/schoolEntry/api/mutations/schoolEntryApi";
import {
  DefaultPersonForm,
  DefaultPersonFormValues,
} from "@/lib/shared/components/personSidebar/form/DefaultPersonForm";
import { PersonSidebarForm } from "@/lib/shared/components/personSidebar/form/PersonSidebarForm";
import { mapToPersonUpdateRequest } from "@/lib/shared/components/personSidebar/helpers";
import { useConfirmationDialog } from "@/lib/shared/hooks/useConfirmationDialog";
import { SidebarWithFormRefProps } from "@/lib/shared/hooks/useSidebarWithFormRef";

export function useDeleteCustodianWithConfirmation(
  procedureId: string,
  fileStateId: string,
) {
  const removeCustodian = useRemoveCustodian(procedureId, fileStateId);

  async function handleConfirm(
    procedureVersion: number,
    onSuccess?: () => void,
  ) {
    await removeCustodian.mutateAsync(
      {
        procedureVersion,
      },
      { onSuccess },
    );
  }

  const { openConfirmationDialog } = useConfirmationDialog();

  function handleDelete(opts: {
    procedureVersion: number;
    onSuccess?: () => void;
  }) {
    openConfirmationDialog({
      title: "Personensorgeberechtigte:n entfernen?",
      description: "Diese Aktion kann nicht rückgängig gemacht werden",
      confirmLabel: "Entfernen",
      color: "danger",
      onConfirm: () => handleConfirm(opts.procedureVersion, opts.onSuccess),
    });
  }

  return { deleteCustodian: handleDelete };
}

interface UpdateCustodianSidebarProps extends SidebarWithFormRefProps {
  custodian: PersonDetails;
  procedureId: string;
  procedureVersion: number;
}

export function UpdateCustodianSidebar({
  custodian,
  procedureId,
  procedureVersion,
  onClose,
  formRef,
}: UpdateCustodianSidebarProps) {
  const updateCustodian = useUpdateCustodian(
    procedureId,
    custodian.fileStateId,
  );

  const { deleteCustodian } = useDeleteCustodianWithConfirmation(
    procedureId,
    custodian.fileStateId,
  );

  async function handleSubmit(values: DefaultPersonFormValues) {
    const request = mapToPersonUpdateRequest(values, custodian.version);
    await updateCustodian.mutateAsync(request, {
      onSuccess: () => onClose(true),
    });
  }

  return (
    <PersonSidebarForm
      mode="edit"
      title="Person bearbeiten"
      onCancel={() => onClose(false)}
      onSubmit={handleSubmit}
      initialValues={mapPersonDetailsToForm(custodian)}
      component={DefaultPersonForm}
      sidebarFormRef={formRef}
      onDelete={() => deleteCustodian({ procedureVersion, onSuccess: onClose })}
    />
  );
}
