/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack, Typography } from "@mui/joy";
import { TFunction } from "i18next";
import { isEmpty } from "remeda";

import {
  ApiAdminActorMetadata,
  ApiAdminActorSelector,
  ApiAdminActorType,
  ApiAdminCertificate,
  ApiAdminOrgUnitType,
  ApiAdminPartialActor,
  ApiAdminPartialOrgUnit,
  ApiPairAdminActorMetadata,
  ApiPairAdminPartialActor,
  ApiPairAdminPartialOrgUnit,
  ApiPairAdminPartialRule,
} from "@eshg/service-directory-api";

import {
  EmptyHistoryEntryIndicator,
  HistoryEntryIndicator,
} from "@/lib/components/timeline/HistoryEntryIndicator";
import { Timeline } from "@/lib/components/timeline/Timeline";
import { TimelineEntry } from "@/lib/components/timeline/TimelineEntry";
import { Revision } from "@/lib/components/view/audit-log/AuditLog";
import { AuditActorMetadataTable } from "@/lib/components/view/audit-log/tables/AuditActorMetadataTable";
import { AuditActorTable } from "@/lib/components/view/audit-log/tables/AuditActorTable";
import { AuditOrgUnitTable } from "@/lib/components/view/audit-log/tables/AuditOrgUnitTable";
import { AuditRuleTable } from "@/lib/components/view/audit-log/tables/AuditRuleTable";
import { useTranslation } from "@/lib/i18n/client";
import { RevisionType } from "@/lib/types/audit";

interface Diff {
  id: string;
  revisionType: RevisionType;
  active?: { old?: boolean; new?: boolean };
  readableName?: { old?: string; new?: string };
  type?: {
    old?: ApiAdminOrgUnitType | ApiAdminActorType;
    new?: ApiAdminOrgUnitType | ApiAdminActorType;
  };
  certificate?: { old?: ApiAdminCertificate; new?: ApiAdminCertificate };
  commonName?: { old?: string; new?: string };
  networkId?: { old?: string; new?: string };
  orgUnitId?: { old?: string; new?: string };
  content?: { old?: string; new?: string };
  changedAt?: { old?: Date; new?: Date };
  description?: { old?: string; new?: string };
  client?: {
    old?: ApiAdminActorSelector;
    new?: ApiAdminActorSelector;
  };
  server?: {
    old?: ApiAdminActorSelector;
    new?: ApiAdminActorSelector;
  };
}

function CorrespondingSubRow({ revision }: Readonly<{ revision: Revision }>) {
  return (
    <>
      {!isEmpty(revision.orgUnitPairs) && (
        <AuditOrgUnitTable orgUnitPairs={revision.orgUnitPairs} />
      )}
      {!isEmpty(revision.actorPairs) && (
        <AuditActorTable actorPairs={revision.actorPairs} />
      )}
      {!isEmpty(revision.metadataPairs) && (
        <AuditActorMetadataTable metadataPairs={revision.metadataPairs} />
      )}
      {!isEmpty(revision.rulePairs) && (
        <AuditRuleTable rulePairs={revision.rulePairs} />
      )}
    </>
  );
}

function getEntryType(diffs: Diff[]) {
  const added = diffs.filter((diff) => diff.revisionType === RevisionType.ADD);
  const modified = diffs.filter(
    (diff) => diff.revisionType === RevisionType.MOD,
  );
  const deleted = diffs.filter(
    (diff) => diff.revisionType === RevisionType.DEL,
  );
  if (isEmpty(added) && isEmpty(modified)) {
    return RevisionType.DEL;
  }
  if (isEmpty(deleted) && isEmpty(modified)) {
    return RevisionType.ADD;
  }
  return RevisionType.MOD;
}

export function AuditHistory({
  revisions,
}: Readonly<{
  revisions: Revision[];
}>) {
  const { t } = useTranslation();
  const entries = revisions.toReversed().map((revision) => {
    const diffs = getDiffs(
      revision.orgUnitPairs,
      revision.actorPairs,
      revision.metadataPairs,
      revision.rulePairs,
    );

    return (
      <TimelineEntry
        key={`${revision.id}`}
        label={<Label revision={revision} />}
        title={<Title diffs={diffs} />}
        subtitle={
          revision.committer && `${t("commiter")}: ` + revision.committer
        }
        indicator={
          <HistoryEntryIndicator
            entryType={getEntryType(diffs)}
            variant="soft"
          />
        }
      >
        <Stack flexDirection="column" gap={1}>
          <CorrespondingSubRow revision={revision} />
        </Stack>
      </TimelineEntry>
    );
  });

  return (
    <Timeline>
      {entries.length === 0 ? (
        <TimelineEntry
          label={t("auditLogEmptyLabel")}
          title={t("auditLogEmptyTitle")}
          indicator={<EmptyHistoryEntryIndicator variant="soft" />}
        />
      ) : (
        entries
      )}
    </Timeline>
  );
}

function getRevisionType(
  newEntity:
    | ApiAdminPartialOrgUnit
    | ApiAdminPartialActor
    | ApiAdminActorMetadata
    | undefined,
) {
  return newEntity ? RevisionType.MOD : RevisionType.DEL;
}

