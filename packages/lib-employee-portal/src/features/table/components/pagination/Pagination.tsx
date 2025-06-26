/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import {
  ChevronLeft,
  ChevronRight,
  SkipNext,
  SkipPrevious,
} from "@mui/icons-material";
import { SelectProps, Stack, Typography } from "@mui/joy";

import { LiveAnnouncer, getLastPage } from "@eshg/lib-portal";

import { IconButton } from "../../../../components/buttons/IconButton";
import {
  getCurrentCountText,
  getPageSizeOptions,
} from "../../utils/pagination";

import { RowsPerPageSelect } from "./RowsPerPageSelect";

export interface PaginationProps {
  loading?: boolean;
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

  const lastPage = getLastPage(props.pageSize, props.totalCount ?? 0);
  const isFirstPage = props.pageNumber < 1;
  const isLastPage = props.pageNumber === lastPage;

  function goToFirstPage() {
    props.onPageChange(0);
  }

  function goToPreviousPage() {
    if (props.pageNumber === 0) {
      return;
    }

    props.onPageChange(props.pageNumber - 1);
  }

  function goToNextPage() {
    if (props.pageNumber === lastPage) {
      return;
    }

    props.onPageChange(props.pageNumber + 1);
  }

  function goToLastPage() {
    props.onPageChange(lastPage);
  }

  return (
    <>
      <LiveAnnouncer
        message="Keine Einträge vorhanden"
        active={!props.loading && props.totalCount === 0}
      />
      <LiveAnnouncer
        message="Ein Eintrag vorhanden"
        active={!props.loading && props.totalCount === 1}
      />
      <LiveAnnouncer
        message={`${props.totalCount} Einträge vorhanden`}
        active={!props.loading && props.totalCount > 1}
      />
      <Stack mt={3} flexDirection="row" gap={2} justifyContent="space-between">
        <RowsPerPageSelect
          value={`${props.pageSize}`}
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
          onChange={props.onPageSizeChange}
        />
        <Stack
          flexDirection="row"
          gap={{ xxs: 1, md: 3 }}
          justifyContent={{ xxs: "space-between", md: "flex-end" }}
          alignItems="center"
          flex={1}
        >
          <RowsPerPageSelect
            value={`${props.pageSize}`}
            options={getPageSizeOptions(props.pageSizeOptions, "")}
            sx={{
              display: displayShowLimitSelect,
            }}
            onChange={props.onPageSizeChange}
          />
          <Stack
            display={displayHideLimitSelect}
            flexDirection="row"
            gap={1}
            alignItems="center"
          >
            <IconButton
              label="Zur ersten Seite"
              ariaDisabled={isFirstPage}
              onClick={goToFirstPage}
            >
              <SkipPrevious />
            </IconButton>
            <IconButton
              label="Zur vorherigen Seite"
              ariaDisabled={isFirstPage}
              onClick={goToPreviousPage}
            >
              <ChevronLeft />
            </IconButton>
          </Stack>
          <Stack
            flexDirection="row"
            gap="4px"
            alignItems="center"
            data-testid="page-details"
          >
            <Typography level="title-sm" textColor="text.secondary">
              {getCurrentCountText(
                props.pageNumber,
                props.pageSize,
                props.totalCount ?? 0,
              )}
            </Typography>
            <Typography level="body-xs" textColor="text.secondary">
              {" "}
              von {props.totalCount}
            </Typography>
          </Stack>
          <Stack
            display={displayHideLimitSelect}
            flexDirection="row"
            gap={1}
            alignItems="center"
          >
            <IconButton
              label="Zur nächsten Seite"
              ariaDisabled={isLastPage}
              onClick={goToNextPage}
            >
              <ChevronRight />
            </IconButton>
            <IconButton
              label="Zur letzten Seite"
              ariaDisabled={isLastPage}
              onClick={goToLastPage}
            >
              <SkipNext />
            </IconButton>
          </Stack>
          <Stack
            display={displayShowLimitSelect}
            flexDirection="row"
            gap={1}
            alignItems="center"
          >
            <IconButton
              label="Zur vorherigen Seite"
              ariaDisabled={isFirstPage}
              onClick={goToPreviousPage}
            >
              <ChevronLeft />
            </IconButton>
            <IconButton
              label="Zur nächsten Seite"
              ariaDisabled={isLastPage}
              onClick={goToNextPage}
            >
              <ChevronRight />
            </IconButton>
          </Stack>
        </Stack>
      </Stack>
    </>
  );
}
