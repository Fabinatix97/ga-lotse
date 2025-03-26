/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  DefaultPersonFormValues,
  SidebarWithFormRefProps,
  mapApiAddressToForm,
  mapOptional,
  normalizeListInputs,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";
import { toDateString } from "@eshg/lib-portal/helpers/dateTime";
import { ApiAffectedPerson } from "@eshg/official-medical-service-api";

import { usePatchAffectedPerson } from "@/lib/businessModules/officialMedicalService/api/mutations/employeeOmsProcedureApi";
import { mapToPatchAffectedPersonRequest } from "@/lib/businessModules/officialMedicalService/shared/helpers";
import { DefaultPersonForm } from "@/lib/shared/components/personSidebar/form/DefaultPersonForm";
import { PersonSidebarForm } from "@/lib/shared/components/personSidebar/form/PersonSidebarForm";

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
      mode={"edit"}
      title={"Betroffene Person bearbeiten"}
      onCancel={onClose}
      onSubmit={handleSubmit}
      sidebarFormRef={formRef}
      initialValues={mapPersonDetailsToForm(affectedPerson)}
      component={DefaultPersonForm}
      addressRequired
    />
  );
}

function mapPersonDetailsToForm(
  person: ApiAffectedPerson,
): DefaultPersonFormValues {
  return {
    salutation: person.salutation ?? "",
    title: person.title ?? "",
    firstName: person.firstName,
    lastName: person.lastName,
    dateOfBirth: toDateString(person.dateOfBirth),
    gender: person.gender ?? "",
    countryOfBirth: person.countryOfBirth ?? "",
    nameAtBirth: person.nameAtBirth ?? "",
    placeOfBirth: person.placeOfBirth ?? "",
    emailAddresses: normalizeListInputs(person.emailAddresses),
    phoneNumbers: normalizeListInputs(person.phoneNumbers),
    contactAddress: mapOptional(person.contactAddress, mapApiAddressToForm),
    differentBillingAddress: undefined,
  };
}
