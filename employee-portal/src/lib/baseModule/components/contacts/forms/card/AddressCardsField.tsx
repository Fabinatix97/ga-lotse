/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  BaseField,
  useBaseField,
} from "@eshg/lib-portal/components/formFields/BaseField";
import { FieldProps } from "@eshg/lib-portal/types/form";
import { RadioGroup, Stack, Typography } from "@mui/joy";
import { ChangeEvent, useEffect, useState } from "react";
import { isDefined } from "remeda";

import { SelectableCard } from "@/lib/shared/components/cards/SelectableCard";
import { BaseAddressFormInputs } from "@/lib/shared/components/form/address/helpers";
import { translateCountry } from "@/lib/shared/helpers/i18n";
import { join } from "@/lib/shared/helpers/strings";

interface AddressCardsFieldProps extends FieldProps<BaseAddressFormInputs> {
  options: BaseAddressFormInputs[];
}

function renderAddress(address: BaseAddressFormInputs) {
  return join(
    [
      address.type === "DomesticAddress"
        ? [address.street, address.houseNumber].join(" ")
        : address.postbox,
      address.addressAddition,
      [address.postalCode, address.city].join(" "),
      address.country !== "DE" ? translateCountry(address.country) : undefined,
    ],
    "\n",
  );
}

export function AddressCardsField({
  options,
  ...props
}: AddressCardsFieldProps) {
  const field = useBaseField(props);
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>(
    options.length === 1 ? 0 : undefined,
  );

  const setValue = field.helpers.setValue;

  useEffect(() => {
    if (isDefined(selectedIndex)) {
      void setValue(options[selectedIndex]!, false);
    }
  }, [setValue, options, selectedIndex]);

  if (options.length === 0) {
    return null;
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setSelectedIndex(parseInt(event.target.value));
  }

  return (
    <BaseField
      helperText={field.helperText}
      required={field.required}
      error={field.error}
      label={props.label}
    >
      <RadioGroup
        name={field.input.name}
        value={selectedIndex}
        onChange={handleChange}
      >
        <Stack gap={2}>
          {options.map((address, index) => (
            <SelectableCard
              key={index}
              value={index}
              radioProps={{
                color: field.error ? "danger" : undefined,
              }}
              sx={{
                borderColor: field.error ? "danger.300" : undefined,
              }}
            >
              <Typography whiteSpace={"preserve"}>
                {renderAddress(address)}
              </Typography>
            </SelectableCard>
          ))}
        </Stack>
      </RadioGroup>
    </BaseField>
  );
}
