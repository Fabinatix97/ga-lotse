/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiAvailableDataSource,
  ApiEvaluationTemplate,
} from "@eshg/employee-portal-api/statistics";
import { isNonNullish } from "remeda";

import { mapToApiBusinessModule } from "@/lib/businessModules/statistics/api/mapper/mapToApiBusinessModule";
import { CategorizedFlatAttribute } from "@/lib/businessModules/statistics/components/statistics/CreateStatisticSidebar/ChooseAttributesStep/ChooseAttributesStep";
import { DataSource } from "@/lib/businessModules/statistics/components/statistics/CreateStatisticSidebar/ChooseDataSourceStep/ChooseDataSourceStep";
import { Template } from "@/lib/businessModules/statistics/components/statistics/CreateStatisticSidebar/ChooseTemplateStep/ChooseTemplateStep";
import { CreateStatisticFromScratchSidebar } from "@/lib/businessModules/statistics/components/statistics/CreateStatisticSidebar/CreateStatisticFromScratchSidebar";
import { CreateStatisticFromTemplateSidebar } from "@/lib/businessModules/statistics/components/statistics/CreateStatisticSidebar/CreateStatisticFromTemplateSidebar";
import { getAttributeLabel } from "@/lib/businessModules/statistics/components/statistics/getAttributeLabel";
import { OverlayBoundary } from "@/lib/shared/components/boundaries/OverlayBoundary";

export type OpenSidebarKind = "FROM_SCRATCH" | "FROM_TEMPLATE" | "NONE";

export function CreateStatisticSidebar({
  apiDataSources,
  apiTemplates,
  openSidebar,
  setOpenSidebar,
}: {
  apiDataSources: ApiAvailableDataSource[];
  apiTemplates: ApiEvaluationTemplate[];
  openSidebar: OpenSidebarKind;
  setOpenSidebar: (sidebar: OpenSidebarKind) => void;
}) {
  const attributes: CategorizedFlatAttribute[] = apiDataSources.flatMap(
    mapToCategorizedFlatAttributes,
  );
  const dataSources: DataSource[] = apiDataSources.map(mapToDataSource);
  const templates: Template[] = apiTemplates.map(mapToTemplate);

  return (
    <>
      <OverlayBoundary>
        {openSidebar === "FROM_SCRATCH" && (
          <CreateStatisticFromScratchSidebar
            open={openSidebar === "FROM_SCRATCH"}
            onClose={() => setOpenSidebar("NONE")}
            dataSources={dataSources}
            attributes={attributes}
            viewTemplates={() => setOpenSidebar("FROM_TEMPLATE")}
          />
        )}
        {openSidebar === "FROM_TEMPLATE" && (
          <CreateStatisticFromTemplateSidebar
            open={openSidebar === "FROM_TEMPLATE"}
            onClose={() => setOpenSidebar("NONE")}
            templates={templates}
            viewCreateStatistics={() => setOpenSidebar("FROM_SCRATCH")}
          />
        )}
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
        businessModule: mapToApiBusinessModule(apiDataSource.businessModule),
        name: getAttributeLabel(attribute, it),
      }));
    }
    return {
      category: attribute.category,
      name: getAttributeLabel(attribute),
      businessModule: mapToApiBusinessModule(apiDataSource.businessModule),
      code: attribute.code,
    };
  });
}

function mapToDataSource(apiDataSource: ApiAvailableDataSource): DataSource {
  return {
    id: apiDataSource.id,
    businessModule: apiDataSource.businessModule,
    name: apiDataSource.name,
  };
}

function mapToTemplate(apiEvaluationTemplate: ApiEvaluationTemplate): Template {
  return {
    id: apiEvaluationTemplate.id,
    name: apiEvaluationTemplate.name,
    dataSource:
      apiEvaluationTemplate.dataSources.length === 0
        ? undefined
        : {
            id: apiEvaluationTemplate.dataSources[0]!.id,
            businessModule: mapToApiBusinessModule(
              apiEvaluationTemplate.dataSources[0]!.businessModuleName,
            ),
            attributes:
              apiEvaluationTemplate.dataSources[0]!.dataAttributes.flatMap(
                (attribute) => {
                  if (attribute.baseDataAttributes.length === 0) {
                    return [
                      {
                        code: attribute.code,
                        name: getAttributeLabel(attribute),
                      },
                    ];
                  }
                  return attribute.baseDataAttributes.flatMap(
                    (baseAttribute) => ({
                      code: attribute.code,
                      baseCode: baseAttribute.code,
                      name: getAttributeLabel(attribute, baseAttribute),
                    }),
                  );
                },
              ),
          },
  };
}
