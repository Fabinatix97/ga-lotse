/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import AddIcon from "@mui/icons-material/Add";
import BlockIcon from "@mui/icons-material/Block";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FactCheckIcon from "@mui/icons-material/FactCheckOutlined";
import RemoveIcon from "@mui/icons-material/Remove";
import {
  CircularProgress,
  IconButton,
  Sheet,
  Stack,
  SvgIcon,
  styled,
} from "@mui/joy";
import { createElement, useTransition } from "react";
import { isDefined } from "remeda";

import {
  ApiInventoryBookingType,
  ApiInventoryItemBookingEntry,
  ApiInventoryItemBookingHistory,
  ApiUser,
} from "@eshg/base-api";
import { DetailsSectionHeader, formatList } from "@eshg/lib-employee-portal";
import {
  formatDate,
  formatDateTime,
} from "@eshg/lib-portal/formatters/dateTime";

import { Timeline } from "@/lib/shared/components/timeline/Timeline";
import { TimelineEntry } from "@/lib/shared/components/timeline/TimelineEntry";
import { TimelineEntryIndicator } from "@/lib/shared/components/timeline/TimelineEntryIndicator";
import { UserLink } from "@/lib/shared/components/users/UserLink";

const headerId = "inventory-management-history-header";

interface InventoryBookingProps {
  history: ApiInventoryItemBookingHistory;
  currentPage: number;
  onChangePage: (page: number) => void;
}

export function InventoryBooking({
  history,
  currentPage,
  onChangePage,
}: Readonly<InventoryBookingProps>) {
  const [isPending, startTransition] = useTransition();

  function nextPage() {
    startTransition(() => onChangePage(currentPage + 1));
  }

  function previousPage() {
    startTransition(() => onChangePage(currentPage - 1));
  }

  const { elements, totalNumberOfElements, resolvedUsers } = history;

  const startDate = elements.at(-1)?.bookedAt;
  const endDate = currentPage > 0 ? elements.at(0)?.bookedAt : undefined;

  const disableNextPage =
    isPending || totalNumberOfElements <= (currentPage + 1) * 5;
  const disablePrevPage = isPending || currentPage <= 0;

  const timeSuffix = isDefined(startDate)
    ? `${formatDate(startDate, "de")} bis ${isDefined(endDate) ? formatDate(endDate, "de") : "heute"}`
    : undefined;
  const title = formatList(["Buchungshistorie", timeSuffix], " ") ?? "";

  return (
    <Sheet sx={{ flex: 1, padding: 3 }}>
      <Backdrop show={isPending}>
        <CircularProgress />
      </Backdrop>
      <Stack
        component="section"
        aria-labelledby={headerId}
        direction={"row"}
        justifyContent={"space-between"}
      >
        <Stack width={"100%"} gap={2}>
          <DetailsSectionHeader id={headerId} title={title} />
          <Stack direction={"row"} gap={1}>
            <Stack flex={1}>
              <Timeline>
                {elements.map((entry) => (
                  <TimelineEntry
                    key={entry.bookingId}
                    label={
                      <BookingStepLabel
                        entry={entry}
                        user={resolvedUsers[entry.userId]}
                      />
                    }
                    title={renderBookingEntryTitle(entry)}
                    indicator={
                      <BookingStepIndicator
                        type={entry.type}
                        status={entry.status}
                      />
                    }
                  />
                ))}
              </Timeline>
            </Stack>
            <Stack gap={1}>
              <IconButton
                aria-label={"Vorherige Seite"}
                color={"primary"}
                variant={"outlined"}
                size={"sm"}
                onClick={previousPage}
                disabled={disablePrevPage}
              >
                <ExpandLessIcon />
              </IconButton>
              <IconButton
                aria-label={"Nächste Seite"}
                color={"primary"}
                variant={"outlined"}
                size={"sm"}
                onClick={nextPage}
                disabled={disableNextPage}
              >
                <ExpandMoreIcon />
              </IconButton>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Sheet>
  );
}

const bookingTypeIcon = {
  [ApiInventoryBookingType.Booking]: RemoveIcon,
  [ApiInventoryBookingType.Delivery]: AddIcon,
  [ApiInventoryBookingType.Correction]: FactCheckIcon,
} as const satisfies Record<ApiInventoryBookingType, typeof SvgIcon>;

const indicatorColor = {
  [ApiInventoryBookingType.Booking]: "danger",
  [ApiInventoryBookingType.Delivery]: "success",
  [ApiInventoryBookingType.Correction]: "primary",
} as const satisfies Record<ApiInventoryBookingType, string>;

function renderBookingEntryTitle(entry: ApiInventoryItemBookingEntry): string {
  switch (entry.type) {
    case "BOOKING":
      if (entry.status === "CANCELLED") {
        return `Stornierte Buchung: ${entry.amount} Stück`;
      }
      return `Abbuchung: ${entry.amount} Stück`;
    case "DELIVERY":
      return `aufgefüllt: ${entry.amount} Stück`;
    case "CORRECTION":
      return `Inventur durchgeführt, neuer Bestand ${entry.amount}`;
  }
}

function BookingStepLabel({
  entry,
  user,
}: {
  entry: ApiInventoryItemBookingEntry;
  user?: ApiUser;
}) {
  return (
    <>
      {formatDateTime(entry.bookedAt)} <UserLink user={user} />
    </>
  );
}

function BookingStepIndicator({
  type,
  status,
}: Pick<ApiInventoryItemBookingEntry, "type" | "status">) {
  const icon = status === "CANCELLED" ? BlockIcon : bookingTypeIcon[type];
  const color = status === "CANCELLED" ? "neutral" : indicatorColor[type];
  return (
    <TimelineEntryIndicator color={color}>
      {createElement(icon, { size: "md" })}
    </TimelineEntryIndicator>
  );
}

const Backdrop = styled("div")<{ show: boolean }>(({ theme, show }) => ({
  background: theme.palette.background.backdrop,
  position: "absolute",
  inset: 0,
  display: show ? "grid" : "none",
  placeItems: "center",
  userSelect: "none",
  borderRadius: "10px",
  zIndex: theme.zIndex.table,
}));
