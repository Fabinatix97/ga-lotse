/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { FileDownloadOutlined } from "@mui/icons-material";
import { Button, Divider, Stack } from "@mui/joy";
import { useSearchParams } from "next/navigation";
import {
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { ApiAdminRevision } from "@eshg/service-directory-api";

import { Error } from "@/lib/components/error/Error";
import { ContentHeader } from "@/lib/components/layout/page/header/ContentHeader";
import { CenteredCircularProgress } from "@/lib/components/progress/CenteredCircularProgress";
import { DateFilter } from "@/lib/components/table/DateFilter";
import { SingleSelectFilter } from "@/lib/components/table/SingleSelectFilter";
import { InformationSheet } from "@/lib/components/timeline/InformationSheet";
import { FilteredAuditHistory } from "@/lib/components/view/audit-log/FilteredAuditHistory";
import {
  DateAdjustedForLocalTimeZoneIfNoTime,
  days,
} from "@/lib/helpers/datetime";
import { saveDownload } from "@/lib/helpers/files";
import { useAuditLogsQuery, useUsernames } from "@/lib/hooks/useAuditLogs";
import { useConfirmationDialog } from "@/lib/hooks/useConfirmationDialog";
import { useReplaceSearchParams } from "@/lib/hooks/useReplaceSearchParams";
import { useTranslation } from "@/lib/i18n/client";

export type Revision = Omit<ApiAdminRevision, "id"> & { id: string };

function getOneWeekAgo() {
  const date = new Date();
  date.setDate(date.getDate() - 7);
  return date;
}

function getCommitters(revisions: Revision[]) {
  const committers: string[] = [];
  revisions.forEach((revision) => {
    const searchElement = revision.committer ?? "undefined";
    if (!committers.includes(searchElement)) {
      committers.push(revision.committer ?? "undefined");
    }
  });
  return committers;
}

function getIPs(revisions: Revision[]) {
  const ips: string[] = [];
  revisions.forEach((revision) => {
    const searchElement = revision.ip ?? "undefined";
    if (!ips.includes(searchElement)) {
      ips.push(revision.ip ?? "undefined");
    }
  });
  return ips;
}

export function AuditLog() {
  return (
    <>
      <ContentHeader title="auditLogHeader" />
      <QueryDependentContent />
    </>
  );
}

function QueryDependentContent() {
  const [confirmed, setConfirmed] = useState(false);
  const searchParams = useSearchParams();

  const fromInclusive = useMemo(() => {
    setConfirmed(false);
    const fromInc = searchParams.get("fromInclusive");
    if (fromInc == null) return undefined;
    return DateAdjustedForLocalTimeZoneIfNoTime(fromInc).toISOString();
  }, [searchParams]);

  const toExclusive = useMemo(() => {
    setConfirmed(false);
    const toInc = searchParams.get("toInclusive");
    if (toInc == null) return undefined;
    const toExc = DateAdjustedForLocalTimeZoneIfNoTime(toInc);
    toExc.setDate(toExc.getDate() + 1);
    return toExc.toISOString();
  }, [searchParams]);

  const username = useMemo(() => {
    setConfirmed(false);
    return searchParams.get("username") ?? undefined;
  }, [searchParams]);

  const { isPending, isError, error, data } = useAuditLogsQuery(
    fromInclusive,
    toExclusive,
    username,
    confirmed,
  );

  if (confirmed && isPending) {
    return <CenteredCircularProgress />;
  }

  if (isError) {
    return <Error error={error} />;
  }

  return (
    <AuditLogContent
      fromInclusive={fromInclusive}
      toExclusive={toExclusive}
      username={username}
      setConfirmed={setConfirmed}
      data={data}
    />
  );
}

function AuditLogContent({
  fromInclusive,
  toExclusive,
  username,
  setConfirmed,
  data,
}: Readonly<{
  fromInclusive: string | undefined;
  toExclusive: string | undefined;
  username: string | undefined;
  setConfirmed: (value: SetStateAction<boolean>) => void;
  data: Revision[] | undefined;
}>) {
  const { t } = useTranslation();
  const usernames = useUsernames();
  const { confirmationDialog, getConfirmation } = useConfirmationDialog(
    t("expensiveQuery"),
  );
  const replaceSearchParams = useReplaceSearchParams();

  useEffect(() => {
    void (async () => {
      if (!fromInclusive || !toExclusive) {
        return;
      }
      const MINIMUM_TIME_FOR_CONFIRMATION = days(32);
      if (
        new Date(toExclusive).getTime() - new Date(fromInclusive).getTime() >
        MINIMUM_TIME_FOR_CONFIRMATION
      ) {
        setConfirmed(await getConfirmation());
      } else {
        setConfirmed(true);
      }
    })();
  }, [fromInclusive, getConfirmation, toExclusive, username, setConfirmed]);

  useEffect(() => {
    if (fromInclusive && toExclusive) {
      return;
    }
    replaceSearchParams([
      {
        name: "fromInclusive",
        value: getOneWeekAgo().toISOString().slice(0, 10),
      },
      {
        name: "toInclusive",
        value: new Date().toISOString().slice(0, 10),
      },
    ]);
  }, [fromInclusive, toExclusive, replaceSearchParams]);

  const handleDownload = useCallback(() => {
    function downloadAuditLog(): Blob {
      const json = JSON.stringify(data);
      return new Blob([json], { type: "application/json" });
    }

    saveDownload(
      `audit-log-${new Date().toISOString()}.json`,
      downloadAuditLog,
    ).catch((error) =>
      // eslint-disable-next-line no-console
      console.error("Fetched error for downloading revisions:", error),
    );
  }, [data]);

  return (
    <>
      <Stack flex="1" flexDirection="column" spacing={2}>
        <Stack gap={2}>
          <DateFilter
            searchParamName="fromInclusive"
            placeholder={t("fromInclusive")}
            debounceTimeoutMs={500}
          />
          <DateFilter
            searchParamName="toInclusive"
            placeholder={t("toInclusive")}
            debounceTimeoutMs={500}
          />
          <SingleSelectFilter
            disabled={!usernames}
            searchParamName="username"
            label={t("username")}
            options={
              usernames?.map((u: string) => ({
                label: u,
                value: u,
              })) ?? []
            }
          />
          <Button
            size="sm"
            endDecorator={<FileDownloadOutlined />}
            sx={{
              alignSelf: "flex-end",
            }}
            onClick={handleDownload}
          >
            {t("downloadAuditLog")}
          </Button>
        </Stack>
        <Divider />
        <Stack gap={2}>
          <SingleSelectFilter
            searchParamName="id"
            label={t("auditRevisionColumnFilter.id")}
            options={
              data?.map((revision) => ({
                label: revision.id,
                value: revision.id,
              })) ?? []
            }
          />
          <SingleSelectFilter
            searchParamName="committer"
            label={t("auditRevisionColumnFilter.committer")}
            options={
              getCommitters(data ?? []).map((committer) => ({
                label: committer,
                value: committer,
              })) ?? []
            }
          />
          <SingleSelectFilter
            searchParamName="ip"
            label={t("auditRevisionColumnFilter.ip")}
            options={
              getIPs(data ?? []).map((ip) => ({
                label: ip,
                value: ip,
              })) ?? []
            }
          />
        </Stack>
        {data && (
          <InformationSheet>
            <FilteredAuditHistory revisions={data} />
          </InformationSheet>
        )}
        {fromInclusive! >= toExclusive! && t("negativeDateRangeHint")}
      </Stack>
      {confirmationDialog}
    </>
  );
}
