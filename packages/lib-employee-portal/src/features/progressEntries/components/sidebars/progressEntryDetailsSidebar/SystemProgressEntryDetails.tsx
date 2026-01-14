/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Chip } from "@mui/joy";
import { isDefined } from "remeda";

import {
  ApiGetProgressEntryResponseRelatedKeyDocumentProgressEntriesInner,
  ApiSystemProgressEntry,
  ApiUser,
} from "@eshg/lib-procedures-api";

import { useProgressEntriesConfig } from "../../../contexts/progressEntries";
import { formatTriggeredBy } from "../../../utils/helper";

import {
  AllKeyDocumentVersions,
  DetailsContentWrapper,
  NewerVersionHint,
} from "./DetailsContentWrapper";
import { LabelValueDisplay } from "./LabelValueDisplay";

export function SystemProgressEntryDetails({
  entry,
  resolvedUsers,
  relatedKeyDocumentProgressEntries,
}: {
  entry: ApiSystemProgressEntry;
  resolvedUsers: Record<string, ApiUser>;
  relatedKeyDocumentProgressEntries: ApiGetProgressEntryResponseRelatedKeyDocumentProgressEntriesInner[];
}) {
  const { keyDocumentTypes, progressEntryTypes } = useProgressEntriesConfig();

  const titlePrefix = "Details";
  const titleSuffix = progressEntryTypes[entry.systemProgressEntryType];

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
      creatorName={formatTriggeredBy(entry, resolvedUsers)}
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
