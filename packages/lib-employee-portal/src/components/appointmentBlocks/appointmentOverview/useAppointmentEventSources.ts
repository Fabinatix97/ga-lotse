/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  EventInput,
  EventSourceFuncArg,
  EventSourceInput,
} from "@fullcalendar/core/index.js";
import { useQueryClient } from "@tanstack/react-query";
import { addMinutes, compareAsc } from "date-fns";
import { useState } from "react";
import { first, last } from "remeda";

import { QueryKeyFactory } from "@eshg/lib-portal";

import { AppointmentBlockApi } from "../../../api/AppointmentBlockApi";
import {
  getAppointmentBlocks,
  getAppointmentBlocksForSingleDay,
  getAppointments,
} from "../../../api/queries/appointmentBlock";
import { AppointmentBlock } from "../AppointmentBlockGroup";

import {
  BACKGROUND_EVENT_MINUTES_OFFSET,
  TimeSlot,
  formatTimeSlotRange,
  shiftEventToVirtualTimeSlot,
} from "./helpers";

export interface AppointmentEvent
  extends Omit<EventInput, "extendedProps" | "start" | "end">, TimeSlot {
  extendedProps:
    | {
        type: "slot";
        appointmentBlockOrder: number;
        booked: boolean;
        appointmentBlockId?: string;
        appointmentId?: number;
        procedureId?: string;
      }
    | {
        type: "block";
        appointmentBlockId: string;
      };
}

export function useAppointmentEventSources(
  appointmentBlockApi: AppointmentBlockApi,
  queryKey: QueryKeyFactory,
) {
  const queryClient = useQueryClient();

  const [columnCount, setColumnCount] = useState(1);
  const [eventSources] = useState(
    () =>
      ({
        dayView: async function events(info: EventSourceFuncArg) {
          const data = await queryClient.fetchQuery(
            getAppointmentBlocksForSingleDay(
              appointmentBlockApi,
              queryKey,
              info.start,
            ),
          );
          const appointmentBlocks = data?.appointmentBlocks;
          if (!appointmentBlocks) return [];

          const columns =
            partitionAppointmentBlocksIntoColumns(appointmentBlocks);
          setColumnCount(Math.max(1, columns.length));
          return columns.flatMap((column, columnIndex) =>
            column.flatMap((appointmentBlock) =>
              mapAppointmentBlockToDetailedEvents(
                appointmentBlock,
                columnIndex,
              ),
            ),
          );
        },
        weekView: async function events(info: EventSourceFuncArg) {
          const data = await queryClient.fetchQuery(
            getAppointmentBlocks(
              appointmentBlockApi,
              queryKey,
              info.start,
              info.end,
            ),
          );
          const appointmentBlocks = data?.appointmentBlocks;
          if (!appointmentBlocks) return [];
          return appointmentBlocks.map(mapAppointmentBlockToEvent);
        },
        listView: async function events(info: EventSourceFuncArg) {
          const data = await queryClient.fetchQuery(
            getAppointments(
              appointmentBlockApi,
              queryKey,
              info.start,
              info.end,
            ),
          );
          const appointmentBlockSlots = data.appointmentBlockSlots;
          return appointmentBlockSlots.map((slot, index) =>
            mapAppointmentBlockSlotToEvent(slot, index, undefined),
          );
        },
      }) satisfies Record<string, EventSourceInput>,
  );

  return { eventSources, columnCount };
}

interface AppointmentBlockSlot {
  start: Date;
  end: Date;
  booked: boolean;
  information?: string;
  procedureId?: string;
  appointmentId?: number;
}

