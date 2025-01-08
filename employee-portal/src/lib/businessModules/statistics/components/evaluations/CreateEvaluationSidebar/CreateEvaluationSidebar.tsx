/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiAvailableDataSource,
  ApiMinimalEvaluationTemplateInfo,
} from "@eshg/employee-portal-api/statistics";
import { isNonNullish } from "remeda";

import { mapToApiBusinessModule } from "@/lib/businessModules/statistics/api/mapper/mapToApiBusinessModule";
import { CategorizedFlatAttribute } from "@/lib/businessModules/statistics/components/evaluations/CreateEvaluationSidebar/ChooseAttributesStep/ChooseAttributesStep";
import { DataSource } from "@/lib/businessModules/statistics/components/evaluations/CreateEvaluationSidebar/ChooseDataSourceStep/ChooseDataSourceStep";
import { getAttributeLabel } from "@/lib/businessModules/statistics/components/evaluations/getAttributeLabel";
import {
  SidebarWithFormRefProps,
  UseSidebarWithFormRefResult,
  useSidebarWithFormRef,
} from "@/lib/shared/hooks/useSidebarWithFormRef";

import { CreateEvaluationFromScratchSidebar } from "./CreateEvaluationFromScratchSidebar";

export function useCreateEvaluationSidebar(): UseSidebarWithFormRefResult<CreateEvaluationSidebarProps> {
  return useSidebarWithFormRef({
    component: CreateEvaluationSidebar,
  });
}

interface CreateEvaluationSidebarProps extends SidebarWithFormRefProps {
  apiDataSources: ApiAvailableDataSource[];
  apiTemplates: ApiMinimalEvaluationTemplateInfo[];
}

function CreateEvaluationSidebar({
  apiDataSources,
  apiTemplates,
  onClose,
  formRef,
}: CreateEvaluationSidebarProps) {
  const attributesByDataSourceId: Record<string, CategorizedFlatAttribute[]> =
    Object.fromEntries(
      apiDataSources.map((ds) => [ds.id, mapToCategorizedFlatAttributes(ds)]),
    );
  const dataSources: DataSource[] = apiDataSources.map(mapToDataSource);

  return (
    <CreateEvaluationFromScratchSidebar
      onClose={onClose}
      dataSources={dataSources}
      attributesByDataSourceId={attributesByDataSourceId}
      evaluationTemplates={apiTemplates}
      formRef={formRef}
    />
  );
}

function mapToCategorizedFlatAttributes(
  apiDataSource: ApiAvailableDataSource,
): CategorizedFlatAttribute[] {
  return apiDataSource.attributes.flatMap((attribute) => {
    if (isNonNullish(attribute.baseAttributes)) {
      return attribute.baseAttributes.flatMap((it) => ({
        category: attribute.category,
        code: attribute.code,
        baseCode: it.code,
        businessModule: mapToApiBusinessModule(
          apiDataSource.businessModuleName,
        ),
        name: getAttributeLabel(attribute, it),
      }));
    }
    return {
      category: attribute.category,
      name: getAttributeLabel(attribute),
      businessModule: mapToApiBusinessModule(apiDataSource.businessModuleName),
      code: attribute.code,
    };
  });
}

function mapToDataSource(apiDataSource: ApiAvailableDataSource): DataSource {
  return {
    id: apiDataSource.id,
    businessModule: apiDataSource.businessModuleName,
    name: apiDataSource.name,
    withoutAnonymizationAllowed: apiDataSource.sensitiveDataAllowed,
  };
}
