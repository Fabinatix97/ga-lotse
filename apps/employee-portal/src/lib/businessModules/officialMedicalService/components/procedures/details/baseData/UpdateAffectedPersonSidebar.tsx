/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  DefaultPersonForm,
  DefaultPersonFormValues,
  PersonSidebarForm,
  SidebarWithFormRefProps,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";
import { ApiAffectedPerson } from "@eshg/official-medical-service-api";

import { usePatchAffectedPerson } from "@/lib/businessModules/officialMedicalService/api/mutations/employeeOmsProcedureApi";
import {
  mapPersonDetailsToForm,
  mapToPatchAffectedPersonRequest,
} from "@/lib/businessModules/officialMedicalService/shared/helpers";

export function useUpdateAffectedPersonSidebar() {
  return useSidebarWithFormRef({
    component: UpdateAffectedPersonSidebar,
  });
}

interface UpdateAffectedPersonSidebarProps extends SidebarWithFormRefProps {
  affectedPerson: ApiAffectedPerson;
  procedureId: string;
}

function UpdateAffectedPersonSidebar({
  affectedPerson,
  procedureId,
  formRef,
  onClose,
}: UpdateAffectedPersonSidebarProps) {
  const updateAffectedPerson = usePatchAffectedPerson();

  const version = affectedPerson.version;

  async function handleSubmit(values: DefaultPersonFormValues) {
    await updateAffectedPerson.mutateAsync(
      {
        procedureId,
        apiPatchAffectedPersonRequest: mapToPatchAffectedPersonRequest(
          values,
          version,
        ),
      },
      {
        onSuccess: () => onClose(true),
      },
    );
  }

  return (
    <PersonSidebarForm
      mode="edit"
      title="Betroffene Person bearbeiten"
      sidebarFormRef={formRef}
      initialValues={mapPersonDetailsToForm(affectedPerson)}
      component={DefaultPersonForm}
      addressRequired
      onCancel={onClose}
      onSubmit={handleSubmit}
    />
  );
}
