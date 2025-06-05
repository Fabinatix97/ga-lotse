/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiGetReferencePersonResponse } from "@eshg/base-api";
import {
  DefaultPersonFormValues,
  PersonSidebar,
  PersonSidebarProps,
  SidebarWithFormRefProps,
  UseSidebarWithFormRefResult,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";

import { useAddCustodian } from "@/lib/businessModules/measlesProtection/api/mutations/procedures";
import {
  mapToAddCustodianRequest,
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

  const personSidebarProps: PersonSidebarProps = {
    onSelect: async (values) => {
      await createProcedureWithExistingPerson(values.person);
    },
    onCreate: async (values) => {
      await createProcedureWithNewPerson(values.createInputs);
    },
    title: "PSB hinzufügen",
    submitLabel: "Anlegen",
    addressRequired: true,
    ...props,
  };

  return <PersonSidebar {...personSidebarProps} />;
}
