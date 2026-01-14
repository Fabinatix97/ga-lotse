/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Box, Stack } from "@mui/joy";
import { visuallyHidden } from "@mui/utils";
import { isDefined } from "remeda";

import {
  ApiDiffAddress,
  ApiGetPersonDiffResponse,
  ApiPersonDetails,
} from "@eshg/base-api";
import {
  GENDER_VALUES,
  PERSON_FIELD_NAME,
  SALUTATION_VALUES,
  formatDate,
  formatList,
  getOptionalTitle,
  translateCountry,
} from "@eshg/lib-portal";

import {
  BaseAddress,
  isDomesticAddress,
  isPostboxAddress,
} from "../../../../../api/models/address";
import {
  AddressUnion,
  TypedDifferingFields,
  baseAddressDiffFieldNames,
  basePersonDiffFieldNames,
} from "../DifferingFields";
import { SyncFormField } from "../SyncFormField";
import { DiffArrow, SyncFormBlock, SyncFormSection } from "../SyncFormGrid";

import {
  ADDRESS_FIELD_NAME,
  SyncBaseAddressSection,
} from "./SyncBaseAddressSection";
import { SyncListSection } from "./SyncListSection";

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
      <Box aria-hidden="true" display="contents">
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
      </Box>
      <AriaPersonDetails diff={diff} />
    </>
  );
}

