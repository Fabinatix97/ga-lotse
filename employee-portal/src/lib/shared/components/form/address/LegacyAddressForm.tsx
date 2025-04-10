/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { CountryField } from "@eshg/lib-employee-portal";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import {
  buildEnumOptions,
  createFieldNameMapper,
} from "@eshg/lib-portal/helpers/form";
import { validateLength } from "@eshg/lib-portal/helpers/validators";
import { NestedFormProps } from "@eshg/lib-portal/types/form";
import { ApiCountryCode } from "@eshg/measles-protection-api";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button, Grid, IconButton, Stack, Typography } from "@mui/joy";
import { useFormikContext } from "formik";
import { useState } from "react";

import { ApiFacilityAddressType } from "@/lib/shared/components/form/address/legacyTypes";
import { LegacyPerson } from "@/lib/shared/components/legacyPersonSidebar/form/LegacyPersonForm";

const LEGACY_ADDRESS_TYPE_LABELS = {
  [ApiFacilityAddressType.Postal]: "Postanschrift",
  [ApiFacilityAddressType.Billing]: "Rechnungsanschrift",
};

export const LEGACY_ADDRESS_TYPE_OPTIONS =
  buildEnumOptions<ApiFacilityAddressType>(LEGACY_ADDRESS_TYPE_LABELS);

export interface LegacyBaseAddress {
  addressAddition?: string;
  city: string;
  country: ApiCountryCode;
  houseNumber?: string;
  postalCode: string;
  street: string;
  type: ApiFacilityAddressType;
}

export function createEmptyLegacyAddress(
  type: ApiFacilityAddressType,
): LegacyBaseAddress {
  return {
    addressAddition: "",
    city: "",
    country: "DE",
    houseNumber: "",
    postalCode: "",
    street: "",
    type,
  };
}

interface LegacyAddressFormProps extends NestedFormProps {
  name: string;
  type: ApiFacilityAddressType;
  isOptional: boolean;
  show?: boolean;
}

export function LegacyAddressForm(props: LegacyAddressFormProps) {
  const fieldName = createFieldNameMapper(props.name);
  const { setFieldValue } = useFormikContext<LegacyPerson>();
  const [show, setShow] = useState(props.show ?? !props.isOptional);

  return (
    <>
      {props.isOptional && !show && (
        <Button
          onClick={() => {
            setShow(true);
            return setFieldValue(
              props.name,
              createEmptyLegacyAddress(props.type),
            );
          }}
          variant="plain"
          color="primary"
          startDecorator={<AddIcon />}
          sx={{ alignSelf: "start" }}
        >
          {`Abweichende ${LEGACY_ADDRESS_TYPE_LABELS[props.type]} eingeben`}
        </Button>
      )}
      {show && (
        <Stack gap={2}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography level="title-md">
              {LEGACY_ADDRESS_TYPE_LABELS[props.type]}
            </Typography>
            {props.isOptional && (
              <IconButton
                aria-label="Entfernen"
                color="primary"
                onClick={() => {
                  setShow(false);
                  return setFieldValue(props.name, undefined);
                }}
              >
                <DeleteIcon />
              </IconButton>
            )}
          </Stack>
          <Grid container columnSpacing={1} rowSpacing={2}>
            {}
            <Grid xs={9}>
              <InputField
                name={fieldName("street")}
                label="Straße"
                required={
                  props.isOptional ? undefined : "Bitte eine Straße angeben."
                }
              />
            </Grid>
            <Grid xs={3}>
              <InputField
                name={fieldName("houseNumber")}
                label="Haus-Nr."
                required={
                  props.isOptional ? undefined : "Bitte Haus-Nr. angeben."
                }
              />
            </Grid>
          </Grid>

          <InputField
            name={fieldName("addressAddition")}
            label="Adresszusatz"
            validate={(value) =>
              value ? validateLength(1, 100)(value) : undefined
            }
          />

          <Grid container columnSpacing={1}>
            <Grid xs={3}>
              <InputField
                name={fieldName("postalCode")}
                label="Postleitzahl"
                required={props.isOptional ? undefined : "Bitte PLZ angeben."}
              />
            </Grid>
            <Grid xs={9}>
              <InputField
                name={fieldName("city")}
                label="Ort"
                required={
                  props.isOptional ? undefined : "Bitte einen Ort angeben."
                }
              />
            </Grid>
          </Grid>

          <CountryField
            name={fieldName("country")}
            label="Land"
            required={props.isOptional ? undefined : "Bitte Land auswählen."}
          />
        </Stack>
      )}
    </>
  );
}
