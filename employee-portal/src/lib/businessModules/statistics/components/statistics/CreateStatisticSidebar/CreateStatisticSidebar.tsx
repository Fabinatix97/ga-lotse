/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiAvailableDataSource,
  ApiStatisticsScheme,
} from "@eshg/employee-portal-api/statistics";
import { isNonNullish } from "remeda";

import { mapToApiBusinessModule } from "@/lib/businessModules/statistics/api/mapper/mapToApiBusinessModule";
import { CategorizedFlatAttribute } from "@/lib/businessModules/statistics/components/statistics/CreateStatisticSidebar/ChooseAttributesStep/ChooseAttributesStep";
import { DataSource } from "@/lib/businessModules/statistics/components/statistics/CreateStatisticSidebar/ChooseDataSourceStep/ChooseDataSourceStep";
import { Scheme } from "@/lib/businessModules/statistics/components/statistics/CreateStatisticSidebar/ChooseTemplateStep/ChooseTemplateStep";
import { CreateStatisticFromScratchSidebar } from "@/lib/businessModules/statistics/components/statistics/CreateStatisticSidebar/CreateStatisticFromScratchSidebar";
import { CreateStatisticFromTemplateSidebar } from "@/lib/businessModules/statistics/components/statistics/CreateStatisticSidebar/CreateStatisticFromTemplateSidebar";
import { getAttributeLabel } from "@/lib/businessModules/statistics/components/statistics/getAttributeLabel";
import { OverlayBoundary } from "@/lib/shared/components/boundaries/OverlayBoundary";

export type OpenSidebarKind = "FROM_SCRATCH" | "FROM_TEMPLATE" | "NONE";

export function CreateStatisticSidebar({
  apiDataSources,
  apiSchemes,
  openSidebar,
  setOpenSidebar,
}: {
  apiDataSources: ApiAvailableDataSource[];
  apiSchemes: ApiStatisticsScheme[];
  openSidebar: OpenSidebarKind;
  setOpenSidebar: (sidebar: OpenSidebarKind) => void;
}) {
  const attributes: CategorizedFlatAttribute[] = apiDataSources.flatMap(
    mapToCategorizedFlatAttributes,
  );
  const dataSources: DataSource[] = apiDataSources.map(mapToDataSource);
  const schemes: Scheme[] = apiSchemes.map(mapToScheme);

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
            schemes={schemes}
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

function mapToScheme(apiStatisticsScheme: ApiStatisticsScheme): Scheme {
  return {
    id: apiStatisticsScheme.id,
    name: apiStatisticsScheme.name,
    dataSource:
      apiStatisticsScheme.dataSources.length === 0
        ? undefined
        : {
            id: apiStatisticsScheme.dataSources[0]!.id,
            businessModule: mapToApiBusinessModule(
              apiStatisticsScheme.dataSources[0]!.businessModuleName,
            ),
            attributes:
              apiStatisticsScheme.dataSources[0]!.dataAttributes.flatMap(
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
