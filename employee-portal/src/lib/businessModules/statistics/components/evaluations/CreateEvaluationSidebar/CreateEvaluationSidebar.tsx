/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { isNonNullish } from "remeda";

import {
  SidebarWithFormRefProps,
  UseSidebarWithFormRefResult,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";
import {
  ApiAvailableDataSource,
  ApiMinimalEvaluationTemplateInfo,
} from "@eshg/statistics-api";

import { mapToApiBusinessModule } from "@/lib/businessModules/statistics/api/mapper/mapToApiBusinessModule";
import { mapToAnonymizationOptions } from "@/lib/businessModules/statistics/api/models/anonymizationOptions";
import { mapDataSourceSensitivityApiToFrontend } from "@/lib/businessModules/statistics/api/models/dataSourceSensitivity";
import { CategorizedFlatAttribute } from "@/lib/businessModules/statistics/components/evaluations/CreateEvaluationSidebar/ChooseAttributesStep/ChooseAttributesStep";
import { DataSource } from "@/lib/businessModules/statistics/components/evaluations/CreateEvaluationSidebar/ChooseDataSourceStep/ChooseDataSourceStep";
import { getAttributeLabel } from "@/lib/businessModules/statistics/components/evaluations/getAttributeLabel";

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
  const dataSources: DataSource[] = apiDataSources.map(mapToDataSource);

  return (
    <CreateEvaluationFromScratchSidebar
      dataSources={dataSources}
      evaluationTemplates={apiTemplates}
      formRef={formRef}
      onClose={onClose}
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
        key: `${attribute.code}_${it.code}`,
        dataPrivacyCategory: it.dataPrivacyCategory,
      }));
    }
    return {
      category: attribute.category,
      name: getAttributeLabel(attribute),
      businessModule: mapToApiBusinessModule(apiDataSource.businessModuleName),
      code: attribute.code,
      key: attribute.code,
      dataPrivacyCategory: attribute.dataPrivacyCategory,
    };
  });
}

function mapToDataSource(apiDataSource: ApiAvailableDataSource): DataSource {
  return {
    id: apiDataSource.id,
    businessModule: apiDataSource.businessModuleName,
    name: apiDataSource.name,
    sensitivity: mapDataSourceSensitivityApiToFrontend(
      apiDataSource.sensitivity,
    ),
    anonymizationOptions: mapToAnonymizationOptions({
      canBeAnonymized: apiDataSource.canBeAnonymized,
      dataSourceSensitivity: apiDataSource.sensitivity,
      sensitiveDataAllowed: apiDataSource.sensitiveDataAllowed,
    }),
    attributes: mapToCategorizedFlatAttributes(apiDataSource),
  };
}
