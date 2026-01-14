/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import LaptopIcon from "@mui/icons-material/Laptop";
import LogoutIcon from "@mui/icons-material/Logout";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import { Button, Chip, Stack, Typography } from "@mui/joy";
import { createColumnHelper } from "@tanstack/react-table";
import { ReactNode, useMemo } from "react";

import { ApiActiveUserSession } from "@eshg/base-api";
import {
  DataTable,
  MainContentLayout,
  StickyToolbarLayout,
  TableSheet,
  Toolbar,
} from "@eshg/lib-employee-portal";
import { formatDateTime, formatList } from "@eshg/lib-portal";

import { useInvalidateUserSessions } from "@/lib/baseModule/api/mutations/users";
import { useGetSelfActiveSessions } from "@/lib/baseModule/api/queries/users";

function DeviceIndicator({ label, icon }: { label: string; icon: ReactNode }) {
  return (
    <Stack gap={1} direction="row" alignItems="center">
      {icon}
      <Typography>{label}</Typography>
    </Stack>
  );
}

const columnHelper = createColumnHelper<ApiActiveUserSession>();

function osName(session: ApiActiveUserSession) {
  return (
    formatList([session.device.osName, session.device.osVersion], " ") ?? ""
  );
}

function useColumns() {
  const invalidateUserSessions = useInvalidateUserSessions();

  async function invalidateSession(session: string) {
    await invalidateUserSessions.mutateAsync([session]);
  }

  return [
    columnHelper.accessor("device.isMobile", {
      id: "isMobile",
      header: "Gerät",
      sortingFn: (rowA, rowB) =>
        compareFn.isMobile(rowA.original, rowB.original),
      cell: (props) =>
        props.getValue() ? (
          <DeviceIndicator label="Mobil" icon={<PhoneAndroidIcon />} />
        ) : (
          <DeviceIndicator label="PC" icon={<LaptopIcon />} />
        ),
      meta: {
        width: "10ch",
      },
    }),
    columnHelper.accessor("ip", {
      header: "IP-Adresse",
      sortingFn: (rowA, rowB) => compareFn.ip(rowA.original, rowB.original),
      cell: (props) => props.getValue(),
      meta: {
        width: "20ch",
      },
    }),
    columnHelper.accessor("startTime", {
      header: "Login Zeitpunkt",
      sortingFn: (rowA, rowB) =>
        compareFn.startTime(rowA.original, rowB.original),
      cell: (props) => formatDateTime(props.getValue()),
      meta: {
        width: "20ch",
      },
    }),
    columnHelper.accessor("device.osName", {
      id: "osName",
      header: "System",
      sortingFn: (rowA, rowB) => compareFn.osName(rowA.original, rowB.original),
      cell: (props) => osName(props.row.original),
    }),
    columnHelper.accessor("device.browserName", {
      id: "browserName",
      header: "Browser",
      sortingFn: (rowA, rowB) =>
        compareFn.browserName(rowA.original, rowB.original),
      cell: (props) => props.getValue(),
    }),
    columnHelper.accessor("isCurrent", {
      header: "Status",
      sortingFn: (rowA, rowB) =>
        compareFn.isCurrent(rowA.original, rowB.original),
      cell: (props) =>
        props.getValue() ? (
          <Chip color="success">aktuelle Sitzung</Chip>
        ) : undefined,
    }),
    columnHelper.display({
      id: "actions",
      header: "Aktion",
      enableSorting: false,
      cell: (props) =>
        !props.row.original.isCurrent && (
          <Button
            variant="plain"
            startDecorator={<LogoutIcon />}
            onClick={() => invalidateSession(props.row.original.sessionId)}
          >
            Trennen
          </Button>
        ),
      meta: {
        cellStyle: "button",
        width: "7rem",
        textAlign: "right",
      },
    }),
  ];
}

export default function AccountSecurityPage() {
  const columns = useColumns();
  const invalidateUserSessions = useInvalidateUserSessions();
  const { data, isFetching } = useGetSelfActiveSessions();

  const sessions = useMemo(() => {
    return getSortedSessions(data.sessions);
  }, [data.sessions]);

  async function invalidateOtherSessions() {
    const sessionsToInvalidate = sessions
      .filter((session) => !session.isCurrent)
      .map((session) => session.sessionId);
    if (sessionsToInvalidate.length > 0) {
      await invalidateUserSessions.mutateAsync(sessionsToInvalidate);
    }
  }

  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Aktive Sitzungen" />}>
      <MainContentLayout>
        <Button
          startDecorator={<LogoutIcon />}
          sx={{
            marginInlineStart: "auto",
            marginBlockEnd: 2,
          }}
          onClick={invalidateOtherSessions}
        >
          Inaktive Sitzungen trennen
        </Button>
        <TableSheet loading={isFetching}>
          <DataTable
            minWidth="60rem"
            data={sessions}
            columns={columns}
            enableSortingRemoval={false}
            sorting={{
              manualSorting: false,
              initialSorting: [
                {
                  id: "isCurrent",
                  desc: true,
                },
              ],
            }}
          />
        </TableSheet>
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}

function getSortedSessions(sessions: ApiActiveUserSession[]) {
  return sessions.toSorted((a, b) => -1 * compareFn.isCurrent(a, b));
}

function compareByTime(
  a: ApiActiveUserSession,
  b: ApiActiveUserSession,
): number {
  return Number(a.startTime) - Number(b.startTime);
}

const compareFn = {
  isCurrent: (a, b) =>
    Number(a.isCurrent) - Number(b.isCurrent) || compareByTime(a, b),
  startTime: (a, b) =>
    compareByTime(a, b) || Number(a.isCurrent) - Number(b.isCurrent),
  browserName: (a, b) =>
    emptyIfNull(a.device.browserName).localeCompare(
      emptyIfNull(b.device.browserName),
    ) || compareByTime(a, b),
  osName: (a, b) => osName(a).localeCompare(osName(b)) || compareByTime(a, b),
  isMobile: (a, b) =>
    Number(a.device.isMobile) - Number(b.device.isMobile) ||
    compareByTime(a, b),
  ip: (a, b) => a.ip.localeCompare(b.ip) || compareByTime(a, b),
} as const satisfies Record<
  string,
  (a: ApiActiveUserSession, b: ApiActiveUserSession) => number
>;

function emptyIfNull(a: string | null | undefined): string {
  return a ?? "";
}
