/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { getLastPage } from "@eshg/lib-portal/helpers/paginationHelper";
import {
  ChevronLeft,
  ChevronRight,
  SkipNext,
  SkipPrevious,
} from "@mui/icons-material";
import { SelectProps, Stack, Typography } from "@mui/joy";

import { IconButton } from "./IconButton";
import { RowsPerPageSelect } from "./RowsPerPageSelect";
import { getCurrentCountText, getPageSizeOptions } from "./paginationHelper";

export interface PaginationProps {
  totalCount: number;
  pageSizeOptions: number[];
  pageSize: number;
  pageNumber: number;
  onPageChange: (newPageNumber: number) => void;
  onPageSizeChange: SelectProps<string, false>["onChange"];
  alwaysShowPageSizeSelect: boolean;
}

export function Pagination(props: Readonly<PaginationProps>) {
  const displayShowLimitSelect = {
    xxs: props.alwaysShowPageSizeSelect ? "flex" : "none",
    md: "none",
  };

  const displayHideLimitSelect = {
    xxs: props.alwaysShowPageSizeSelect ? "none" : "flex",
    md: "flex",
  };

  const lastPage = getLastPage(props.pageSize, props.totalCount);
  const isFirstPage = props.pageNumber < 1;
  const isLastPage = props.pageNumber === lastPage;

  function goToFirstPage() {
    props.onPageChange(0);
  }

  function goToPreviousPage() {
    props.onPageChange(props.pageNumber - 1);
  }

  function goToNextPage() {
    props.onPageChange(props.pageNumber + 1);
  }

  function goToLastPage() {
    props.onPageChange(lastPage);
  }

  return (
    <Stack mt={3} flexDirection="row" gap={2} justifyContent={"space-between"}>
      <RowsPerPageSelect
        value={`${props.pageSize}`}
        onChange={props.onPageSizeChange}
        options={getPageSizeOptions(props.pageSizeOptions, " Zeilen pro Seite")}
        sx={{
          width: "13rem",
          display: {
            xxs: "none",
            md: "flex",
          },
        }}
      />
      <Stack
        flexDirection={"row"}
        gap={{ xxs: 1, md: 3 }}
        justifyContent={{ xxs: "space-between", md: "flex-end" }}
        alignItems={"center"}
        flex={1}
      >
        <RowsPerPageSelect
          value={`${props.pageSize}`}
          onChange={props.onPageSizeChange}
          options={getPageSizeOptions(props.pageSizeOptions, "")}
          sx={{
            display: displayShowLimitSelect,
          }}
        />
        <Stack
          display={displayHideLimitSelect}
          flexDirection={"row"}
          gap={1}
          alignItems={"center"}
        >
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
        <Stack
          flexDirection={"row"}
          gap={"4px"}
          alignItems={"center"}
          data-testid="page-details"
        >
          <Typography level="title-sm" textColor="text.secondary">
            {getCurrentCountText(
              props.pageNumber,
              props.pageSize,
              props.totalCount,
            )}
          </Typography>
          <Typography level="body-xs" textColor="text.secondary">
            {" "}
            von {props.totalCount}
          </Typography>
        </Stack>
        <Stack
          display={displayHideLimitSelect}
          flexDirection={"row"}
          gap={1}
          alignItems={"center"}
        >
          <IconButton
            label={"Zur nächsten Seite"}
            disabled={isLastPage}
            onClick={goToNextPage}
          >
            <ChevronRight />
          </IconButton>
          <IconButton
            label={"Zur letzten Seite"}
            disabled={isLastPage}
            onClick={goToLastPage}
          >
            <SkipNext />
          </IconButton>
        </Stack>
        <Stack
          display={displayShowLimitSelect}
          flexDirection={"row"}
          gap={1}
          alignItems={"center"}
        >
          <IconButton
            label={"Zur vorherigen Seite"}
            disabled={isFirstPage}
            onClick={goToPreviousPage}
          >
            <ChevronLeft />
          </IconButton>
          <IconButton
            label={"Zur nächsten Seite"}
            disabled={isLastPage}
            onClick={goToNextPage}
          >
            <ChevronRight />
          </IconButton>
        </Stack>
      </Stack>
    </Stack>
  );
}
