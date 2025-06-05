/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  DefaultPersonForm,
  DefaultPersonFormValues,
  PersonSidebarForm,
  SidebarWithFormRefProps,
  UseSidebarWithFormRefResult,
  mapApiAddressToForm,
  mapOptional,
  mapToPersonAddRequest,
  normalizeListInputs,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";
import { toDateString } from "@eshg/lib-portal";
import { ApiAffectedPerson } from "@eshg/measles-protection-api";

import { useEditAffectedPerson } from "@/lib/businessModules/measlesProtection/api/mutations/procedures";

export function useEditAffectedPersonSidebar(): UseSidebarWithFormRefResult<EditAffectedPersonSidebarProps> {
  return useSidebarWithFormRef({ component: EditAffectedPersonSidebar });
}

interface EditAffectedPersonSidebarProps extends SidebarWithFormRefProps {
  procedureId: string;
  person: ApiAffectedPerson;
}
function EditAffectedPersonSidebar({
  procedureId,
  person,
  formRef,
  onClose,
}: Readonly<EditAffectedPersonSidebarProps>) {
  const editAffectedPerson = useEditAffectedPerson();

  async function handleSubmit(values: DefaultPersonFormValues) {
    const request = mapToPersonAddRequest(values);
    await editAffectedPerson.mutateAsync(
      {
        procedureId: procedureId,
        person: { ...request, address: request.contactAddress! },
      },
      {
        onSuccess: () => {
          onClose(true);
        },
      },
    );
  }

  return (
    <PersonSidebarForm
      mode="edit"
      title="Betroffene Person bearbeiten"
      sidebarFormRef={formRef}
      initialValues={mapPersonDetailsToForm(person)}
      component={DefaultPersonForm}
      addressRequired
      onCancel={onClose}
      onSubmit={handleSubmit}
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
    contactAddress: mapOptional(person.address, mapApiAddressToForm),
    differentBillingAddress: undefined,
  };
}
