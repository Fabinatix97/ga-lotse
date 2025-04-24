/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Grid, Stack, Typography } from "@mui/joy";
import { isNullish } from "remeda";

import {
  ConfiguratorModuleName,
  configuratorNameMapping,
} from "@/lib/configurator/api/models/configuratorModuleName";
import { useGetAllModulesStatuses } from "@/lib/configurator/api/queries/useGetAllModulesStatuses";
import { ConfiguratorLayout } from "@/lib/configurator/components/shared/ConfiguratorLayout";
import { getAllOtherModules } from "@/lib/configurator/components/shared/modulesStatusUtils";

import { ConfiguratorCard } from "./ConfiguratorCard";
import { AllModulesAlert } from "./ConfiguratorState";
import { OtherModulesCard } from "./OtherModulesCard";

export function ConfiguratorOverview(props: {
  module: ConfiguratorModuleName;
}) {
  const { data } = useGetAllModulesStatuses();

  if (isNullish(data)) {
    throw new Error("undefined GA-Konfigurator status response");
  }
  return (
    <ConfiguratorLayout module={props.module}>
      <Stack gap={2}>
        <AllModulesAlert data={data} />
        <Typography level="h3">
          Konfiguration des{" "}
          {props.module === "baseModule"
            ? "Grundmoduls"
            : `Fachmoduls ${configuratorNameMapping[props.module]}`}
        </Typography>
        <Stack gap={5}>
          <Grid container spacing={2} sx={{ flexGrow: 1 }}>
            {data[props.module]?.endpointStates.map((tab) => (
              <Grid key={tab.tabButtonName} xxs={12} xs={6}>
                <ConfiguratorCard
                  title={tab.tabButtonName}
                  link={tab.link}
                  status={tab.status}
                />
              </Grid>
            ))}
          </Grid>
          <Stack gap={2}>
            <Typography level="h3">Konfiguration weiterer Module</Typography>
            <OtherModulesCard tabs={getAllOtherModules(props.module, data)} />
          </Stack>
        </Stack>
      </Stack>
    </ConfiguratorLayout>
  );
}
