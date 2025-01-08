/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiUserEvent, ApiUserEventType } from "@eshg/employee-portal-api/base";
import { formatDateTime } from "@eshg/lib-portal/formatters/dateTime";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import ChevronRight from "@mui/icons-material/ChevronRight";
import SkipPrevious from "@mui/icons-material/SkipPrevious";
import { Chip, Stack, Typography } from "@mui/joy";
import { createColumnHelper } from "@tanstack/react-table";
import { useState } from "react";
import { isNonNullish } from "remeda";

import { useGetSelfUserEvents } from "@/lib/baseModule/api/queries/users";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { Toolbar } from "@/lib/shared/components/layout/Toolbar";
import { IconButton } from "@/lib/shared/components/pagination/IconButton";
import { RowsPerPageSelect } from "@/lib/shared/components/pagination/RowsPerPageSelect";
import {
  defaultPageSizeOptions,
  getPageSizeOptions,
} from "@/lib/shared/components/pagination/paginationHelper";
import { DataTable } from "@/lib/shared/components/table/DataTable";
import { TablePage } from "@/lib/shared/components/table/TablePage";
import { TableSheet } from "@/lib/shared/components/table/TableSheet";

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
        <Chip color={"success"}>Login</Chip>
      ) : (
        <Chip color={"danger"}>Login fehlgeschlagen</Chip>
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
    <StickyToolbarLayout toolbar={<Toolbar title={"Anmeldeprotokoll"} />}>
      <MainContentLayout fullViewportHeight>
        <TablePage fullHeight data-testid={"login-protocol-table"}>
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
                pageSizeOptions={defaultPageSizeOptions}
              />
            }
          >
            <DataTable data={elements} columns={columns} minWidth={"40rem"} />
          </TableSheet>
        </TablePage>
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}

interface OffsetPaginationProps {
  hasNextPage: boolean;
  offset: number;
  pageSize: number;
  numberOfElements: number;
  onOffsetChange: (newPageNumber: number) => void;
  onPageSizeChange: (newPageSize: number) => void;
  pageSizeOptions: number[];
}

function OffsetPagination(props: OffsetPaginationProps) {
  const isFirstPage = props.offset < 1;
  const isLastPage = !props.hasNextPage;

  function goToFirstPage() {
    props.onOffsetChange(0);
  }

  function goToPreviousPage() {
    props.onOffsetChange(Math.max(0, props.offset - props.pageSize));
  }

  function goToNextPage() {
    props.onOffsetChange(props.offset + props.pageSize);
  }

  return (
    <>
      <Stack mt={3} direction="row" gap={2} justifyContent={"space-between"}>
        <RowsPerPageSelect
          value={`${props.pageSize}`}
          onChange={(_event, newValue) => {
            if (isNonNullish(newValue))
              props.onPageSizeChange(Number(newValue));
          }}
          options={getPageSizeOptions(
            props.pageSizeOptions,
            " Zeilen pro Seite",
          )}
          sx={{
            width: "13rem",
            display: {
              xxs: "none",
              md: "flex",
            },
          }}
        />

        <Stack
          direction={"row"}
          gap={{ xxs: 1, md: 3 }}
          justifyContent={{ xxs: "space-between", md: "flex-end" }}
          alignItems={"center"}
          flex={1}
        >
          <Stack direction={"row"} gap={1}>
            <IconButton
              label={"Zur ersten Seite"}
              disabled={isFirstPage}
              onClick={goToFirstPage}
            >
              <SkipPrevious />
            </IconButton>
            <IconButton
              label={"Zur vorherigen Seite"}
              disabled={isFirstPage}
              onClick={goToPreviousPage}
            >
              <ChevronLeft />
            </IconButton>
          </Stack>
          <Typography level={"body-sm"} textColor={"text.secondary"}>
            {props.offset + 1} - {props.offset + props.numberOfElements}
          </Typography>
          <IconButton
            label={"Zur nächsten Seite"}
            disabled={isLastPage}
            onClick={goToNextPage}
          >
            <ChevronRight />
          </IconButton>
        </Stack>
      </Stack>
    </>
  );
}
