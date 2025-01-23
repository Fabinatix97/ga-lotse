/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Alert } from "@eshg/lib-portal/components/Alert";
import { optionsFromRecord } from "@eshg/lib-portal/components/formFields/SelectOptions";
import { List, ListItem, Stack, Typography } from "@mui/joy";
import { useFormikContext } from "formik";

import { AnonymizationOptions } from "@/lib/businessModules/statistics/api/models/anonymizationOptions";
import { DataSourceSensitivity } from "@/lib/businessModules/statistics/api/models/dataSourceSensitivity";
import {
  ENUM_FALSE_VALUE,
  ENUM_TRUE_VALUE,
} from "@/lib/businessModules/statistics/components/evaluations/details/filter/enumFilterMappings";
import {
  ToggleButtonGroupField,
  ToggleButtonGroupFieldProps,
} from "@/lib/shared/components/formFields/ToggleButtonGroupField";

export type AnonymizedFieldValue =
  | typeof ENUM_TRUE_VALUE
  | typeof ENUM_FALSE_VALUE;

export function mapAnonymizedFieldValueToBoolean(value: AnonymizedFieldValue) {
  return anonymizedFieldValueToBoolean[value];
}

const anonymizedFieldValueToBoolean = {
  [ENUM_TRUE_VALUE]: true,
  [ENUM_FALSE_VALUE]: false,
} satisfies Record<AnonymizedFieldValue, boolean>;

export const anonymizedFieldValueNames = {
  [ENUM_TRUE_VALUE]: "Ja",
  [ENUM_FALSE_VALUE]: "Nein",
} satisfies Record<AnonymizedFieldValue, string>;

interface AnonymizationConfigurationProps
  extends Pick<ToggleButtonGroupFieldProps, "name"> {
  anonymizationOptions: AnonymizationOptions;
  sensitivity: DataSourceSensitivity | undefined;
}

export function AnonymizationConfiguration(
  props: AnonymizationConfigurationProps,
) {
  const { getFieldProps } = useFormikContext();
  const { value } = getFieldProps<string>(props.name);

  switch (props.anonymizationOptions) {
    case AnonymizationOptions.Choice:
      return (
        <Stack gap={2} data-testid="anonymized-toggle-button-group">
          <ToggleButtonGroupField
            options={optionsFromRecord(anonymizedFieldValueNames)}
            name={props.name}
            label="Anonymisierung der Daten"
          />
          {value === ENUM_FALSE_VALUE ? (
            <SensitivityInfo sensitivity={props.sensitivity} />
          ) : (
            <AnonymizationAlert />
          )}
        </Stack>
      );
    case AnonymizationOptions.AlwaysAnonymize:
      return <AnonymizationAlert />;
    case AnonymizationOptions.NotAnonymizable:
      return <SensitivityInfo sensitivity={props.sensitivity} />;
  }
}

function AnonymizationAlert() {
  return (
    <Alert
      color="primary"
      message="Die Daten werden für die Auswertung anonymisiert."
    />
  );
}

function SensitivityInfo(props: {
  sensitivity: DataSourceSensitivity | undefined;
}) {
  switch (props.sensitivity) {
    case DataSourceSensitivity.Sensitive:
      return (
        <Alert
          color="primary"
          messageComponent={Stack}
          message={
            <>
              <Typography>
                Diese Auswertung enthält sensible Daten. Sie unterliegt daher
                folgenden Einschränkungen:
              </Typography>
              <List marker="disc" color="primary" variant="soft">
                <ListItem color="primary" variant="soft">
                  Sie kann nicht als Vorlage für Reports verwendet werden.
                </ListItem>
                <ListItem color="primary" variant="soft">
                  Bilder und Daten können nicht exportiert werden.
                </ListItem>
                <ListItem color="primary" variant="soft">
                  Personen außerhalb der zuständigen Abteilung haben keinen
                  Zugriff auf die Auswertung.
                </ListItem>
              </List>
            </>
          }
        />
      );
    case DataSourceSensitivity.InternalUsage:
      return (
        <Alert
          color="primary"
          message="Diese Auswertung enthält personenbezogene Daten. Sie ist ausschließlich für den internen Gebrauch innerhalb des Gesundheitsamtes vorgesehen."
        />
      );
    case DataSourceSensitivity.Anonymous:
      return (
        <Alert
          color="primary"
          message="Diese Auswertung ist anonym und eignet sich damit auch für die Verwendung über das Gesundheitsamt hinaus."
        />
      );
  }
}