function partitionAppointmentBlocksIntoColumns(
  appointmentBlocks: AppointmentBlock[],
) {
  if (appointmentBlocks.length === 0) return [];
  appointmentBlocks.sort((a, b) => compareAppointmentBlocks(a, b, "start"));

  function extractEventTitles({ appointmentBlockBins }: AppointmentBlock) {
    return appointmentBlockBins?.flatMap((bin) =>
      bin.appointmentBlockSlots.map(mapTitle),
    );
  }

  function compareAppointmentBlocks(
    blockA: AppointmentBlock,
    blockB: AppointmentBlock,
    dateKey: "start" | "end",
  ) {
    const result = compareAsc(blockA[dateKey], blockB[dateKey]);
    if (result !== 0) {
      return result;
    }

    // Use the visible event titles to create a stable event order
    const identifierA = extractEventTitles(blockA)?.join() ?? "";
    const identifierB = extractEventTitles(blockB)?.join() ?? "";
    return identifierA.localeCompare(identifierB);
  }

  type AppointmentBlockColumn = [AppointmentBlock, ...AppointmentBlock[]];
  const columns: AppointmentBlockColumn[] = [];
  for (const block of appointmentBlocks) {
    let assigned = false;
    for (const column of columns) {
      const blockEndDateWithOffset = addMinutes(
        last(column).end,
        BACKGROUND_EVENT_MINUTES_OFFSET,
      );
      if (compareAsc(blockEndDateWithOffset, block.start) <= 0) {
        assigned = true;
        column.push(block);
        break;
      }
    }

    if (!assigned) {
      columns.push([block]);
    }
    columns.sort((colA, colB) =>
      compareAppointmentBlocks(last(colA), last(colB), "end"),
    );
  }

  columns.sort((colA, colB) =>
    compareAppointmentBlocks(first(colA), first(colB), "start"),
  );
  return columns;
}

function mapAppointmentBlockToDetailedEvents(
  appointmentBlock: AppointmentBlock,
  index: number,
): AppointmentEvent[] {
  const virtualDaysOffset = index;

  const backgroundEvent = {
    title: `Terminblock ${formatTimeSlotRange(appointmentBlock)}`,
    display: "background",
    color: "#C7DFF799",
    start: appointmentBlock.start,
    end: appointmentBlock.end,
    extendedProps: {
      type: "block",
      appointmentBlockId: appointmentBlock.id,
    },
  } satisfies AppointmentEvent;

  const flatAppointmentBlockSlotEvents =
    appointmentBlock.appointmentBlockBins?.flatMap(
      ({ appointmentBlockSlots }, index) =>
        appointmentBlockSlots.map((slot) =>
          mapAppointmentBlockSlotToEvent(slot, index, appointmentBlock.id),
        ),
    );

  return [backgroundEvent, ...(flatAppointmentBlockSlotEvents ?? [])].map(
    (event) => shiftEventToVirtualTimeSlot(event, virtualDaysOffset),
  );
}

function mapAppointmentBlockToEvent(
  appointmentBlock: AppointmentBlock,
): AppointmentEvent {
  return {
    start: appointmentBlock.start,
    end: appointmentBlock.end,
    title: formatTimeSlotRange(appointmentBlock),
    color: "#1F7A1F",
    extendedProps: {
      type: "block",
      appointmentBlockId: appointmentBlock.id,
    },
  };
}

function mapAppointmentBlockSlotToEvent(
  appointmentSlot: AppointmentBlockSlot,
  order: number,
  appointmentBlockId: string | undefined,
): AppointmentEvent {
  return {
    start: appointmentSlot.start,
    end: appointmentSlot.end,
    title: mapTitle(appointmentSlot),
    color: appointmentSlot.booked ? "#0B6BCB" : "#1F7A1F",
    extendedProps: {
      type: "slot",
      booked: appointmentSlot.booked,
      appointmentBlockOrder: order,
      appointmentId: appointmentSlot.appointmentId,
      appointmentBlockId: appointmentBlockId,
      procedureId: appointmentSlot.procedureId,
    },
  };
}

function mapTitle(appointmentSlot: AppointmentBlockSlot) {
  return appointmentSlot.booked
    ? (appointmentSlot.information ?? "Termin")
    : "Leer";
}
