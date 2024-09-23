/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ArrowForward } from "@mui/icons-material";
import { Button, Stack, Typography } from "@mui/joy";
import { useFormikContext } from "formik";

import { mapToApiBusinessModule } from "@/lib/businessModules/statistics/api/mapper/mapToApiBusinessModule";
import { ChooseDataSourceStepFormModel } from "@/lib/businessModules/statistics/components/statistics/CreateStatisticSidebar/ChooseDataSourceStep/chooseDataSourceStepFormModel";
import { SelectableCard } from "@/lib/shared/components/cards/SelectableCard";
import { RadioGroupField } from "@/lib/shared/components/formFields/RadioGroupField";
import { businessModuleNames } from "@/lib/shared/components/procedures/constants";

export interface DataSource {
  id: string;
  businessModule: string;
  name: string;
}

export function ChooseDataSourceStep(props: {
  dataSources: DataSource[];
  viewTemplates: () => void;
}) {
  const { setFieldValue } = useFormikContext<ChooseDataSourceStepFormModel>();
  return (
    <Stack flexDirection="column" gap={1}>
      <Stack flexDirection="column" gap={2}>
        <Typography>Fachmodul wählen:</Typography>
        <RadioGroupField
          name="_dataSourceId"
          onChange={(id) => {
            void setFieldValue(
              "dataSource",
              props.dataSources.find((it) => it.id === id),
            );
          }}
          required="Bitte Fachmodul auswählen"
        >
          <Stack gap={2}>
            {props.dataSources.map((dataSource) => (
              <SelectableCard key={dataSource.id} value={dataSource.id}>
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
      <Button
        sx={{ alignSelf: "flex-end" }}
        variant="plain"
        endDecorator={<ArrowForward />}
        onClick={props.viewTemplates}
      >
        Mit Vorlage fortfahren
      </Button>
    </Stack>
  );
}
