/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Chip } from "@mui/joy";
import { createColumnHelper } from "@tanstack/react-table";
import { useState } from "react";

import { ApiUserEvent, ApiUserEventType } from "@eshg/base-api";
import {
  DataTable,
  MainContentLayout,
  OffsetPagination,
  StickyToolbarLayout,
  TablePage,
  TableSheet,
  Toolbar,
} from "@eshg/lib-employee-portal";
import { formatDateTime } from "@eshg/lib-portal";

import { useGetSelfUserEvents } from "@/lib/baseModule/api/queries/users";

const columnHelper = createColumnHelper<ApiUserEvent>();
const columns = [
  columnHelper.accessor("timestamp", {
    header: "Zeitstempel",
    enableSorting: false,
    cell: (props) => formatDateTime(props.getValue()),
    meta: {
      width: "15rem",
    },
  }),
  columnHelper.accessor("type", {
    header: "Typ",
    enableSorting: false,
    cell: (props) =>
      props.getValue() === ApiUserEventType.Login ? (
        <Chip color="success">Login</Chip>
      ) : (
        <Chip color="danger">Login fehlgeschlagen</Chip>
      ),
    meta: {
      width: "15rem",
    },
  }),
  columnHelper.accessor("ipAddress", {
    header: "IP-Adresse",
    enableSorting: false,
    cell: (props) => props.getValue(),
  }),
];

export default function UserLoginProtocolPage() {
  const [paginationProps, setPaginationProps] = useState({
    limit: 25,
    offset: 0,
  });

  function onOffsetChange(newOffset: number) {
    setPaginationProps((prev) => ({
      ...prev,
      offset: newOffset,
    }));
  }

  function onPageSizeChange(newPageSize: number) {
    setPaginationProps({
      limit: newPageSize,
      offset: 0,
    });
  }

  const { limit, offset } = paginationProps;

  const { data, isFetching } = useGetSelfUserEvents({
    limit: limit,
    offset,
  });

  const { elements, hasNext } = data;

  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Anmeldeprotokoll" />}>
      <MainContentLayout fullViewportHeight>
        <TablePage fullHeight data-testid="login-protocol-table">
          <TableSheet
            loading={isFetching}
            footer={
              <OffsetPagination
                hasNextPage={hasNext}
                offset={offset}
                pageSize={limit}
                numberOfElements={elements.length}
                onOffsetChange={onOffsetChange}
                onPageSizeChange={onPageSizeChange}
              />
            }
          >
            <DataTable data={elements} columns={columns} minWidth="40rem" />
          </TableSheet>
        </TablePage>
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
