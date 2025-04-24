/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { CheckCircleOutlineOutlined } from "@mui/icons-material";
import { Card, CardContent, Stack, Typography } from "@mui/joy";

import { ConfiguratorStatusOverview } from "@/lib/configurator/api/models/configuratorStatusOverview";
import {
  existModuleError,
  existModuleWarning,
  getAllErrorModules,
  getAllWarningModules,
  isAllModulesCompleted,
} from "@/lib/configurator/components/shared/modulesStatusUtils";

import { OtherModulesLink } from "./OtherModulesLink";

export function OtherModulesCard(props: { tabs: ConfiguratorStatusOverview }) {
  if (isAllModulesCompleted(props.tabs)) {
    return (
      <Card sx={{ padding: 3 }}>
        <CardContent sx={{ gap: 2, flexDirection: "row" }}>
          <CheckCircleOutlineOutlined color="success" />
          <Typography level="body-md">
            Die Konfiguration aller weiteren Module ist vollständig.
          </Typography>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card sx={{ padding: 3 }}>
      <CardContent>
        <Stack gap={5}>
          {existModuleError(props.tabs) && (
            <Stack gap={2}>
              <Typography level="body-md">
                Vervollständigen Sie auch sämtliche Angaben in der Konfiguration
                folgender Module:
              </Typography>
              <OtherModulesLink
                modules={getAllErrorModules(props.tabs)}
                status={"INCOMPLETE"}
              />
            </Stack>
          )}
          {existModuleWarning(props.tabs) && (
            <Stack gap={2}>
              <Typography level="body-md">
                In folgenden Modulen fehlen Daten zur englischen Übersetzung. Es
                wird empfohlen, diese bereitzustellen:
              </Typography>
              <OtherModulesLink
                modules={getAllWarningModules(props.tabs)}
                status={"PARTIALLY_COMPLETE"}
              />
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
