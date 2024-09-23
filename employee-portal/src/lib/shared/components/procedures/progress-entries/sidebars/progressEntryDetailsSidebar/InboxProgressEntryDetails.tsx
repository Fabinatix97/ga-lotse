/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiProcessedInboxProgressEntry } from "@eshg/employee-portal-api/businessProcedures";
import { isDefined } from "remeda";

import { inboxProgressEntryTitles } from "@/lib/shared/components/procedures/progress-entries/constants";
import { DetailsContentWrapper } from "@/lib/shared/components/procedures/progress-entries/sidebars/progressEntryDetailsSidebar/DetailsContentWrapper";
import { LabelValueDisplay } from "@/lib/shared/components/procedures/progress-entries/sidebars/progressEntryDetailsSidebar/LabelValueDisplay";

export function InboxProgressEntryDetails({
  entry,
}: {
  entry: ApiProcessedInboxProgressEntry;
}) {
  return (
    <DetailsContentWrapper
      entry={entry}
      title={`Details ${inboxProgressEntryTitles[entry.inboxProgressEntryType]}`}
      creatorName={`${entry.createdByUserFirstName} ${entry.createdByUserLastName}`}
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
