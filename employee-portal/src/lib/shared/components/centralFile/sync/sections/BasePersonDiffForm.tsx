/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiGetPersonDiffResponse, ApiPersonDetails } from "@eshg/base-api";
import {
  GENDER_VALUES,
  PERSON_FIELD_NAME,
  SALUTATION_VALUES,
  getOptionalTitle,
} from "@eshg/lib-portal/components/formFields/constants";
import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { translateCountry } from "@eshg/lib-portal/helpers/countryOption";
import { Stack } from "@mui/joy";
import { isDefined } from "remeda";

import {
  AddressUnion,
  TypedDifferingFields,
  baseAddressDiffFieldNames,
  basePersonDiffFieldNames,
} from "@/lib/shared/components/centralFile/sync/DifferingFields";
import { SyncFormField } from "@/lib/shared/components/centralFile/sync/SyncFormField";
import {
  DiffArrow,
  SyncFormBlock,
  SyncFormSection,
} from "@/lib/shared/components/centralFile/sync/SyncFormGrid";
import { SyncBaseAddressSection } from "@/lib/shared/components/centralFile/sync/sections/SyncBaseAddressSection";
import { SyncListSection } from "@/lib/shared/components/centralFile/sync/sections/SyncListSection";

export function BasePersonDiffForm({
  diff,
}: {
  diff: ApiGetPersonDiffResponse;
}) {
  const { personDetailsDiff, contactAddressDiff, billingAddressDiff } = diff;

  const changedBaseFields = new TypedDifferingFields<ApiPersonDetails>(
    personDetailsDiff.differingFields,
  );
  const changedContactAddressFields = new TypedDifferingFields<AddressUnion>(
    contactAddressDiff.differingFields,
  );
  const changedBillingAddressFields = new TypedDifferingFields<AddressUnion>(
    billingAddressDiff.differingFields,
  );

  return (
    <>
      {changedBaseFields.includesAny(...basePersonDiffFieldNames) && (
        <SyncFormSection>
          <BaseDetailsBlock
            changedFields={changedBaseFields}
            person={personDetailsDiff.fileState}
          />
          <DiffArrow />
          <BaseDetailsBlock
            changedFields={changedBaseFields}
            person={personDetailsDiff.reference}
          />
        </SyncFormSection>
      )}

      {changedContactAddressFields.includesAny(
        ...baseAddressDiffFieldNames,
      ) && <SyncBaseAddressSection address={contactAddressDiff} />}

      {changedBillingAddressFields.includesAny(
        ...baseAddressDiffFieldNames,
      ) && <SyncBaseAddressSection address={billingAddressDiff} />}

      {changedBaseFields.includes("emailAddresses") && (
        <SyncListSection
          before={personDetailsDiff.fileState?.emailAddresses}
          after={personDetailsDiff.reference?.emailAddresses}
          label="E-Mail-Adresse"
        />
      )}

      {changedBaseFields.includes("phoneNumbers") && (
        <SyncListSection
          before={personDetailsDiff.fileState?.phoneNumbers}
          after={personDetailsDiff.reference?.phoneNumbers}
          label="Telefonnummer"
        />
      )}
    </>
  );
}

function BaseDetailsBlock({
  person,
  changedFields,
}: {
  person: ApiPersonDetails | undefined;
  changedFields: TypedDifferingFields<ApiPersonDetails>;
}) {
  return (
    <SyncFormBlock>
      {changedFields.includesAny("salutation", "title") && (
        <Stack direction="row" gap={3}>
          <SyncFormField
            label={PERSON_FIELD_NAME.salutation}
            value={
              isDefined(person?.salutation)
                ? SALUTATION_VALUES[person?.salutation]
                : undefined
            }
            visible={changedFields.includes("salutation")}
          />
          <SyncFormField
            label={PERSON_FIELD_NAME.title}
            value={getOptionalTitle(person?.title)}
            visible={changedFields.includes("title")}
          />
        </Stack>
      )}

      <SyncFormField
        label={PERSON_FIELD_NAME.firstName}
        value={person?.firstName}
        visible={changedFields.includes("firstName")}
      />
      <SyncFormField
        label={PERSON_FIELD_NAME.lastName}
        value={person?.lastName}
        visible={changedFields.includes("lastName")}
      />

      {changedFields.includesAny("dateOfBirth", "gender") && (
        <Stack direction="row" gap={3}>
          <SyncFormField
            label={PERSON_FIELD_NAME.dateOfBirth}
            value={formatDate(person?.dateOfBirth, "de")}
            visible={changedFields.includes("dateOfBirth")}
          />
          <SyncFormField
            label={PERSON_FIELD_NAME.gender}
            value={
              isDefined(person?.gender)
                ? GENDER_VALUES[person?.gender]
                : undefined
            }
            visible={changedFields.includes("gender")}
          />
        </Stack>
      )}

      <SyncFormField
        label={PERSON_FIELD_NAME.nameAtBirth}
        value={person?.nameAtBirth}
        visible={changedFields.includes("nameAtBirth")}
      />
      <SyncFormField
        label={PERSON_FIELD_NAME.placeOfBirth}
        value={person?.placeOfBirth}
        visible={changedFields.includes("placeOfBirth")}
      />
      <SyncFormField
        label={PERSON_FIELD_NAME.countryOfBirth}
        value={
          isDefined(person?.countryOfBirth)
            ? translateCountry(person?.countryOfBirth)
            : undefined
        }
        visible={changedFields.includes("countryOfBirth")}
      />
    </SyncFormBlock>
  );
}
