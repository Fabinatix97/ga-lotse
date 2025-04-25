/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Stack } from "@mui/joy";
import { isDefined } from "remeda";

import {
  ApiFacilityContactPerson,
  ApiFacilityContactPersonDiff,
  ApiFacilityDetails,
  ApiGetFacilityDiffResponse,
} from "@eshg/base-api";
import {
  PERSON_FIELD_NAME,
  SALUTATION_VALUES,
  getOptionalTitle,
} from "@eshg/lib-portal/components/formFields/constants";

import {
  AddressUnion,
  TypedDifferingFields,
  baseAddressDiffFieldNames,
} from "@/features/persons/components/personSync/DifferingFields";
import { SyncFormField } from "@/features/persons/components/personSync/SyncFormField";
import {
  DiffArrow,
  SyncFormBlock,
  SyncFormSection,
} from "@/features/persons/components/personSync/SyncFormGrid";

import { SyncBaseAddressSection } from "./SyncBaseAddressSection";
import { SyncListSection } from "./SyncListSection";

export function BaseFacilityDiffForm({
  diff,
}: Readonly<{
  diff: ApiGetFacilityDiffResponse;
}>) {
  const {
    billingAddressDiff,
    contactAddressDiff,
    contactPersonsDiff,
    facilityDetailsDiff,
  } = diff;

  const changedBillingAddressFields = new TypedDifferingFields<AddressUnion>(
    billingAddressDiff.differingFields,
  );

  const changedContactAddressFields = new TypedDifferingFields<AddressUnion>(
    contactAddressDiff.differingFields,
  );

  const changedContactPersons = mergeContactPersons();

  const changedFacilityDetailsFields =
    new TypedDifferingFields<ApiFacilityDetails>(
      facilityDetailsDiff.differingFields,
    );

  function mergeContactPersons() {
    const result: ApiFacilityContactPersonDiff[] = [];
    for (let i = 0; i < contactPersonsDiff.length / 2; i++) {
      const oldContactPerson = contactPersonsDiff.at(i)!;
      const newContactPerson = contactPersonsDiff.at(
        contactPersonsDiff.length / 2 + i,
      )!;
      let differentFields =
        oldContactPerson.facilityContactPersonDtoDiffDto.differingFields;
      const fileState =
        oldContactPerson.facilityContactPersonDtoDiffDto.fileState;
      const reference =
        newContactPerson.facilityContactPersonDtoDiffDto.reference;
      Object.entries(fileState ?? []).forEach((fileState) => {
        const key =
          fileState[0] as keyof typeof newContactPerson.facilityContactPersonDtoDiffDto.reference;
        if (isDefined(reference) && fileState[1] === reference[key]) {
          differentFields = removeField(key, differentFields);
        }
      });
      const currentContactPersonDiff: ApiFacilityContactPersonDiff = {
        facilityContactPersonDtoDiffDto: {
          differingFields: differentFields,
          fileState: fileState,
          reference: reference,
        },
      };
      result.push(currentContactPersonDiff);
    }
    return result;
  }

  function removeField(name: string, array: string[]) {
    return array.filter((e) => e !== name);
  }

  return (
    <>
      {changedFacilityDetailsFields.includes("name") && (
        <SyncFormSection>
          <SyncFormBlock>
            <SyncFormField
              label={"Name"}
              value={facilityDetailsDiff.fileState?.name}
              visible={changedFacilityDetailsFields.includes("name")}
            />
          </SyncFormBlock>
          <DiffArrow />
          <SyncFormBlock>
            <SyncFormField
              label={"Name"}
              value={facilityDetailsDiff.reference?.name}
              visible={changedFacilityDetailsFields.includes("name")}
            />
          </SyncFormBlock>
        </SyncFormSection>
      )}

      {changedContactAddressFields.includesAny(
        ...baseAddressDiffFieldNames,
      ) && <SyncBaseAddressSection address={contactAddressDiff} />}

      {changedBillingAddressFields.includesAny(
        ...baseAddressDiffFieldNames,
      ) && <SyncBaseAddressSection address={billingAddressDiff} />}

      {facilityDetailsDiff.differingFields.includes("emailAddress") && (
        <SyncListSection
          before={facilityDetailsDiff.fileState?.emailAddresses}
          after={facilityDetailsDiff.reference?.emailAddresses}
          label="E-Mail-Adresse"
        />
      )}

      {changedFacilityDetailsFields.includes("phoneNumbers") && (
        <SyncListSection
          before={facilityDetailsDiff.fileState?.phoneNumbers}
          after={facilityDetailsDiff.reference?.phoneNumbers}
          label="Telefonnummer"
        />
      )}

      {changedContactPersons.map((p) => (
        <SyncFormSection
          key={p.facilityContactPersonDtoDiffDto.fileState?.lastName}
        >
          <ContactPersonDetailsBlock
            contactPerson={p.facilityContactPersonDtoDiffDto.fileState}
            changedFields={p.facilityContactPersonDtoDiffDto.differingFields}
          ></ContactPersonDetailsBlock>
          <DiffArrow />
          <ContactPersonDetailsBlock
            contactPerson={p.facilityContactPersonDtoDiffDto.reference}
            changedFields={p.facilityContactPersonDtoDiffDto.differingFields}
          ></ContactPersonDetailsBlock>
        </SyncFormSection>
      ))}
    </>
  );
}

function ContactPersonDetailsBlock({
  contactPerson,
  changedFields,
}: Readonly<{
  contactPerson: Omit<ApiFacilityContactPerson, "gender"> | undefined;
  changedFields: string[];
}>) {
  return (
    <SyncFormBlock>
      {(changedFields.includes("salutation") ||
        changedFields.includes("title")) && (
        <Stack direction="row" gap={3}>
          <SyncFormField
            label={PERSON_FIELD_NAME.salutation}
            value={
              isDefined(contactPerson?.salutation)
                ? SALUTATION_VALUES[contactPerson?.salutation]
                : undefined
            }
            visible={changedFields.includes("salutation")}
          />
          <SyncFormField
            label={PERSON_FIELD_NAME.title}
            value={getOptionalTitle(contactPerson?.title)}
            visible={changedFields.includes("title")}
          />
        </Stack>
      )}
      {changedFields.includes("role") && (
        <SyncFormField
          label={"Rolle"}
          value={contactPerson?.role}
          visible={changedFields.includes("role")}
        />
      )}
      {changedFields.includes("firstName") && (
        <SyncFormField
          label={PERSON_FIELD_NAME.firstName}
          value={contactPerson?.firstName}
          visible={changedFields.includes("firstName")}
        />
      )}
      {changedFields.includes("lastName") && (
        <SyncFormField
          label={PERSON_FIELD_NAME.lastName}
          value={contactPerson?.lastName}
          visible={changedFields.includes("lastName")}
        />
      )}
      {changedFields.includes("emailAddress") && (
        <SyncFormField
          label={PERSON_FIELD_NAME.emailAddresses}
          value={contactPerson?.emailAddress}
          visible={changedFields.includes("emailAddress")}
        />
      )}
      {changedFields.includes("phoneNumber") && (
        <SyncFormField
          label={PERSON_FIELD_NAME.phoneNumbers}
          value={contactPerson?.phoneNumber}
          visible={changedFields.includes("phoneNumber")}
        />
      )}
    </SyncFormBlock>
  );
}
