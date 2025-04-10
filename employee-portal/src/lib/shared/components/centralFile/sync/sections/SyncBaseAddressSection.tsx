/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiDiffAddress } from "@eshg/base-api";
import {
  BaseAddress,
  formatList,
  isDomesticAddress,
  isPostboxAddress,
} from "@eshg/lib-employee-portal";
import { translateCountry } from "@eshg/lib-portal/helpers/countryOption";
import { Stack } from "@mui/joy";
import { isDefined } from "remeda";

import { BASE_ADDRESS_FIELD_NAME } from "@/lib/shared/components/address/constants";
import { SyncFormField } from "@/lib/shared/components/centralFile/sync/SyncFormField";
import {
  DiffArrow,
  SyncFormBlock,
  SyncFormSection,
} from "@/lib/shared/components/centralFile/sync/SyncFormGrid";

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
        label={BASE_ADDRESS_FIELD_NAME.differentName}
        value={address?.differentName}
        visible={changedFields.includes("differentName")}
      />
      <SyncFormField
        label={BASE_ADDRESS_FIELD_NAME.postbox}
        value={isPostboxAddress(address) ? address?.postbox : undefined}
        visible={changedFields.includes("postbox")}
      />
      <SyncFormField
        altLabel="Straße und Hausnummer"
        label={BASE_ADDRESS_FIELD_NAME.streetAndHouseNumber}
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
            label={BASE_ADDRESS_FIELD_NAME.postalCode}
            value={address?.postalCode}
            visible={changedFields.includes("postalCode")}
          />
          <SyncFormField
            label={BASE_ADDRESS_FIELD_NAME.city}
            value={address?.city}
            visible={changedFields.includes("city")}
          />
        </Stack>
      )}
      <SyncFormField
        label={BASE_ADDRESS_FIELD_NAME.addressAddition}
        value={
          isDomesticAddress(address) ? address?.addressAddition : undefined
        }
        visible={changedFields.includes("addressAddition")}
      />
      <SyncFormField
        label={BASE_ADDRESS_FIELD_NAME.country}
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
