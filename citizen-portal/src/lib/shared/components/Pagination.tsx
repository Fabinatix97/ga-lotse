/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { getLastPage } from "@eshg/lib-portal/helpers/paginationHelper";
import { useIsMobile } from "@eshg/lib-portal/hooks/useIsMobile";
import { ArrowBackIosNew, ArrowForwardIos } from "@mui/icons-material";
import { Button, ButtonProps, IconButton, Stack, Typography } from "@mui/joy";
import { PropsWithChildren } from "react";

import { useTranslation } from "@/lib/i18n/client";
import { byBreakpoint } from "@/lib/shared/breakpoints";

const buttonProps: ButtonProps = {
  size: "md",
  color: "neutral",
  variant: "outlined",
  sx: { minHeight: "40px" },
};

export interface PaginationProps {
  pageNumber: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (newPageNumber: number) => void;
}

export function Pagination(props: Readonly<PaginationProps>) {
  const { t } = useTranslation(["pagination"]);

  function goToPreviousPage() {
    props.onPageChange(props.pageNumber - 1);
  }

  function goToNextPage() {
    props.onPageChange(props.pageNumber + 1);
  }

  const isMobile = useIsMobile();
  const lastPage = getLastPage(props.pageSize, props.totalCount);
  const isFirstPage = props.pageNumber < 1;
  const isLastPage = props.pageNumber === lastPage;
  const items = getPaginationItems(
    props.pageNumber,
    lastPage,
    isMobile ? 0 : 1,
  );
  const renderedPaginationItems = items.map((paginationItem, index) => {
    if (paginationItem === "spacer") {
      return (
        <Typography
          key={`spacer-${index}`}
          level="body-md"
          sx={{
            mx: 1,
            width: byBreakpoint({ mobile: "22px", desktop: "38px" }),
            textAlign: "center",
          }}
        >
          …
        </Typography>
      );
    }

    const pageIndex = paginationItem - 1;
    return (
      <PaginationButton
        key={pageIndex}
        onClick={() => {
          props.onPageChange(pageIndex);
        }}
        isCurrent={pageIndex === props.pageNumber}
      >
        {paginationItem}
      </PaginationButton>
    );
  });

  return (
    <Stack
      flexDirection="row"
      alignItems="center"
      justifyContent="center"
      gap={byBreakpoint({ mobile: 0.5, desktop: 1 })}
      mt={3}
    >
      <IconButton
        {...buttonProps}
        sx={{
          ...buttonProps.sx,
          mr: byBreakpoint({ mobile: 0, desktop: 1 }),
        }}
        aria-label={t("gotoPreviousPage")}
        disabled={isFirstPage}
        onClick={goToPreviousPage}
      >
        <ArrowBackIosNew
          size="sm"
          color={isFirstPage ? "neutral" : "primary"}
        />
      </IconButton>
      {renderedPaginationItems}
      <IconButton
        {...buttonProps}
        sx={{
          ...buttonProps.sx,
          ml: byBreakpoint({ mobile: 0, desktop: 1 }),
        }}
        aria-label={t("gotoNextPage")}
        disabled={isLastPage}
        onClick={goToNextPage}
      >
        <ArrowForwardIos size="sm" color={isLastPage ? "neutral" : "primary"} />
      </IconButton>
    </Stack>
  );
}

function PaginationButton(
  props: PropsWithChildren<{
    isCurrent: boolean;
    onClick: ButtonProps["onClick"];
  }>,
) {
  return (
    <Button
      {...buttonProps}
      sx={{ ...buttonProps.sx, px: 2 }}
      onClick={props.onClick}
      color={props.isCurrent ? "primary" : buttonProps.color}
      variant={props.isCurrent ? "solid" : buttonProps.variant}
    >
      {props.children}
    </Button>
  );
}

type PaginationItem = number | "spacer";
function getPaginationItems(
  currentPageIndex: number,
  lastPageIndex: number,
  margin = 1,
): PaginationItem[] {
  const currentPage = currentPageIndex + 1;
  const totalPages = lastPageIndex + 1;

  const marginalRegionSize = 2 + 3 * Math.min(margin, 1);
  const isAdjacentToStart = currentPage <= 2 + margin;
  const isAdjacentToEnd = currentPage >= totalPages - margin - 1;
  const startPage = isAdjacentToStart
    ? 1
    : isAdjacentToEnd
      ? Math.max(1, totalPages - (marginalRegionSize - 1))
      : currentPage - margin;
  const endPage = isAdjacentToEnd
    ? totalPages
    : isAdjacentToStart
      ? Math.min(marginalRegionSize, totalPages)
      : currentPage + margin;

  const pagination: PaginationItem[] = [];
  if (startPage > 1) {
    pagination.push(1);
  }
  if (startPage > 2) {
    pagination.push("spacer");
  }
  for (let pageNumber = startPage; pageNumber <= endPage; ++pageNumber) {
    pagination.push(pageNumber);
  }
  if (endPage < totalPages - 1) {
    pagination.push("spacer");
  }
  if (endPage < totalPages) {
    pagination.push(totalPages);
  }
  return pagination;
}
