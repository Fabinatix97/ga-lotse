/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ChildDetails, useUpdateAnnualChildPerson } from "@eshg/dental";
import {
  DefaultPersonFormValues,
  SidebarWithFormRefProps,
  mapApiAddressToForm,
  mapOptional,
  mapToPersonUpdateRequest,
  normalizeListInputs,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";
import { toDateString } from "@eshg/lib-portal/helpers/dateTime";
import { parseOptionalValue } from "@eshg/lib-portal/helpers/form";

import { DefaultPersonForm } from "@/lib/shared/components/personSidebar/form/DefaultPersonForm";
import { PersonSidebarForm } from "@/lib/shared/components/personSidebar/form/PersonSidebarForm";

export function useUpdateAnnualChildPersonSidebar() {
  return useSidebarWithFormRef({
    component: UpdateAnnualChildPersonSidebar,
  });
}

interface UpdateAnnualChildPersonSidebarProps extends SidebarWithFormRefProps {
  child: ChildDetails;
  childId: string;
}

function UpdateAnnualChildPersonSidebar({
  child,
  childId,
  onClose,
  formRef,
}: UpdateAnnualChildPersonSidebarProps) {
  const updateChild = useUpdateAnnualChildPerson(childId);

  async function handleSubmit(values: DefaultPersonFormValues) {
    const request = mapToPersonUpdateRequest(values, child.version);
    await updateChild.mutateAsync(
      {
        childId: childId,
        apiUpdatePersonRequest: request,
      },
      {
        onSuccess: () => onClose(true),
      },
    );
  }

  return (
    <PersonSidebarForm
      mode="edit"
      title="Kind bearbeiten"
      onCancel={() => onClose(false)}
      onSubmit={handleSubmit}
      initialValues={mapChildDetailsToPersonFormValues(child)}
      component={DefaultPersonForm}
      sidebarFormRef={formRef}
      addressRequired
    />
  );
}

function mapChildDetailsToPersonFormValues(
  child: ChildDetails,
): DefaultPersonFormValues {
  return {
    salutation: child.personDetails.salutation,
    title: parseOptionalValue(child.personDetails.title),
    firstName: child.firstName,
    lastName: child.lastName,
    dateOfBirth: toDateString(child.dateOfBirth),
    gender: child.gender,
    countryOfBirth: parseOptionalValue(child.personDetails.countryOfBirth),
    nameAtBirth: parseOptionalValue(child.personDetails.nameAtBirth),
    placeOfBirth: parseOptionalValue(child.personDetails.placeOfBirth),
    emailAddresses: normalizeListInputs(child.personDetails.emailAddresses),
    phoneNumbers: normalizeListInputs(child.personDetails.phoneNumbers),
    contactAddress: mapOptional(
      child.personDetails.contactAddress,
      mapApiAddressToForm,
    ),
    differentBillingAddress: mapOptional(
      child.personDetails.differentBillingAddress,
      mapApiAddressToForm,
    ),
  };
}
