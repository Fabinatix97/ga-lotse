/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ApiContactHistoryEntry,
  ApiGetContactHistoryResponse,
  ApiInstitutionContactChange,
  ApiPersonContactChange,
  ApiUser,
} from "@eshg/employee-portal-api/base";
import { formatDateTime } from "@eshg/lib-portal/formatters/dateTime";
import { useRouter } from "next/navigation";
import { isDefined } from "remeda";

import { HistoryEntryIndicator } from "@/lib/baseModule/components/contacts/history/HistoryEntryIndicator";
import { routes } from "@/lib/baseModule/shared/routes";
import { Timeline } from "@/lib/shared/components/timeline/Timeline";
import {
  TimelineEntry,
  TimelineEntryProps,
} from "@/lib/shared/components/timeline/TimelineEntry";
import { fullName } from "@/lib/shared/components/users/userFormatter";

export function ContactHistory({
  history,
}: {
  history: ApiGetContactHistoryResponse;
}) {
  const router = useRouter();

  function showModal(contactId: string, historyId: number, addressId?: number) {
    router.push(routes.contacts.history(contactId, historyId, addressId));
  }

  return (
    <Timeline>
      {history.entries.toReversed().flatMap((entry) =>
        mapEntryToTimelineEntries(
          entry,
          history.resolvedUsers[entry.modifiedBy],
        ).map(({ key, title, label }) => (
          <TimelineEntry
            key={`${entry.historyId}-${entry.contactId}-${entry.addressReference?.addressId}-${key}`}
            title={title}
            label={label}
            indicator={
              <HistoryEntryIndicator entryType={entry.type} variant={"soft"} />
            }
            buttonProps={{
              onClick: () =>
                showModal(
                  entry.contactId,
                  entry.historyId,
                  entry.addressReference?.addressId,
                ),
              sx: { textAlign: "left" },
            }}
          />
        )),
      )}
    </Timeline>
  );
}

function buildLabel(entry: ApiContactHistoryEntry, user?: ApiUser) {
  return `${formatDateTime(entry.modifiedAt)} ${fullName(user)} `;
}

function mapEntryToTimelineEntries(
  entry: ApiContactHistoryEntry,
  user: ApiUser | undefined,
): TimelineEntryProps[] {
  const isContactAddress = entry.addressReference?.usage === "CONTACT_ADDRESS";
  const isBillingAddress =
    entry.addressReference?.usage === "DIFFERENT_BILLING_ADDRESS";

  let changes: string[] = [];

  switch (entry.type) {
    case "ADD":
      if (isContactAddress) changes = ["Kontaktadresse hinzugefügt"];
      else if (isBillingAddress) changes = ["Rechnungsadresse hinzugefügt"];
      else changes = ["Kontakt wurde erstellt"];
      break;
    case "DEL":
      if (isContactAddress) changes = ["Kontaktadresse gelöscht"];
      else if (isBillingAddress) changes = ["Rechnungsadresse gelöscht"];
      else changes = ["Kontakt gelöscht"];
      break;
    case "MOD":
      if (isContactAddress) changes = ["Kontaktadresse geändert"];
      else if (isBillingAddress) changes = ["Rechnungsadresse geändert"];
      else if (
        entry.changes.type === "PersonContactChange" ||
        entry.changes.type === "InstitutionContactChange"
      ) {
        const changedFields = mapModEntryChanges(entry.changes);
        if (changedFields.length < 2) {
          changes = changedFields.map((field) => `${field} geändert`);
        } else {
          changes = ["Kontaktdetails geändert"];
        }
        if (entry.changes.mergedFrom.isChanged) {
          changes.push("Kontakt zusammengeführt");
        }
      }
      break;
  }

  return changes.map((change, index) => ({
    title: change,
    label: buildLabel(entry, user),
    key: index,
  }));
}

type ChangesUnion =
  | ({ type: "PersonContactChange" } & ApiPersonContactChange)
  | ({ type: "InstitutionContactChange" } & ApiInstitutionContactChange);

const translatePersonFieldName = {
  name: "Name",
  firstName: "Vorname",
  gender: "Geschlecht",
  externalChatUsername: "Chat Benutzername",
  salutation: "Anrede",
  title: "Titel",
  emailAddresses: "E-Mail-Adressen",
  phoneNumbers: "Telefonnummern",
  mergedFrom: "",
  mergedInto: "",
} as const satisfies Record<keyof Omit<ApiPersonContactChange, "type">, string>;

const personFields = Object.keys(translatePersonFieldName) as (keyof Omit<
  ApiPersonContactChange,
  "type"
>)[];

const translateInstitutionFieldName = {
  name: "Name",
  category: "Objekttyp",
  emailAddresses: "E-Mail-Adressen",
  phoneNumbers: "Telefonnummern",
  mergedFrom: "",
  mergedInto: "",
} as const satisfies Record<
  keyof Omit<ApiInstitutionContactChange, "type">,
  string
>;

const institutionFields = Object.keys(translatePersonFieldName) as (keyof Omit<
  ApiInstitutionContactChange,
  "type"
>)[];

function mapModEntryChanges(changes: ChangesUnion) {
  if (changes.type === "PersonContactChange") {
    return personFields
      .filter((key) => isChange(changes[key]))
      .map((key) => translatePersonFieldName[key])
      .filter((key) => key.length > 0);
  } else {
    return institutionFields
      .filter((key) => isChange(changes[key]))
      .map((key) => translateInstitutionFieldName[key])
      .filter((key) => key.length > 0);
  }
}

function isChange(obj: object | undefined) {
  return isDefined(obj) && "isChanged" in obj && obj.isChanged === true;
}