function getDiffs(
  orgUnitPairs: ApiPairAdminPartialOrgUnit[],
  actorPairs: ApiPairAdminPartialActor[],
  metadataPairs: ApiPairAdminActorMetadata[],
  rulePairs: ApiPairAdminPartialRule[],
) {
  const orgUnitDiffs: Diff[] = orgUnitPairs.map((orgUnit) => {
    const oldEntity = orgUnit.oldEntity;
    const newEntity = orgUnit.newEntity;
    return {
      id: oldEntity?.id ?? newEntity!.id!,
      revisionType: oldEntity ? getRevisionType(newEntity) : RevisionType.ADD,
      active: {
        old: oldEntity?.active,
        new: newEntity?.active,
      },
      readableName: {
        old: oldEntity?.readableName,
        new: newEntity?.readableName,
      },
      type: {
        old: oldEntity?.type,
        new: newEntity?.type,
      },
    };
  });
  const actorDiffs: Diff[] = actorPairs.map((actor) => {
    const oldEntity = actor.oldEntity;
    const newEntity = actor.newEntity;
    return {
      id: oldEntity?.id ?? newEntity!.id!,
      revisionType: oldEntity ? getRevisionType(newEntity) : RevisionType.ADD,
      active: {
        old: oldEntity?.active,
        new: newEntity?.active,
      },
      readableName: {
        old: oldEntity?.readableName,
        new: newEntity?.readableName,
      },
      type: {
        old: oldEntity?.type,
        new: newEntity?.type,
      },
      certificate: {
        old: oldEntity?.certificate,
        new: newEntity?.certificate,
      },
      networkId: {
        old: oldEntity?.networkId,
        new: newEntity?.networkId,
      },
      orgUnitId: {
        old: oldEntity?.orgUnitId,
        new: newEntity?.orgUnitId,
      },
      commonName: {
        old: oldEntity?.commonName,
        new: newEntity?.commonName,
      },
    };
  });
  const actorMetadataDiff: Diff[] = metadataPairs.map((metadata) => {
    const oldEntity = metadata.oldEntity;
    const newEntity = metadata.newEntity;
    return {
      id: oldEntity?.id ?? newEntity!.id,
      revisionType: oldEntity ? getRevisionType(newEntity) : RevisionType.ADD,
      content: {
        old: oldEntity?.content,
        new: newEntity?.content,
      },
      changedAt: {
        old: oldEntity?.changedAt,
        new: newEntity?.changedAt,
      },
    };
  });
  const ruleDiff: Diff[] = rulePairs.map((metadata) => {
    const oldEntity = metadata.oldEntity;
    const newEntity = metadata.newEntity;
    return {
      id: oldEntity?.id ?? newEntity!.id!,
      revisionType: oldEntity ? getRevisionType(newEntity) : RevisionType.ADD,
      description: {
        old: oldEntity?.description,
        new: newEntity?.description,
      },
      client: {
        old: oldEntity?.client,
        new: newEntity?.client,
      },
      server: {
        old: oldEntity?.server,
        new: newEntity?.server,
      },
      active: {
        old: oldEntity?.active,
        new: newEntity?.active,
      },
    };
  });
  return orgUnitDiffs.concat(actorDiffs, actorMetadataDiff, ruleDiff);
}

function Label({ revision }: Readonly<{ revision: Revision }>) {
  return (
    revision.timestamp.toLocaleString() +
    " | " +
    revision.author +
    " | " +
    revision.ip
  );
}

function Title({ diffs }: Readonly<{ diffs: Diff[] }>) {
  const { t } = useTranslation();
  const added = diffs.filter((diff) => diff.revisionType === RevisionType.ADD);
  const modified = diffs.filter(
    (diff) => diff.revisionType === RevisionType.MOD,
  );
  const deleted = diffs.filter(
    (diff) => diff.revisionType === RevisionType.DEL,
  );

  let title = "";

  if (!isEmpty(added)) {
    title =
      (added.length >= 2
        ? t("elements", { count: added.length })
        : elementName(t, added[0])) + ` ${t("auditHistory.added")} \n`;
  }
  if (!isEmpty(modified)) {
    title =
      title +
      (modified.length >= 2
        ? t("elements", { count: added.length })
        : elementName(t, modified[0])) +
      ` ${t("auditHistory.modified")} \n`;
  }
  if (!isEmpty(deleted)) {
    title =
      title +
      (deleted.length >= 2
        ? t("elements", { count: added.length })
        : elementName(t, deleted[0])) +
      ` ${t("auditHistory.deleted")}`;
  }
  return (
    <Typography whiteSpace="pre-wrap">{title.replace(/\n+$/, "")}</Typography>
  );
}

function elementName(t: TFunction, diff: Diff | undefined): string {
  let name = diff?.readableName?.new;
  name ??= diff?.description?.new;
  if (diff?.client !== undefined) {
    name ??= t("rule");
  }
  name ??= t("actorMetadata");
  return name;
}
