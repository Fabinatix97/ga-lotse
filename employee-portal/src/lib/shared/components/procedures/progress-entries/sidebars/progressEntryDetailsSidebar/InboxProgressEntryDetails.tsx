/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { formatUserName } from "@eshg/lib-portal/formatters/person";
import {
  ApiProcessedInboxProgressEntry,
  ApiUser,
} from "@eshg/lib-procedures-api";
import { isDefined } from "remeda";

import { inboxProgressEntryTitles } from "@/lib/shared/components/procedures/progress-entries/constants";
import { DetailsContentWrapper } from "@/lib/shared/components/procedures/progress-entries/sidebars/progressEntryDetailsSidebar/DetailsContentWrapper";
import { LabelValueDisplay } from "@/lib/shared/components/procedures/progress-entries/sidebars/progressEntryDetailsSidebar/LabelValueDisplay";

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
