/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

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
import { ApiCustodian } from "@eshg/measles-protection-api";

import { useEditCustodian } from "@/lib/businessModules/measlesProtection/api/mutations/procedures";

export function useEditCustodianSidebar(): UseSidebarWithFormRefResult<EditCustodianSidebarProps> {
  return useSidebarWithFormRef({ component: EditCustodianSidebar });
}

interface EditCustodianSidebarProps extends SidebarWithFormRefProps {
  procedureId: string;
  custodianId: string;
  custodian: ApiCustodian;
}

function EditCustodianSidebar({
  procedureId,
  custodianId,
  custodian,
  formRef,
  onClose,
}: Readonly<EditCustodianSidebarProps>) {
  const editCustodian = useEditCustodian();

  async function handleSubmit(values: DefaultPersonFormValues) {
    const request = mapToPersonAddRequest(values);
    await editCustodian.mutateAsync(
      {
        procedureId: procedureId,
        custodianId: custodianId,
        custodian: { ...request, address: request.contactAddress },
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
      title="PSB bearbeiten"
      sidebarFormRef={formRef}
      initialValues={mapCustodianDetailsToForm(custodian)}
      component={DefaultPersonForm}
      addressRequired
      onCancel={onClose}
      onSubmit={handleSubmit}
    />
  );
}

function mapCustodianDetailsToForm(
  person: ApiCustodian,
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
