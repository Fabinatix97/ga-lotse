/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useSuspenseQueries } from "@tanstack/react-query";

import {
  SidebarWithFormRefProps,
  UseSidebarWithFormRefResult,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";
import { PostInformationStatementsRequest } from "@eshg/travel-medicine-api";

import { useCreateInformationStatements } from "@/lib/businessModules/travelMedicine/api/mutations/vaccinationConsultation";
import { useGetAllDiseasesQuery } from "@/lib/businessModules/travelMedicine/api/queries/diseaseApi";
import { useGetAllInformationStatementTemplatesQuery } from "@/lib/businessModules/travelMedicine/api/queries/informationStatementTemplateApi";
import {
  InformationStatementForm,
  InformationStatementFormValues,
} from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/sidebars/sidebarForms/InformationStatementForm";

export function useInformationStatementSidebar(): UseSidebarWithFormRefResult<InformationStatementSidebarProps> {
  return useSidebarWithFormRef({
    component: InformationStatementSidebar,
  });
}

interface InformationStatementSidebarProps extends SidebarWithFormRefProps {
  procedureId: string;
}

const initialInformationStatementFormValues: InformationStatementFormValues = {
  procedureId: "",
  diseases: [],
  informationStatementTemplates: [],
};

function InformationStatementSidebar(
  props: Readonly<InformationStatementSidebarProps>,
) {
  const createInformationStatements = useCreateInformationStatements();

  const [{ data: allInformationStatementTemplates }, { data: allDiseases }] =
    useSuspenseQueries({
      queries: [
        useGetAllInformationStatementTemplatesQuery(),
        useGetAllDiseasesQuery(),
      ],
    });

  function createPostInformationStatementsRequest(
    values: InformationStatementFormValues,
  ): PostInformationStatementsRequest {
    return {
      procedureId: props.procedureId,
      apiPostInformationStatementsRequest: {
        templateIds: values.informationStatementTemplates ?? [],
      },
    };
  }

  async function handleSubmit(values: InformationStatementFormValues) {
    await createInformationStatements.mutateAsync(
      createPostInformationStatementsRequest(values),
      {
        onSuccess: () => {
          props.onClose(true);
        },
      },
    );
  }

  return (
    <InformationStatementForm
      initialValues={initialInformationStatementFormValues}
      allInformationStatementTemplates={allInformationStatementTemplates}
      allDiseases={allDiseases}
      formRef={props.formRef}
      title="Bogen hinzufügen"
      submitLabel="Hinzufügen"
      onCancel={props.onClose}
      onSubmit={handleSubmit}
    />
  );
}
