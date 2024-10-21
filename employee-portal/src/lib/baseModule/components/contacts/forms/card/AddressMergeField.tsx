/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiCountryCode } from "@eshg/employee-portal-api/base";
import { useBaseField } from "@eshg/lib-portal/components/formFields/BaseField";
import { FieldProps } from "@eshg/lib-portal/types/form";
import ErrorIcon from "@mui/icons-material/ErrorOutline";
import {
  FormControl,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
  Sheet,
  Stack,
  Typography,
} from "@mui/joy";
import { ChangeEvent, useState } from "react";
import { isDefined } from "remeda";

import { BaseAddressDetails } from "@/lib/shared/components/address/BaseAddressDetails";
import { DetailsCell } from "@/lib/shared/components/detailsSection/DetailsCell";
import { DetailsRow } from "@/lib/shared/components/detailsSection/DetailsRow";
import { BaseAddressFormInputs } from "@/lib/shared/components/form/address/helpers";
import { translateCountry } from "@/lib/shared/helpers/i18n";
import { join } from "@/lib/shared/helpers/strings";

interface AddressSelectOption {
  label: string;
  value: BaseAddressFormInputs | undefined;
}

interface AddressCardsFieldProps
  extends FieldProps<BaseAddressFormInputs | undefined> {
  options: AddressSelectOption[];
  value: BaseAddressFormInputs | undefined;
  readOnly: boolean;
}

function AddressOption({ address }: { address: BaseAddressFormInputs }) {
  return (
    <Stack gap={1}>
      <DetailsCell
        name={"differentName"}
        label={"Abweichender Empfänger"}
        value={address.differentName}
      />
      <DetailsCell
        name={"postbox"}
        label={"Postfachnummer"}
        value={address.postbox}
      />
      {address.street && (
        <DetailsCell
          name={"street"}
          label={"Straße und Haus-Nr."}
          value={join([address.street, address.houseNumber], " ")}
        />
      )}

      <DetailsCell
        name={"addressAddition"}
        label={"Adresszusatz"}
        value={address.addressAddition}
      />
      <DetailsRow>
        <DetailsCell
          name={"postalCode"}
          label={"Postleitzahl"}
          value={address.postalCode}
        />
        <DetailsCell
          name={"city"}
          label={"Ort"}
          value={address.city}
          avoidWrap
        />
      </DetailsRow>

      {address.country !== ApiCountryCode.De && (
        <DetailsCell
          name={"country"}
          label={"Land"}
          value={translateCountry(address.country)}
        />
      )}
    </Stack>
  );
}

export function AddressMergeField({
  options,
  readOnly,
  value,
  ...fieldProps
}: AddressCardsFieldProps) {
  const { input, error, required, helpers } = useBaseField(fieldProps);

  const [selectedLabel, setSelectedLabel] = useState("");

  if (readOnly) {
    const titleId = `${fieldProps.name}-title`;
    return (
      isDefined(value) && (
        <Stack component={"section"} gap={"inherit"} aria-labelledby={titleId}>
          <Typography component={"h2"} level={"title-md"} id={titleId}>
            {fieldProps.label}
          </Typography>
          <BaseAddressDetails address={value} />
        </Stack>
      )
    );
  }

  async function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const index = parseInt(event.target.value);
    await helpers.setValue(options[index]?.value);
    setSelectedLabel(event.target.value);
  }

  return (
    <FormControl error={error} required={required}>
      <FormLabel htmlFor={input.name}>{fieldProps.label}</FormLabel>
      <RadioGroup
        onChange={(event) => void handleChange(event)}
        value={selectedLabel}
        name={input.name}
      >
        <Stack gap={2}>
          {options.map(({ label, value }, index) => (
            <Radio
              key={index}
              value={index}
              label={
                <Stack gap={3}>
                  {label}
                  {isDefined(value) && (
                    <Sheet variant={"soft"}>
                      <Typography whiteSpace={"preserve"}>
                        <AddressOption address={value} />
                      </Typography>
                    </Sheet>
                  )}
                </Stack>
              }
            />
          ))}
        </Stack>
      </RadioGroup>
      {error && (
        <FormHelperText>
          <ErrorIcon /> {fieldProps.required}
        </FormHelperText>
      )}
    </FormControl>
  );
}
