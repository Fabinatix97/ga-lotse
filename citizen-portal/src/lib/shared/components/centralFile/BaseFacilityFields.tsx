/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ApiFacilityContactPerson,
  ApiGetReferenceFacilityResponse,
} from "@eshg/citizen-portal-api/base";
import { ExternalLink } from "@eshg/lib-portal/components/navigation/ExternalLink";
import SalutationIcon from "@mui/icons-material/HowToRegOutlined";
import MailIcon from "@mui/icons-material/MailOutlined";
import LastNameIcon from "@mui/icons-material/PersonOutlined";
import FirstNameIcon from "@mui/icons-material/PersonPinOutlined";
import PhoneIcon from "@mui/icons-material/PhoneOutlined";
import TitleIcon from "@mui/icons-material/PortraitOutlined";
import RoleIcon from "@mui/icons-material/WorkOutlineOutlined";
import { isDefined } from "remeda";

import { useTranslation } from "@/lib/i18n/client";
import { AddressFields } from "@/lib/shared/components/centralFile/AddressFields";
import { InfoSectionField } from "@/lib/shared/components/infoSection";

export function BaseFacilityFields({
  facility,
}: {
  facility: ApiGetReferenceFacilityResponse;
}) {
  const { t } = useTranslation("translation");
  const address = facility.contactAddress;

  return (
    <>
      {isDefined(address) && <AddressFields address={address} />}
      {facility.phoneNumbers.map((phoneNumber, index) => (
        <InfoSectionField
          key={`${phoneNumber}.${index}`}
          label={
            facility.phoneNumbers.length > 1
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
      {facility.emailAddresses.map((emailAddress, index) => (
        <InfoSectionField
          key={`${emailAddress}.${index}`}
          label={
            facility.emailAddresses.length > 1
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

export function ContactPersonFields({
  contactPerson,
}: {
  contactPerson: ApiFacilityContactPerson;
}) {
  const { t } = useTranslation("translation");
  return (
    <>
      <InfoSectionField
        label={t("facility.contact_person.salutation")}
        icon={<SalutationIcon />}
      >
        {isDefined(contactPerson.salutation)
          ? t("salutation." + contactPerson.salutation.toLowerCase())
          : undefined}
      </InfoSectionField>
      <InfoSectionField
        label={t("facility.contact_person.title")}
        icon={<TitleIcon />}
      >
        {contactPerson.title}
      </InfoSectionField>
      <InfoSectionField
        label={t("facility.contact_person.first_name")}
        icon={<FirstNameIcon />}
      >
        {contactPerson.firstName}
      </InfoSectionField>
      <InfoSectionField
        label={t("facility.contact_person.last_name")}
        icon={<LastNameIcon />}
      >
        {contactPerson.lastName}
      </InfoSectionField>
      <InfoSectionField
        label={t("facility.contact_person.role")}
        icon={<RoleIcon />}
      >
        {contactPerson.role}
      </InfoSectionField>
      <InfoSectionField label={t("common.phone")} icon={<PhoneIcon />}>
        {contactPerson.phoneNumber}
      </InfoSectionField>
      <InfoSectionField label={t("common.email")} icon={<MailIcon />}>
        {isDefined(contactPerson.emailAddress) ? (
          <ExternalLink href={`mailto:${contactPerson.emailAddress}`}>
            {contactPerson.emailAddress}
          </ExternalLink>
        ) : undefined}
      </InfoSectionField>
    </>
  );
}
