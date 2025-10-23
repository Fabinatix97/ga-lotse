/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  DefaultPersonForm,
  DefaultPersonFormValues,
  PersonSidebarForm,
  SidebarWithFormRefProps,
  mapToPersonUpdateRequest,
  useConfirmationDialog,
} from "@eshg/lib-employee-portal";

import { mapContactAndDifferentBillingAddressToSchoolEntry } from "@/lib/businessModules/schoolEntry/api/addressMapper";
import {
  CustodianDetails,
  mapCustodianDetailsToForm,
} from "@/lib/businessModules/schoolEntry/api/models/CustodianDetails";
import {
  useRemoveCustodian,
  useUpdateCustodian,
} from "@/lib/businessModules/schoolEntry/api/mutations/schoolEntryApi";

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
  custodian: CustodianDetails;
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
    await updateCustodian.mutateAsync(
      mapContactAndDifferentBillingAddressToSchoolEntry(request),
      {
        onSuccess: () => onClose(true),
      },
    );
  }

  return (
    <PersonSidebarForm
      mode="edit"
      title="Person bearbeiten"
      initialValues={mapCustodianDetailsToForm(custodian)}
      component={DefaultPersonForm}
      sidebarFormRef={formRef}
      onCancel={() => onClose(false)}
      onSubmit={handleSubmit}
      onDelete={() => deleteCustodian({ procedureVersion, onSuccess: onClose })}
    />
  );
}
