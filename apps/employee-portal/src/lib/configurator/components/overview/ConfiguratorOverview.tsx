/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Grid, Stack, Typography } from "@mui/joy";
import { isNullish } from "remeda";

import { ConfiguratorLayout } from "@/lib/configurator/components/shared/ConfiguratorLayout";
import { configuratorNameMapping } from "@/lib/configurator/components/shared/configuratorNameMapping";
import { getAllOtherModules } from "@/lib/configurator/components/shared/modulesStatusUtils";
import { ConfiguratorModuleName } from "@/lib/configurator/shared/types";
import { useGetAllModulesStatuses } from "@/lib/shared/api/queries/configurator/status";

import { ConfiguratorCard } from "./ConfiguratorCard";
import { AllModulesAlert } from "./ConfiguratorState";
import { OtherModulesCard } from "./OtherModulesCard";

export function ConfiguratorOverview({
  module,
}: {
  module: ConfiguratorModuleName;
}) {
  const { data } = useGetAllModulesStatuses();

  if (isNullish(data)) {
    throw new Error("undefined GA-Konfigurator status response");
  }
  return (
    <ConfiguratorLayout module={module}>
      <Stack gap={2}>
        <AllModulesAlert data={data} />
        <Typography level="h3" component="h2">
          Konfiguration des{" "}
          {module === "BASE"
            ? "Grundmoduls"
            : `Fachmoduls ${configuratorNameMapping[module]}`}
        </Typography>
        <Stack gap={5}>
          <Grid container spacing={2} sx={{ flexGrow: 1 }} role="list">
            {data[module]?.endpointStates.map((tab) => (
              <Grid key={tab.tabButtonName} xxs={12} xs={6} role="listitem">
                <ConfiguratorCard
                  title={tab.tabButtonName}
                  link={tab.link}
                  status={tab.status!} // TODO: raise error if status is undefined
                />
              </Grid>
            ))}
          </Grid>
          <Stack gap={2}>
            <Typography level="h3" component="h2">
              Konfiguration weiterer Module
            </Typography>
            <OtherModulesCard tabs={getAllOtherModules(module, data)} />
          </Stack>
        </Stack>
      </Stack>
    </ConfiguratorLayout>
  );
}
