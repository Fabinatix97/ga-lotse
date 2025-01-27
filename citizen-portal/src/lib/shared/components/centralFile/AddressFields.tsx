/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiGetReferenceFacilityResponse } from "@eshg/base-api";
import StreetIcon from "@mui/icons-material/BusinessOutlined";
import AddressAdditionIcon from "@mui/icons-material/InfoOutlined";
import PostalCodeIcon from "@mui/icons-material/MapOutlined";
import PostboxIcon from "@mui/icons-material/MarkunreadMailboxOutlined";
import CityIcon from "@mui/icons-material/PlaceOutlined";
import CountryIcon from "@mui/icons-material/PublicOutlined";
import { isDefined, join } from "remeda";

import { useTranslation } from "@/lib/i18n/client";
import { useTranslateCountry } from "@/lib/i18n/useTranslateCountry";
import { InfoSectionField } from "@/lib/shared/components/infoSection";

export function AddressFields({
  address,
}: {
  address: NonNullable<ApiGetReferenceFacilityResponse["contactAddress"]>;
}) {
  const { t } = useTranslation("translation");
  const { translateCountry } = useTranslateCountry();

  return (
    <>
      {address.type === "DomesticAddress" && (
        <>
          <InfoSectionField
            icon={<StreetIcon />}
            label={t("address.street_and_housenumber")}
          >
            {isDefined(address.street)
              ? join([address.street, address.houseNumber], " ")
              : undefined}
          </InfoSectionField>
          <InfoSectionField
            icon={<AddressAdditionIcon />}
            label={t("address.address_addition")}
          >
            {address.addressAddition}
          </InfoSectionField>
        </>
      )}
      {address.type === "PostboxAddress" && (
        <InfoSectionField label={t("address.postbox")} icon={<PostboxIcon />}>
          {address.postbox}
        </InfoSectionField>
      )}
      <InfoSectionField
        label={t("address.postal_code")}
        icon={<PostalCodeIcon />}
      >
        {address.postalCode}
      </InfoSectionField>
      <InfoSectionField label={t("address.city")} icon={<CityIcon />}>
        {address.city}
      </InfoSectionField>
      <InfoSectionField label={t("address.country")} icon={<CountryIcon />}>
        {translateCountry(address.country)}
      </InfoSectionField>
    </>
  );
}
