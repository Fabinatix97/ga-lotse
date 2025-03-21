/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChevronLeft, ChevronRight, SkipPrevious } from "@mui/icons-material";
import { Stack, Typography } from "@mui/joy";
import { isNonNullish } from "remeda";

import { IconButton } from "@/components/buttons/IconButton";
import { DEFAULT_PAGE_SIZE_OPTIONS } from "@/features/table/config/pagination";
import { getPageSizeOptions } from "@/features/table/utils/pagination";

import { RowsPerPageSelect } from "./RowsPerPageSelect";

interface OffsetPaginationProps {
  hasNextPage: boolean;
  offset: number;
  pageSize: number;
  numberOfElements: number;
  onOffsetChange: (newPageNumber: number) => void;
  onPageSizeChange: (newPageSize: number) => void;
}

export function OffsetPagination(props: OffsetPaginationProps) {
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
            DEFAULT_PAGE_SIZE_OPTIONS,
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
