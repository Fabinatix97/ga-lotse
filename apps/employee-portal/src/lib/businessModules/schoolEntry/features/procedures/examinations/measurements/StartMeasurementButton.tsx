/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import DeviceHubIcon from "@mui/icons-material/DeviceHub";
import { Button } from "@mui/joy";

import { useConfirmationDialog } from "@eshg/lib-employee-portal";
import { ApiMeasuringDeviceType } from "@eshg/school-entry-api";

import { useDeviceTestInitiationSidebar } from "@/lib/businessModules/schoolEntry/features/procedures/examinations/measurements/DeviceTestInitiationSidebar";
import { useGetSchoolEntryDeviceRegistryConfig } from "@/lib/configurator/api/queries/schoolEntry";

interface StartMeasurementButtonProps {
  deviceType: ApiMeasuringDeviceType;
  hasTestResults: boolean;
  procedureId: string;
  version: number;
}

export function StartMeasurementButton({
  deviceType,
  hasTestResults,
  procedureId,
  version,
}: StartMeasurementButtonProps) {
  const deviceTestInitiationSidebar = useDeviceTestInitiationSidebar();
  const { openConfirmationDialog } = useConfirmationDialog();
  const { data: config } = useGetSchoolEntryDeviceRegistryConfig();

  function onStartMeasurement() {
    if (!hasTestResults) {
      deviceTestInitiationSidebar.open({ deviceType, version, procedureId });
    } else {
      openConfirmationDialog({
        title: "Löschung eingetragener Werte!",
        description:
          "Bereits eingetragene Messwerte werden bei einer erneuten Messung über ein Messgerät automatisch gelöscht und überschrieben.",
        confirmLabel: "Messgerät nutzen",
        onConfirm: () =>
          deviceTestInitiationSidebar.open({
            deviceType,
            version,
            procedureId,
          }),
      });
    }
  }

  if (!config.hearingTestDeviceMeasuring) {
    return null;
  }

  return (
    <Button
      startDecorator={<DeviceHubIcon />}
      variant="plain"
      sx={{ alignSelf: "left" }}
      onClick={onStartMeasurement}
    >
      Messgerät nutzen
    </Button>
  );
}