function AriaPersonDetails(props: { diff: ApiGetPersonDiffResponse }) {
  const { personDetailsDiff, contactAddressDiff, billingAddressDiff } =
    props.diff;

  function Item(props: {
    hasDiff: boolean;
    rowHeader: string;
    before: string | undefined;
    after: string | undefined;
  }) {
    if (!props.hasDiff) {
      return;
    }
    return (
      <tr>
        <td role="rowheader">{props.rowHeader}</td>
        <td>{props.before}</td>
        <td>{props.after}</td>
      </tr>
    );
  }

  function AddressItems(props: { diff: ApiDiffAddress; labelPrefix: string }) {
    const before = props.diff.fileState as BaseAddress | undefined;
    const after = props.diff.reference as BaseAddress | undefined;
    const differingFields = props.diff.differingFields;

    return (
      <>
        <Item
          hasDiff={differingFields.includes("differentName")}
          rowHeader={`${props.labelPrefix} - ${ADDRESS_FIELD_NAME.differentName}`}
          before={before?.differentName}
          after={after?.differentName}
        />
        <Item
          hasDiff={differingFields.includes("postbox")}
          rowHeader={`${props.labelPrefix} - ${ADDRESS_FIELD_NAME.postbox}`}
          before={isPostboxAddress(before) ? before?.postbox : undefined}
          after={isPostboxAddress(after) ? after?.postbox : undefined}
        />
        <Item
          hasDiff={
            differingFields.includes("street") ||
            differingFields.includes("houseNumber")
          }
          rowHeader={`${props.labelPrefix} - ${ADDRESS_FIELD_NAME.streetAndHouseNumber}`}
          before={
            isDomesticAddress(before)
              ? formatList([before?.street, before?.houseNumber], " ")
              : undefined
          }
          after={
            isDomesticAddress(after)
              ? formatList([after?.street, after?.houseNumber], " ")
              : undefined
          }
        />
        <Item
          hasDiff={differingFields.includes("postalCode")}
          rowHeader={`${props.labelPrefix} - ${ADDRESS_FIELD_NAME.postalCode}`}
          before={before?.postalCode}
          after={after?.postalCode}
        />
        <Item
          hasDiff={differingFields.includes("city")}
          rowHeader={`${props.labelPrefix} - ${ADDRESS_FIELD_NAME.city}`}
          before={before?.city}
          after={after?.city}
        />
        <Item
          hasDiff={differingFields.includes("addressAddition")}
          rowHeader={`${props.labelPrefix} - ${ADDRESS_FIELD_NAME.addressAddition}`}
          before={
            isDomesticAddress(before) ? before.addressAddition : undefined
          }
          after={isDomesticAddress(after) ? after.addressAddition : undefined}
        />
        <Item
          hasDiff={differingFields.includes("country")}
          rowHeader={`${props.labelPrefix} - ${ADDRESS_FIELD_NAME.country}`}
          before={
            isDefined(before?.country)
              ? translateCountry(before?.country)
              : undefined
          }
          after={
            isDefined(after?.country)
              ? translateCountry(after?.country)
              : undefined
          }
        />
      </>
    );
  }

  return (
    <Box component="table" sx={visuallyHidden}>
      <thead>
        <tr>
          <th>Vorher</th>
          <th>Nachher</th>
        </tr>
      </thead>
      <tbody>
        <Item
          hasDiff={personDetailsDiff.differingFields.includes("salutation")}
          rowHeader={PERSON_FIELD_NAME.salutation}
          before={personDetailsDiff.fileState?.salutation}
          after={personDetailsDiff.reference?.salutation}
        />
        <Item
          hasDiff={personDetailsDiff.differingFields.includes("title")}
          rowHeader={PERSON_FIELD_NAME.title}
          before={getOptionalTitle(personDetailsDiff.fileState?.title)}
          after={getOptionalTitle(personDetailsDiff.reference?.title)}
        />
        <Item
          hasDiff={personDetailsDiff.differingFields.includes("firstName")}
          rowHeader={PERSON_FIELD_NAME.firstName}
          before={personDetailsDiff.fileState?.firstName}
          after={personDetailsDiff.reference?.firstName}
        />
        <Item
          hasDiff={personDetailsDiff.differingFields.includes("lastName")}
          rowHeader={PERSON_FIELD_NAME.lastName}
          before={personDetailsDiff.fileState?.lastName}
          after={personDetailsDiff.reference?.lastName}
        />
        <Item
          hasDiff={personDetailsDiff.differingFields.includes("dataOfBirth")}
          rowHeader={PERSON_FIELD_NAME.dateOfBirth}
          before={formatDate(personDetailsDiff.fileState?.dateOfBirth, "de")}
          after={formatDate(personDetailsDiff.reference?.dateOfBirth, "de")}
        />
        <Item
          hasDiff={personDetailsDiff.differingFields.includes("gender")}
          rowHeader={PERSON_FIELD_NAME.gender}
          before={
            isDefined(personDetailsDiff.fileState?.gender)
              ? GENDER_VALUES[personDetailsDiff.fileState?.gender]
              : undefined
          }
          after={
            isDefined(personDetailsDiff.reference?.gender)
              ? GENDER_VALUES[personDetailsDiff.reference?.gender]
              : undefined
          }
        />
        <Item
          hasDiff={personDetailsDiff.differingFields.includes("nameAtBirth")}
          rowHeader={PERSON_FIELD_NAME.nameAtBirth}
          before={personDetailsDiff.fileState?.nameAtBirth}
          after={personDetailsDiff.reference?.nameAtBirth}
        />
        <Item
          hasDiff={personDetailsDiff.differingFields.includes("placeOfBirth")}
          rowHeader={PERSON_FIELD_NAME.placeOfBirth}
          before={personDetailsDiff.fileState?.placeOfBirth}
          after={personDetailsDiff.reference?.placeOfBirth}
        />
        <Item
          hasDiff={personDetailsDiff.differingFields.includes("countryOfBirth")}
          rowHeader={PERSON_FIELD_NAME.countryOfBirth}
          before={
            isDefined(personDetailsDiff.fileState?.countryOfBirth)
              ? translateCountry(personDetailsDiff.fileState?.countryOfBirth)
              : undefined
          }
          after={
            isDefined(personDetailsDiff.reference?.countryOfBirth)
              ? translateCountry(personDetailsDiff.reference?.countryOfBirth)
              : undefined
          }
        />
        <AddressItems diff={contactAddressDiff} labelPrefix="Kontaktadresse" />
        <AddressItems
          diff={billingAddressDiff}
          labelPrefix="Rechnungsadresse"
        />
        <Item
          hasDiff={personDetailsDiff.differingFields.includes("emailAddresses")}
          rowHeader={PERSON_FIELD_NAME.emailAddresses}
          before={personDetailsDiff.fileState?.emailAddresses?.join(", ")}
          after={personDetailsDiff.reference?.emailAddresses?.join(", ")}
        />
        <Item
          hasDiff={personDetailsDiff.differingFields.includes("phoneNumbers")}
          rowHeader={PERSON_FIELD_NAME.phoneNumbers}
          before={personDetailsDiff.fileState?.phoneNumbers?.join(", ")}
          after={personDetailsDiff.reference?.phoneNumbers?.join(", ")}
        />
        <Item
          hasDiff={personDetailsDiff.differingFields.includes("placeOfBirth")}
          rowHeader={PERSON_FIELD_NAME.placeOfBirth}
          before={personDetailsDiff.fileState?.contactAddress?.city}
          after={personDetailsDiff.reference?.placeOfBirth}
        />
      </tbody>
    </Box>
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
