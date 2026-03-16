/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Grid, Stack, Typography } from "@mui/joy";
import { isNullish } from "remeda";

import { ApiSchoolEntryFeature } from "@eshg/school-entry-api";

import { useIsNewFeatureEnabledUnsuspended } from "@/lib/businessModules/schoolEntry/api/queries/featureTogglesApi";
import { useGetAllModulesStatuses } from "@/lib/configurator/api/queries/status";
import { ConfiguratorLayout } from "@/lib/configurator/components/shared/ConfiguratorLayout";
import { configuratorNameMapping } from "@/lib/configurator/components/shared/configuratorNameMapping";
import { getAllOtherModules } from "@/lib/configurator/components/shared/modulesStatusUtils";
import { ConfiguratorModuleName } from "@/lib/configurator/shared/types";

import { ConfiguratorCard } from "./ConfiguratorCard";
import { AllModulesAlert } from "./ConfiguratorState";
import { OtherModulesCard } from "./OtherModulesCard";

export function ConfiguratorOverview({
  module,
}: {
  module: ConfiguratorModuleName;
}) {
  const { data } = useGetAllModulesStatuses();
  const { data: isDeviceRegistryEnabled } = useIsNewFeatureEnabledUnsuspended(
    ApiSchoolEntryFeature.MeasuringDevices,
  );

  if (isNullish(data)) {
    throw new Error("undefined GA-Konfigurator status response");
  }

  const configuratorTiles =
    module === ConfiguratorModuleName.SchoolEntry && !isDeviceRegistryEnabled
      ? data[module]?.endpointStates.filter(
          (tab) => tab.endpointName !== "DEVICE_REGISTRY",
        )
      : data[module]?.endpointStates;

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
            {configuratorTiles?.map((tab, index) => (
              <Grid key={tab.tabButtonName} xxs={12} xs={6} role="listitem">
                <ConfiguratorCard
                  autoFocus={index === 0}
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
