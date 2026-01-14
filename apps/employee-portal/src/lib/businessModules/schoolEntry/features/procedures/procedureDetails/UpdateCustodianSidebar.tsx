/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { isEmptyish, isNullish } from "remeda";

import {
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
  useRemoveCustodianWithoutDateOfBirth,
  useUpdateCustodian,
  useUpdateCustodianWithoutDateOfBirth,
} from "@/lib/businessModules/schoolEntry/api/mutations/schoolEntryApi";
import { CustodianForm } from "@/lib/businessModules/schoolEntry/features/procedures/procedureDetails/CustodianForm";

export function useDeleteCustodianWithConfirmation(
  procedureId: string,
  custodianId: string,
  withoutDateOfBirth: boolean,
) {
  const removeCustodianWithDateOfBirth = useRemoveCustodian(
    procedureId,
    custodianId,
  );
  const removeCustodianWithoutDateOfBirth =
    useRemoveCustodianWithoutDateOfBirth(procedureId, custodianId);

  const removeCustodian = withoutDateOfBirth
    ? removeCustodianWithoutDateOfBirth
    : removeCustodianWithDateOfBirth;

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
  const updateCustodianWithoutDateOfBirth =
    useUpdateCustodianWithoutDateOfBirth(procedureId, custodian.fileStateId);

  const { deleteCustodian } = useDeleteCustodianWithConfirmation(
    procedureId,
    custodian.fileStateId,
    isNullish(custodian.dateOfBirth),
  );

  async function handleSubmit(values: DefaultPersonFormValues) {
    if (isEmptyish(values.dateOfBirth)) {
      await updateCustodianWithoutDateOfBirth.mutateAsync(
        mapContactAndDifferentBillingAddressToSchoolEntry(
          mapToPersonUpdateRequest(values, procedureVersion),
        ),
        {
          onSuccess: () => onClose(true),
        },
      );
    } else {
      await updateCustodian.mutateAsync(
        mapContactAndDifferentBillingAddressToSchoolEntry(
          mapToPersonUpdateRequest(values, custodian.version),
        ),
        {
          onSuccess: () => onClose(true),
        },
      );
    }
  }

  return (
    <PersonSidebarForm
      mode="edit"
      title="Person bearbeiten"
      initialValues={mapCustodianDetailsToForm(custodian)}
      component={CustodianForm}
      sidebarFormRef={formRef}
      onCancel={() => onClose(false)}
      onSubmit={handleSubmit}
      onDelete={() => deleteCustodian({ procedureVersion, onSuccess: onClose })}
    />
  );
}
