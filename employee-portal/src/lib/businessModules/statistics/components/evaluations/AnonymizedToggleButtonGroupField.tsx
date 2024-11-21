/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Alert } from "@eshg/lib-portal/components/Alert";
import { optionsFromRecord } from "@eshg/lib-portal/components/formFields/SelectOptions";
import { List, ListItem, Stack, Typography } from "@mui/joy";
import { useFormikContext } from "formik";

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

interface AnonymizedToggleButtonGroupFieldProps
  extends Pick<ToggleButtonGroupFieldProps, "name"> {
  withoutAnonymizationAllowed: boolean;
}

export function AnonymizedToggleButtonGroupField(
  props: AnonymizedToggleButtonGroupFieldProps,
) {
  const { getFieldProps } = useFormikContext();
  const { value } = getFieldProps<string>(props.name);

  return props.withoutAnonymizationAllowed ? (
    <Stack gap={2} data-testid="anonymized-toggle-button-group">
      <ToggleButtonGroupField
        options={optionsFromRecord(anonymizedFieldValueNames)}
        name={props.name}
        label="Anonymisierung der Daten"
      />
      {value === ENUM_FALSE_VALUE && (
        <Alert
          color="primary"
          messageComponent={Stack}
          message={
            <>
              <Typography>
                Auswertungen mit personenbezogenen Daten unterliegen folgenden
                Einschränkungen:
              </Typography>
              <List marker="disc" color="primary" variant="soft">
                <ListItem color="primary" variant="soft">
                  Sie können nicht als Vorlage für Reports verwendet werden.
                </ListItem>
                <ListItem color="primary" variant="soft">
                  Bilder und Daten können nicht exportiert werden.
                </ListItem>
              </List>
            </>
          }
        />
      )}
    </Stack>
  ) : (
    <Alert
      color="primary"
      message="Die Daten werden für die Auswertung anonymisiert."
    />
  );
}
