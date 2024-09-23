/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiSystemProgressEntry } from "@eshg/employee-portal-api/businessProcedures";
import { isDefined } from "remeda";

import { systemProgressEntryTypeTitles } from "@/lib/shared/components/procedures/progress-entries/constants";
import { displayTriggerer } from "@/lib/shared/components/procedures/progress-entries/helper";
import { DetailsContentWrapper } from "@/lib/shared/components/procedures/progress-entries/sidebars/progressEntryDetailsSidebar/DetailsContentWrapper";
import { LabelValueDisplay } from "@/lib/shared/components/procedures/progress-entries/sidebars/progressEntryDetailsSidebar/LabelValueDisplay";

export function SystemProgressEntryDetails({
  entry,
}: {
  entry: ApiSystemProgressEntry;
}) {
  const titlePrefix = "Details";
  const titleSuffix =
    systemProgressEntryTypeTitles[entry.systemProgressEntryType];
  return (
    <DetailsContentWrapper
      entry={entry}
      title={
        isDefined(titleSuffix) ? `${titlePrefix} ${titleSuffix}` : titlePrefix
      }
      creatorName={displayTriggerer(entry)}
    >
      <LabelValueDisplay
        label="Text"
        value={entry.changeDescription ?? ""}
      ></LabelValueDisplay>
    </DetailsContentWrapper>
  );
}
