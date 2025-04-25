/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  CheckCircleOutlineOutlined,
  ErrorOutlineOutlined,
} from "@mui/icons-material";
import { Stack } from "@mui/joy";

import { InternalLink } from "@eshg/lib-portal/components/navigation/InternalLink";

import {
  ConfiguratorModuleName,
  configuratorNameMapping,
} from "@/lib/configurator/api/models/configuratorModuleName";
import { ConfiguratorStatusOverview } from "@/lib/configurator/api/models/configuratorStatusOverview";
import { ConfiguratorStatus } from "@/lib/configurator/api/models/configuratorTabItem";
import { routes } from "@/lib/configurator/shared/routes";

export function OtherModulesLink(props: {
  modules: ConfiguratorStatusOverview;
  status: Omit<ConfiguratorStatus, "COMPLETE">;
}) {
  return (
    <Stack gap={1}>
      {Object.keys(props.modules).map((tabKey) => (
        <Stack key={tabKey} gap={2} flexDirection="row">
          {props.status === "INCOMPLETE" ? (
            <ErrorOutlineOutlined color="warning" />
          ) : (
            <CheckCircleOutlineOutlined color="neutral" />
          )}
          <InternalLink
            underline="always"
            href={routes[tabKey as ConfiguratorModuleName].index}
          >
            {configuratorNameMapping[tabKey as ConfiguratorModuleName]}
          </InternalLink>
        </Stack>
      ))}
    </Stack>
  );
}
