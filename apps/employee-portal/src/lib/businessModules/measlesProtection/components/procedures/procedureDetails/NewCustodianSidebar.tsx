/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { isEmptyish } from "remeda";

import { ApiGetReferencePersonResponse } from "@eshg/base-api";
import {
  DefaultPersonFormValues,
  PersonSidebar,
  PersonSidebarProps,
  SearchCustodianForm,
  SidebarWithFormRefProps,
  UseSidebarWithFormRefResult,
  defaultPersonFormValues,
  defaultSearchPersonValues,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";

import {
  useAddCustodian,
  useAddCustodianWithoutDateOfBirth,
} from "@/lib/businessModules/measlesProtection/api/mutations/procedures";
import { CustodianForm } from "@/lib/businessModules/measlesProtection/components/procedures/procedureDetails/CustodianForm";
import {
  mapToAddCustodianRequest,
  mapToAddCustodianWithoutDateOfBirthRequest,
  mapToAffectedPerson,
} from "@/lib/businessModules/measlesProtection/shared/helpers";

export function useNewCustodianSidebar(): UseSidebarWithFormRefResult<NewCustodianSidebarProps> {
  return useSidebarWithFormRef({ component: NewCustodianSidebar });
}

interface NewCustodianSidebarProps extends SidebarWithFormRefProps {
  procedureId: string;
}

function NewCustodianSidebar(props: Readonly<NewCustodianSidebarProps>) {
  const addCustodian = useAddCustodian();
  const addCustodianWithoutDateOfBirth = useAddCustodianWithoutDateOfBirth();

  async function createProcedureWithNewPerson(person: DefaultPersonFormValues) {
    const request = mapToAddCustodianRequest(person);
    await addCustodian.mutateAsync({
      procedureId: props.procedureId,
      data: request,
    });
  }

  async function createProcedureWithExistingPerson(
    person: ApiGetReferencePersonResponse,
  ) {
    const request = { custodian: mapToAffectedPerson(person) };
    await addCustodian.mutateAsync({
      procedureId: props.procedureId,
      data: request,
    });
  }

  async function createProcedureWithCustodianWithoutDateOfBirth(
    createInputs: DefaultPersonFormValues,
  ) {
    const request = mapToAddCustodianWithoutDateOfBirthRequest(createInputs);
    await addCustodianWithoutDateOfBirth.mutateAsync({
      procedureId: props.procedureId,
      data: request,
    });
  }

  async function handleCreate(createInputs: DefaultPersonFormValues) {
    if (isEmptyish(createInputs.dateOfBirth)) {
      await createProcedureWithCustodianWithoutDateOfBirth(createInputs);
    } else {
      await createProcedureWithNewPerson(createInputs);
    }
  }

  const personSidebarProps: PersonSidebarProps = {
    onSelect: async (values) => {
      await createProcedureWithExistingPerson(values.person);
    },
    onCreate: async (values) => {
      await handleCreate(values.createInputs);
    },
    title: "PSB hinzufügen",
    submitLabel: "Anlegen",
    addressRequired: true,
    ...props,
  };

  return (
    <PersonSidebar
      searchFormComponent={SearchCustodianForm}
      createFormComponent={CustodianForm}
      initialSearchState={defaultSearchPersonValues()}
      initialCreateState={defaultPersonFormValues}
      {...personSidebarProps}
    />
  );
}
