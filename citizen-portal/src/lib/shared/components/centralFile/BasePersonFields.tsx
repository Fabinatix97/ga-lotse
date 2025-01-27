/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiGetReferencePersonResponse } from "@eshg/base-api";
import { ExternalLink } from "@eshg/lib-portal/components/navigation/ExternalLink";
import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import DateOfBirthIcon from "@mui/icons-material/CakeOutlined";
import NameAtBirthIcon from "@mui/icons-material/ChildCareOutlined";
import SalutationIcon from "@mui/icons-material/HowToRegOutlined";
import MailIcon from "@mui/icons-material/MailOutlined";
import GenderIcon from "@mui/icons-material/PeopleOutlined";
import LastNameIcon from "@mui/icons-material/PersonOutlined";
import BirthPlaceIcon from "@mui/icons-material/PersonPinCircleOutlined";
import FirstNameIcon from "@mui/icons-material/PersonPinOutlined";
import PhoneIcon from "@mui/icons-material/PhoneOutlined";
import TitleIcon from "@mui/icons-material/PortraitOutlined";
import CountryOfBirthIcon from "@mui/icons-material/TravelExploreOutlined";
import { isDefined } from "remeda";

import { useTranslation } from "@/lib/i18n/client";
import { useTranslateCountry } from "@/lib/i18n/useTranslateCountry";
import { InfoSectionField } from "@/lib/shared/components/infoSection";

export function BasePersonFields({
  person,
}: {
  person: ApiGetReferencePersonResponse;
}) {
  const { t } = useTranslation("translation");
  const { translateCountry } = useTranslateCountry();

  return (
    <>
      <InfoSectionField label={t("person.title")} icon={<TitleIcon />}>
        {person.title}
      </InfoSectionField>
      <InfoSectionField
        label={t("person.salutation")}
        icon={<SalutationIcon />}
      >
        {isDefined(person.salutation)
          ? t(`salutation.${person.salutation.toLowerCase()}`)
          : undefined}
      </InfoSectionField>
      <InfoSectionField label={t("person.first_name")} icon={<FirstNameIcon />}>
        {person.firstName}
      </InfoSectionField>
      <InfoSectionField label={t("person.last_name")} icon={<LastNameIcon />}>
        {person.firstName}
      </InfoSectionField>
      <InfoSectionField
        label={t("person.date_of_birth")}
        icon={<DateOfBirthIcon />}
      >
        {formatDate(person.dateOfBirth)}
      </InfoSectionField>
      <InfoSectionField label={t("person.gender")} icon={<GenderIcon />}>
        {isDefined(person.gender)
          ? t(`gender.${person.gender.toLowerCase()}`)
          : undefined}
      </InfoSectionField>
      <InfoSectionField
        label={t("person.place_of_birth")}
        icon={<BirthPlaceIcon />}
      >
        {person.placeOfBirth}
      </InfoSectionField>
      <InfoSectionField
        label={t("person.name_at_birth")}
        icon={<NameAtBirthIcon />}
      >
        {person.nameAtBirth}
      </InfoSectionField>
      <InfoSectionField
        label={t("person.country_of_birth")}
        icon={<CountryOfBirthIcon />}
      >
        {isDefined(person.countryOfBirth)
          ? translateCountry(person.countryOfBirth)
          : undefined}
      </InfoSectionField>
      {person.phoneNumbers.map((phoneNumber, index) => (
        <InfoSectionField
          key={`${phoneNumber}.${index}`}
          label={
            person.phoneNumbers.length > 1
              ? `${index + 1}. ${t("common.phone")}`
              : t("common.phone")
          }
          icon={<PhoneIcon />}
        >
          {phoneNumber}
        </InfoSectionField>
      )) || (
        <InfoSectionField label={t("common.phone")} icon={<PhoneIcon />}>
          {undefined}
        </InfoSectionField>
      )}
      {person.emailAddresses.map((emailAddress, index) => (
        <InfoSectionField
          key={`${emailAddress}.${index}`}
          label={
            person.emailAddresses.length > 1
              ? `${index + 1}. ${t("common.email")}`
              : t("common.email")
          }
          icon={<MailIcon />}
        >
          <ExternalLink href={`mailto:${emailAddress}`}>
            {emailAddress}
          </ExternalLink>
        </InfoSectionField>
      )) || (
        <InfoSectionField label={t("common.email")} icon={<MailIcon />}>
          {undefined}
        </InfoSectionField>
      )}
    </>
  );
}
