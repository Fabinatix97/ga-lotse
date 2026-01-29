/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { isEmptyish } from "remeda";

import {
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
import {
  ApiCustodian,
  ApiCustodianWithoutDateOfBirth,
} from "@eshg/measles-protection-api";

import {
  useEditCustodian,
  useEditCustodianWithoutDateOfBirth,
} from "@/lib/businessModules/measlesProtection/api/mutations/procedures";
import { CustodianForm } from "@/lib/businessModules/measlesProtection/components/procedures/procedureDetails/CustodianForm";
import { mapToAddCustodianWithoutDateOfBirthRequest } from "@/lib/businessModules/measlesProtection/shared/helpers";

export function useEditCustodianSidebar(): UseSidebarWithFormRefResult<EditCustodianSidebarProps> {
  return useSidebarWithFormRef({ component: EditCustodianSidebar });
}

interface EditCustodianSidebarProps extends SidebarWithFormRefProps {
  procedureId: string;
  custodianId: string;
  custodian: ApiCustodian | ApiCustodianWithoutDateOfBirth;
}

function EditCustodianSidebar({
  procedureId,
  custodianId,
  custodian,
  formRef,
  onClose,
}: Readonly<EditCustodianSidebarProps>) {
  const editCustodian = useEditCustodian();
  const editCustodianWithoutDateOfBirth = useEditCustodianWithoutDateOfBirth();

  async function handleSubmit(values: DefaultPersonFormValues) {
    if (isEmptyish(values.dateOfBirth)) {
      const request = mapToAddCustodianWithoutDateOfBirthRequest(values);
      await editCustodianWithoutDateOfBirth.mutateAsync(
        {
          procedureId: procedureId,
          custodianId: custodianId,
          custodian: { ...request.custodian },
        },
        {
          onSuccess: () => {
            onClose(true);
          },
        },
      );
    } else {
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
  }

  return (
    <PersonSidebarForm
      mode="edit"
      title="PSB bearbeiten"
      initialValues={mapCustodianDetailsToForm(custodian)}
      component={CustodianForm}
      sidebarFormRef={formRef}
      onCancel={() => onClose(false)}
      onSubmit={handleSubmit}
    />
  );
}

function mapCustodianDetailsToForm(
  person: ApiCustodian | ApiCustodianWithoutDateOfBirth,
): DefaultPersonFormValues {
  const hasDoB = "dateOfBirth" in person;
  return {
    salutation: person.salutation ?? "",
    title: person.title ?? "",
    firstName: person.firstName,
    lastName: person.lastName,
    dateOfBirth: hasDoB ? toDateString(person.dateOfBirth) : "",
    gender: person.gender ?? "",
    countryOfBirth: hasDoB ? (person.countryOfBirth ?? "") : "",
    nameAtBirth: hasDoB ? (person.nameAtBirth ?? "") : "",
    placeOfBirth: hasDoB ? (person.placeOfBirth ?? "") : "",
    emailAddresses: normalizeListInputs(person.emailAddresses),
    phoneNumbers: normalizeListInputs(person.phoneNumbers),
    contactAddress: mapOptional(person.address, mapApiAddressToForm),
    differentBillingAddress: undefined,
  };
}
