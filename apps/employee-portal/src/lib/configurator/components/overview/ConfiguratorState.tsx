/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Box, List, ListItem } from "@mui/joy";

import { Alert } from "@eshg/lib-portal";

import { ConfiguratorStatusOverview } from "@/lib/configurator/api/models/configuratorStatusOverview";
import {
  existModuleError,
  existModuleWarning,
  isAllModulesCompleted,
} from "@/lib/configurator/components/shared/modulesStatusUtils";

export function AllModulesAlert({
  data,
}: {
  data: Partial<ConfiguratorStatusOverview>;
}) {
  if (isAllModulesCompleted(data)) {
    return (
      <Alert color="success" message="Alle Pflichtangaben sind vollständig." />
    );
  }
  if (existModuleWarning(data) && !existModuleError(data)) {
    return (
      <Alert
        color="success"
        messageComponent={Box}
        message={
          <List
            sx={{
              "--List-padding": 0,
              "--List-gap": 0,
              "--ListItem-paddingY": 0,
              "--ListItem-minHeight": 1.5,
            }}
            marker="disc"
            color="success"
            variant="soft"
          >
            <ListItem color="success" variant="soft">
              Alle Pflichtangaben sind vollständig.
            </ListItem>
            <ListItem color="success" variant="soft">
              Es wird empfohlen, auch die optionalen Felder für englische
              Übersetzungen auszufüllen.
            </ListItem>
          </List>
        }
      />
    );
  }
  if (existModuleError(data)) {
    return (
      <Alert
        color="warning"
        message="Die Anwendung darf nur produktiv genutzt werden, wenn sämtliche Angaben in allen Modulen vollständig befüllt sind. "
      />
    );
  }
}
