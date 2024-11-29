/**
 * Copyright 2024 cronn GmbH
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
import { OverlayBoundary } from "@/lib/shared/components/boundaries/OverlayBoundary";

import { CreateEvaluationFromScratchSidebar } from "./CreateEvaluationFromScratchSidebar";

export function CreateEvaluationSidebar({
  apiDataSources,
  apiTemplates,
  openSidebar,
  setOpenSidebar,
}: {
  apiDataSources: ApiAvailableDataSource[];
  apiTemplates: ApiMinimalEvaluationTemplateInfo[];
  openSidebar: boolean;
  setOpenSidebar: (open: boolean) => void;
}) {
  const attributesByDataSourceId: Record<string, CategorizedFlatAttribute[]> =
    Object.fromEntries(
      apiDataSources.map((ds) => [ds.id, mapToCategorizedFlatAttributes(ds)]),
    );
  const dataSources: DataSource[] = apiDataSources.map(mapToDataSource);

  return (
    <>
      <OverlayBoundary>
        <CreateEvaluationFromScratchSidebar
          open={openSidebar}
          onClose={() => setOpenSidebar(false)}
          dataSources={dataSources}
          attributesByDataSourceId={attributesByDataSourceId}
          evaluationTemplates={apiTemplates}
        />
      </OverlayBoundary>
    </>
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
    withoutAnonymizationAllowed: apiDataSource.withoutAnonymizationAllowed,
  };
}
