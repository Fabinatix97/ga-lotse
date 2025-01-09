/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ApiGetProgressEntryResponseRelatedKeyDocumentProgressEntriesInner,
  ApiSystemProgressEntry,
} from "@eshg/employee-portal-api/businessProcedures";
import { Chip } from "@mui/joy";
import { isDefined } from "remeda";

import { useProgressEntriesConfig } from "@/lib/shared/components/procedures/progress-entries/ProgressEntriesContext";
import { systemProgressEntryTypeTitles } from "@/lib/shared/components/procedures/progress-entries/constants";
import { displayTriggerer } from "@/lib/shared/components/procedures/progress-entries/helper";
import {
  AllKeyDocumentVersions,
  DetailsContentWrapper,
  NewerVersionHint,
} from "@/lib/shared/components/procedures/progress-entries/sidebars/progressEntryDetailsSidebar/DetailsContentWrapper";
import { LabelValueDisplay } from "@/lib/shared/components/procedures/progress-entries/sidebars/progressEntryDetailsSidebar/LabelValueDisplay";

export function SystemProgressEntryDetails({
  entry,
  relatedKeyDocumentProgressEntries,
}: {
  entry: ApiSystemProgressEntry;
  relatedKeyDocumentProgressEntries: ApiGetProgressEntryResponseRelatedKeyDocumentProgressEntriesInner[];
}) {
  const { keyDocumentTypes } = useProgressEntriesConfig();

  const titlePrefix = "Details";
  const titleSuffix =
    systemProgressEntryTypeTitles[entry.systemProgressEntryType];

  const { keyDocumentVersion } = entry;
  const showNewerVersionHint =
    isDefined(keyDocumentVersion) &&
    isDefined(relatedKeyDocumentProgressEntries) &&
    relatedKeyDocumentProgressEntries.some(
      (relatedEntry) =>
        isDefined(relatedEntry.keyDocumentVersion) &&
        relatedEntry.keyDocumentVersion,
    );

  return (
    <DetailsContentWrapper
      entry={entry}
      title={
        isDefined(titleSuffix) ? `${titlePrefix} ${titleSuffix}` : titlePrefix
      }
      creatorName={displayTriggerer(entry)}
      additionalFileElements={{
        start: (
          <>
            <LabelValueDisplay
              label="Dokumenttyp"
              value={keyDocumentTypes[entry.keyDocumentType ?? ""] ?? ""}
              endDecorator={
                entry.keyDocumentVersion ? (
                  <Chip color="primary">{`Version ${entry.keyDocumentVersion}`}</Chip>
                ) : undefined
              }
            />
            {showNewerVersionHint && <NewerVersionHint />}
            {isDefined(relatedKeyDocumentProgressEntries) &&
              relatedKeyDocumentProgressEntries.length > 0 && (
                <AllKeyDocumentVersions
                  relatedEntries={relatedKeyDocumentProgressEntries}
                />
              )}
          </>
        ),
      }}
    >
      <LabelValueDisplay label="Text" value={entry.changeDescription ?? ""} />
    </DetailsContentWrapper>
  );
}
