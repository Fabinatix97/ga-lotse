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
  mapToPersonUpdateRequest,
  normalizeListInputs,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";
import { parseOptionalValue, toDateString } from "@eshg/lib-portal";

import { ChildDetails } from "../../api/models/ChildDetails";
import { useUpdateAnnualChildPerson } from "../../api/mutations/details";

export function useUpdateAnnualChildPersonSidebar(): UseSidebarWithFormRefResult<UpdateAnnualChildPersonSidebarProps> {
  return useSidebarWithFormRef({
    component: UpdateAnnualChildPersonSidebar,
  });
}

interface UpdateAnnualChildPersonSidebarProps extends SidebarWithFormRefProps {
  child: ChildDetails;
  childId: string;
}

function UpdateAnnualChildPersonSidebar(
  props: UpdateAnnualChildPersonSidebarProps,
) {
  const { child, childId, onClose, formRef } = props;
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
      initialValues={mapChildDetailsToPersonFormValues(child)}
      component={DefaultPersonForm}
      sidebarFormRef={formRef}
      addressRequired
      onCancel={() => onClose(false)}
      onSubmit={handleSubmit}
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
