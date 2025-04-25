/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack, Typography } from "@mui/joy";

import { SelectableCard } from "@eshg/lib-employee-portal";
import { RadioGroupField } from "@eshg/lib-portal/components/formFields/RadioGroupField";

import { mapToApiBusinessModule } from "@/lib/businessModules/statistics/api/mapper/mapToApiBusinessModule";
import { AnonymizationOptions } from "@/lib/businessModules/statistics/api/models/anonymizationOptions";
import { DataSourceSensitivity } from "@/lib/businessModules/statistics/api/models/dataSourceSensitivity";
import { CategorizedFlatAttribute } from "@/lib/businessModules/statistics/components/evaluations/CreateEvaluationSidebar/ChooseAttributesStep/ChooseAttributesStep";
import { CHOOSE_EVALUATION_TEMPLATE } from "@/lib/businessModules/statistics/components/evaluations/CreateEvaluationSidebar/CreateEvaluationFromScratchSidebar";
import { SidebarStepContentProps } from "@/lib/shared/components/SidebarStepper/sidebarStep";
import { businessModuleNames } from "@/lib/shared/components/procedures/constants";

import { ChooseDataSourceStepFormModel } from "./chooseDataSourceStepFormModel";

export interface DataSource {
  id: string;
  businessModule: string;
  name: string;
  sensitivity: DataSourceSensitivity;
  anonymizationOptions: AnonymizationOptions;
  attributes: CategorizedFlatAttribute[];
}

export interface ChooseDataSourceStepProps
  extends SidebarStepContentProps<ChooseDataSourceStepFormModel> {
  dataSources: DataSource[];
}

export function ChooseDataSourceStep(props: ChooseDataSourceStepProps) {
  return (
    <Stack flexDirection="column" gap={1}>
      <Stack flexDirection="column" gap={2}>
        <Typography>Datenquelle wählen:</Typography>
        <RadioGroupField
          name={props.fieldName("dataSourceId")}
          required="Bitte Vorlage oder Datenquelle auswählen"
        >
          <Stack gap={2}>
            <SelectableCard
              value={CHOOSE_EVALUATION_TEMPLATE}
              forGroupName={props.fieldName("dataSourceId")}
            >
              <Typography level="title-md">Vorlage anwenden</Typography>
            </SelectableCard>
            {props.dataSources.map((dataSource) => (
              <SelectableCard
                key={dataSource.id}
                value={dataSource.id}
                forGroupName={props.fieldName("dataSourceId")}
              >
                <Stack gap={0.5}>
                  <Typography level="title-md">
                    {
                      businessModuleNames[
                        mapToApiBusinessModule(dataSource.businessModule)
                      ]
                    }
                  </Typography>
                  <Typography level="body-sm">{dataSource.name}</Typography>
                </Stack>
              </SelectableCard>
            ))}
          </Stack>
        </RadioGroupField>
      </Stack>
    </Stack>
  );
}
