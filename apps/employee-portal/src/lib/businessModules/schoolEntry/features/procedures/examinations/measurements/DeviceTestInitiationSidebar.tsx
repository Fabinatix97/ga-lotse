/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Button, Stack, Typography } from "@mui/joy";
import { Formik } from "formik";

import {
  ButtonBar,
  DrawerProps,
  SidebarActions,
  SidebarContent,
  SidebarForm,
  UseSidebarResult,
  useSidebar,
} from "@eshg/lib-employee-portal";
import { SelectField, SubmitButton } from "@eshg/lib-portal";
import { ApiMeasuringDeviceType } from "@eshg/school-entry-api";

import { useInitiateHearingTest } from "@/lib/businessModules/schoolEntry/api/mutations/schoolEntryApi";
import { useGetSchoolEntryDeviceRegistryConfig } from "@/lib/configurator/api/queries/schoolEntry";

export function useDeviceTestInitiationSidebar(): UseSidebarResult<DeviceTestInitiationSidebarProps> {
  return useSidebar({
    component: DeviceTestInitiationSidebar,
  });
}

interface DeviceTestInitiationSidebarProps extends DrawerProps {
  deviceType: ApiMeasuringDeviceType;
  procedureId: string;
  version: number;
}

export interface DeviceSelectorValues {
  equipmentSelector: string | null;
}

const initialValues: DeviceSelectorValues = { equipmentSelector: null };

function DeviceTestInitiationSidebar(props: DeviceTestInitiationSidebarProps) {
  const { data } = useGetSchoolEntryDeviceRegistryConfig();
  const initiateHearingTest = useInitiateHearingTest(props.procedureId);

  const options = data.measuringDevices
    .filter((device) => device.deviceType === props.deviceType)
    .map((device) => ({
      label: device.name,
      value: device.equipmentSelector,
    }));

  async function handleSubmit(values: DeviceSelectorValues) {
    if (!values.equipmentSelector) return;

    if (props.deviceType === ApiMeasuringDeviceType.HearingTest) {
      await initiateHearingTest.mutateAsync(
        {
          version: props.version,
          equipmentSelector: values.equipmentSelector,
        },
        { onSuccess: () => props.onClose() },
      );
    } else if (props.deviceType === ApiMeasuringDeviceType.SeeingTest) {
      props.onClose();
    }
  }

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      {({ isSubmitting }) => (
        <SidebarForm>
          <SidebarContent title="Messgerät nutzen">
            <Stack gap={2}>
              <Typography>
                Ein Messauftrag wird an die Messsoftware gesendet und das
                Messfenster automatisch geöffnet.
              </Typography>
              <Typography>
                Nach erfolgreicher Messung können Sie die Messergebnisse
                abrufen.
              </Typography>
              <SelectField
                label="Verfügbare Testgeräte"
                name="equipmentSelector"
                options={options}
                required="Bitte wählen Sie ein Testgerät aus."
              />
            </Stack>
          </SidebarContent>
          <SidebarActions>
            <ButtonBar
              left={
                <Button
                  variant="plain"
                  color="primary"
                  onClick={() => props.onClose()}
                >
                  Abbrechen
                </Button>
              }
              right={
                <SubmitButton submitting={isSubmitting}>
                  Messauftrag senden
                </SubmitButton>
              }
            />
          </SidebarActions>
        </SidebarForm>
      )}
    </Formik>
  );
}
