/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { PostInformationStatementsRequest } from "@eshg/employee-portal-api/travelMedicine";
import { useSuspenseQueries } from "@tanstack/react-query";

import { useCreateInformationStatements } from "@/lib/businessModules/travelMedicine/api/mutations/vaccinationConsultation";
import { useGetAllDiseasesQuery } from "@/lib/businessModules/travelMedicine/api/queries/diseaseApi";
import { useGetAllInformationStatementTemplatesQuery } from "@/lib/businessModules/travelMedicine/api/queries/informationStatementTemplateApi";
import {
  InformationStatementForm,
  InformationStatementFormValues,
} from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/sidebars/sidebarForms/InformationStatementForm";
import {
  SidebarWithFormRefProps,
  UseSidebarWithFormRefResult,
  useSidebarWithFormRef,
} from "@/lib/shared/hooks/useSidebarWithFormRef";

export function useInformationStatementSidebar(): UseSidebarWithFormRefResult<InformationStatementSidebarProps> {
  return useSidebarWithFormRef({
    component: InformationStatementSidebar,
  });
}

interface InformationStatementSidebarProps extends SidebarWithFormRefProps {
  procedureId: string;
}

export const initialInformationStatementFormValues: InformationStatementFormValues =
  {
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
    await createInformationStatements
      .mutateAsync(createPostInformationStatementsRequest(values), {
        onSuccess: () => {
          props.onClose(true);
        },
      })
      .catch();
  }

  return (
    <InformationStatementForm
      initialValues={initialInformationStatementFormValues}
      allInformationStatementTemplates={allInformationStatementTemplates}
      allDiseases={allDiseases}
      formRef={props.formRef}
      onCancel={props.onClose}
      onSubmit={handleSubmit}
      title={"Bogen hinzufügen"}
      submitLabel={"Hinzufügen"}
    />
  );
}
