/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import Add from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { Button, IconButton, Sheet, Stack, Switch, Typography } from "@mui/joy";
import { createColumnHelper } from "@tanstack/react-table";
import { notFound } from "next/navigation";
import { useState } from "react";

import { DataTable, TableSheet } from "@eshg/lib-employee-portal";
import {
  ApiSchoolEntryFeature,
  type ApiSchoolEntryMeasuringDevice,
} from "@eshg/school-entry-api";

import { useIsNewFeatureEnabled } from "@/lib/businessModules/schoolEntry/api/queries/featureTogglesApi";
import {
  useUpdateHearingTestMeasuring,
  useUpdateSeeingTestMeasuring,
} from "@/lib/configurator/api/mutations/useUpdateSchoolEntry";
import { useGetSchoolEntryDeviceRegistryConfig } from "@/lib/configurator/api/queries/schoolEntry";
import { useAddDeviceSidebar } from "@/lib/configurator/components/shared/ConfiguratorDetails/deviceRegistry/AddDeviceSidebar";
import { useEditDeviceSidebar } from "@/lib/configurator/components/shared/ConfiguratorDetails/deviceRegistry/EditDeviceSidebar";
import {
  DEVICE_TYPE_VALUES,
  GDT_FILE_DRIVER_VALUES,
} from "@/lib/configurator/components/shared/ConfiguratorDetails/deviceRegistry/constants";
import { isEndpointSupportedByModule } from "@/lib/configurator/shared/config";
import {
  ConfiguratorEndpointName,
  ConfiguratorModuleName,
} from "@/lib/configurator/shared/types";

const endpointName: ConfiguratorEndpointName = "DEVICE_REGISTRY";

export function DeviceRegistry(props: { module: ConfiguratorModuleName }) {
  const isDeviceRegistryEnabled = useIsNewFeatureEnabled(
    ApiSchoolEntryFeature.MeasuringDevices,
  );

  if (!isDeviceRegistryEnabled) {
    throw new Error("Feature toggle for device registry is not enabled!");
  }

  if (!isEndpointSupportedByModule(props.module, endpointName)) {
    notFound();
  }

  return <DeviceRegistryForm module={props.module} />;
}

function DeviceRegistryForm(_props: { module: ConfiguratorModuleName }) {
  const editSidebar = useEditDeviceSidebar();
  const addSidebar = useAddDeviceSidebar();
  const { data: config } = useGetSchoolEntryDeviceRegistryConfig();
  const [seeingMeasuringChecked, setSeeingMeasuringChecked] = useState<boolean>(
    config.seeingTestDeviceMeasuring,
  );
  const [hearingMeasuringChecked, setHearingMeasuringChecked] =
    useState<boolean>(config.hearingTestDeviceMeasuring);
  const updateHearingTestMeasuring = useUpdateHearingTestMeasuring();
  const updateSeeingTestMeasuring = useUpdateSeeingTestMeasuring();

  function handleEditClick(deviceId: string) {
    const device = config.measuringDevices.find(
      (device) => device.externalId === deviceId,
    );
    if (!device) return;
    editSidebar.open({ device });
  }

  const columns = useColumns(handleEditClick);
  const totalElements = config.measuringDevices.length;

  return (
    <Sheet>
      <Stack gap={3}>
        <Stack
          gap={3}
          sx={{
            backgroundColor: (theme) => theme.palette.background.level1,
            padding: (theme) => theme.spacing(2),
            borderRadius: (theme) => theme.radius.md,
          }}
        >
          <Typography level="title-md" fontWeight={600}>
            Messgerät-Nutzung
          </Typography>
          <Stack gap={4} direction="row">
            <Switch
              slotProps={{
                input: {
                  "aria-label": "Hörtestgeräte",
                },
              }}
              checked={hearingMeasuringChecked}
              size="md"
              endDecorator={<Typography>Hörtestgeräte</Typography>}
              onChange={(event) => {
                setHearingMeasuringChecked(event.target.checked);
                void updateHearingTestMeasuring.mutateAsync({
                  enabled: event.target.checked,
                });
              }}
            />
            <Switch
              slotProps={{
                input: {
                  "aria-label": "Sehtestgeräte",
                },
              }}
              checked={seeingMeasuringChecked}
              size="md"
              endDecorator={<Typography>Sehtestgeräte</Typography>}
              onChange={(event) => {
                setSeeingMeasuringChecked(event.target.checked);
                void updateSeeingTestMeasuring.mutateAsync({
                  enabled: event.target.checked,
                });
              }}
            />
          </Stack>
        </Stack>
        <Stack
          justifyContent="space-between"
          alignItems="center"
          direction="row"
        >
          <Typography level="title-lg">Messgeräte ({totalElements})</Typography>
          <Button
            variant="plain"
            endDecorator={<Add />}
            onClick={() => addSidebar.open()}
          >
            Messgerät hinzufügen
          </Button>
        </Stack>
        <TableSheet>
          <DataTable
            data={config.measuringDevices}
            columns={columns}
            minWidth={1200}
          />
        </TableSheet>
      </Stack>
    </Sheet>
  );
}

const columnHelper = createColumnHelper<ApiSchoolEntryMeasuringDevice>();

function useColumns(onEditClick: (deviceId: string) => void) {
  return [
    columnHelper.accessor("deviceType", {
      header: "Art",
      cell: (props) => DEVICE_TYPE_VALUES[props.getValue()],
      meta: {
        width: "14%",
      },
    }),
    columnHelper.accessor("equipmentSelector", {
      header: "Gerätekennung",
      cell: (props) => props.getValue(),
      meta: {
        width: "20%",
      },
    }),
    columnHelper.accessor("name", {
      id: "name",
      header: "Name",
      cell: (props) => props.getValue(),
    }),
    columnHelper.accessor("gdtDriver", {
      header: "GDT-Treiber",
      cell: (props) => GDT_FILE_DRIVER_VALUES[props.getValue()],
    }),
    columnHelper.display({
      id: "actions",
      enableSorting: false,
      cell: (props) => {
        return (
          <IconButton
            aria-label="Bearbeiten"
            onClick={() => onEditClick(props.row.original.externalId)}
          >
            <EditIcon color="primary" />
          </IconButton>
        );
      },
      meta: {
        cellStyle: "button",
        width: "5%",
        textAlign: "right",
      },
    }),
  ];
}
