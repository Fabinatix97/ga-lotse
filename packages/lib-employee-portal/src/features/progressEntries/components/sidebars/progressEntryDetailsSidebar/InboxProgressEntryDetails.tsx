/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { isDefined } from "remeda";

import { formatUserName } from "@eshg/lib-portal";
import {
  ApiProcessedInboxProgressEntry,
  ApiUser,
} from "@eshg/lib-procedures-api";

import { inboxProgressEntryTitles } from "../../../config/progressEntryTypes";

import { DetailsContentWrapper } from "./DetailsContentWrapper";
import { LabelValueDisplay } from "./LabelValueDisplay";

export function InboxProgressEntryDetails({
  entry,
  resolvedUsers,
}: {
  entry: ApiProcessedInboxProgressEntry;
  resolvedUsers: Record<string, ApiUser>;
}) {
  return (
    <DetailsContentWrapper
      entry={entry}
      title={`Details ${inboxProgressEntryTitles[entry.inboxProgressEntryType]}`}
      creatorName={formatUserName(resolvedUsers[entry.createdBy])}
    >
      <LabelValueDisplay
        key="subject"
        label="Betreff"
        value={isDefined(entry.subject) ? entry.subject : ""}
      />
      <LabelValueDisplay
        key="message"
        label="Nachricht"
        value={isDefined(entry.messageText) ? entry.messageText : ""}
      />
    </DetailsContentWrapper>
  );
}
