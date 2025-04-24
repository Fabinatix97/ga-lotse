/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiDiffAddress } from "@eshg/base-api";
import { translateCountry } from "@eshg/lib-portal/helpers/countryOption";
import { Stack } from "@mui/joy";
import { isDefined } from "remeda";

import {
  BaseAddress,
  TaggedDomesticAddress,
  TaggedPostboxAddress,
  isDomesticAddress,
  isPostboxAddress,
} from "@/api/models/address";
import { SyncFormField } from "@/features/persons/components/personSync/SyncFormField";
import {
  DiffArrow,
  SyncFormBlock,
  SyncFormSection,
} from "@/features/persons/components/personSync/SyncFormGrid";
import { formatList } from "@/utils/formatters";

const ADDRESS_FIELD_NAME = {
  type: "Art",
  differentName: "Abweichender Empfänger",
  streetAndHouseNumber: "Straße und Haus-Nr.",
  street: "Straße",
  houseNumber: "Haus-Nr.",
  city: "Ort",
  country: "Land",
  postbox: "Postfachnummer",
  postalCode: "Postleitzahl",
  addressAddition: "Adresszusatz",
} as const satisfies Record<
  keyof TaggedDomesticAddress | keyof TaggedPostboxAddress,
  string
> & {
  streetAndHouseNumber: "Straße und Haus-Nr.";
};

export function SyncBaseAddressSection({
  address,
}: {
  address: ApiDiffAddress;
}) {
  return (
    <SyncFormSection>
      <BaseAddressBlock
        changedFields={address.differingFields}
        address={address.fileState}
      />
      <DiffArrow />
      <BaseAddressBlock
        changedFields={address.differingFields}
        address={address.reference}
      />
    </SyncFormSection>
  );
}

function BaseAddressBlock({
  address,
  changedFields,
}: {
  address: BaseAddress | undefined;
  changedFields: string[];
}) {
  return (
    <SyncFormBlock>
      <SyncFormField
        label={ADDRESS_FIELD_NAME.differentName}
        value={address?.differentName}
        visible={changedFields.includes("differentName")}
      />
      <SyncFormField
        label={ADDRESS_FIELD_NAME.postbox}
        value={isPostboxAddress(address) ? address?.postbox : undefined}
        visible={changedFields.includes("postbox")}
      />
      <SyncFormField
        altLabel="Straße und Hausnummer"
        label={ADDRESS_FIELD_NAME.streetAndHouseNumber}
        value={
          isDomesticAddress(address)
            ? formatList([address?.street, address?.houseNumber], " ")
            : undefined
        }
        visible={
          changedFields.includes("street") ||
          changedFields.includes("houseNumber")
        }
      />
      {(changedFields.includes("postalCode") ||
        changedFields.includes("city")) && (
        <Stack direction="row" gap={3}>
          <SyncFormField
            label={ADDRESS_FIELD_NAME.postalCode}
            value={address?.postalCode}
            visible={changedFields.includes("postalCode")}
          />
          <SyncFormField
            label={ADDRESS_FIELD_NAME.city}
            value={address?.city}
            visible={changedFields.includes("city")}
          />
        </Stack>
      )}
      <SyncFormField
        label={ADDRESS_FIELD_NAME.addressAddition}
        value={
          isDomesticAddress(address) ? address?.addressAddition : undefined
        }
        visible={changedFields.includes("addressAddition")}
      />
      <SyncFormField
        label={ADDRESS_FIELD_NAME.country}
        value={
          isDefined(address?.country)
            ? translateCountry(address?.country)
            : undefined
        }
        visible={changedFields.includes("country")}
      />
    </SyncFormBlock>
  );
}
