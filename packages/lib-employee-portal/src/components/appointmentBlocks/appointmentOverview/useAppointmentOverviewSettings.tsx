/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  CalendarOptions,
  DayHeaderContentArg,
  EventClickArg,
  EventContentArg,
  formatDate,
} from "@fullcalendar/core/index.js";
import { VerboseFormattingArg } from "@fullcalendar/core/internal";
import deLocale from "@fullcalendar/core/locales/de";
import listPlugin from "@fullcalendar/list";
import FullCalendar from "@fullcalendar/react";
import { SxProps } from "@mui/joy/styles/types";
import { format } from "date-fns";
import {
  ComponentPropsWithRef,
  RefObject,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { isNonNullish } from "remeda";

import {
  LoadingIndicator,
  QueryKeyFactory,
  formatDateToFullReadableString,
} from "@eshg/lib-portal";

import { AppointmentBlockApi } from "../../../api/AppointmentBlockApi";
import { CalendarHeaderToolbarProps } from "../../calendar/CalendarHeaderToolbar";

import { ListEventContent, TimeGridEventContent } from "./EventContent";
import {
  appointmentCalendarSxProps,
  dayViewColumnsSxProps,
} from "./appointmentCalendarSxProps";
import {
  appointmentTimeGridPlugin,
  goToNext,
  goToPrevious,
} from "./appointmentTimeGridPlugin";
import { AppointmentViewType, AppointmentViewTypes } from "./appointmentViews";
import { renderToolbarNavigationLabel } from "./helpers";
import { useAppointmentEventSources } from "./useAppointmentEventSources";

interface FullCalendarViewState {
  type: AppointmentViewType;
  title?: string;
}

export interface CalendarHandle {
  refetchEvents: () => void;
}
export type CalendarHandleRef = RefObject<CalendarHandle | null>;
interface UseAppointmentOverviewOptions {
  onEventClick: (arg: EventClickArg) => void;
  ref: CalendarHandleRef;
  appointmentBlockApi: AppointmentBlockApi;
  appointmentBlockApiQueryKey: QueryKeyFactory;
}
interface AppointmentOverviewSettings {
  fullCalendarProps: ComponentPropsWithRef<typeof FullCalendar>;
  toolbarProps: CalendarHeaderToolbarProps<AppointmentViewType>;
  calendarWrapperSx: SxProps;
}
export function useAppointmentOverviewSettings({
  appointmentBlockApi,
  appointmentBlockApiQueryKey,
  ...options
}: UseAppointmentOverviewOptions): AppointmentOverviewSettings {
  const fullCalendarRef = useRef<FullCalendar>(null);
  const [eventsLoading, setEventsLoading] = useState<boolean>(false);
  const { eventSources, columnCount } = useAppointmentEventSources(
    appointmentBlockApi,
    appointmentBlockApiQueryKey,
  );

  useImperativeHandle(
    options.ref,
    () => ({
      refetchEvents() {
        fullCalendarRef.current?.getApi().refetchEvents();
      },
    }),
    [],
  );
  // FullCalendar is an uncontrolled component and should manage most of its state internally.
  // Though, we want to pass the title and viewType to the HeaderToolbar, so we need to synchronize FullCalendar's state with our own.
  const [fullCalendarView, setFullCalendarView] =
    useState<FullCalendarViewState>({ type: AppointmentViewTypes.TimeGridDay });
  const showWeekNumbers =
    fullCalendarView.type === AppointmentViewTypes.TimeGridWeek;

  setupKeyboardAccessForScrollableRegion();

  return {
    fullCalendarProps: {
      ref: fullCalendarRef,
      plugins: [appointmentTimeGridPlugin, listPlugin],
      initialView: fullCalendarView.type,
      eventSources: [eventSources.dayView],
      lazyFetching: false,
      eventClick: options.onEventClick,
      locale: deLocale,
      loading: setEventsLoading,
      datesSet: ({ view }) => {
        setFullCalendarView({
          title: view.title,
          type: view.type as FullCalendarViewState["type"],
        });
      },

      views: DEFAULT_VIEW_OPTIONS,
      weekNumbers: showWeekNumbers,
      scrollTime: format(new Date(), "HH:00:00"),
      slotDuration: "01:00",
      defaultRangeSeparator: " bis ",
      slotLabelFormat: { hour: "numeric", minute: "2-digit" },
      eventContent: renderEventContent,
      dayHeaderContent: renderDayHeader,
      noEventsContent: renderNoEventsContent(eventsLoading),
      allDaySlot: false,
      headerToolbar: false,
    },
    toolbarProps: {
      title: fullCalendarView.title,
      viewType: fullCalendarView.type,
      goToToday: function (): void {
        fullCalendarRef.current?.getApi().today();
      },
      goToPrevious: function (): void {
        goToPrevious(fullCalendarRef.current?.getApi());
      },
      goToNext: function (): void {
        goToNext(fullCalendarRef.current?.getApi());
      },
      onViewTypeChange: function (viewType: AppointmentViewType): void {
        queueMicrotask(() => {
          const api = fullCalendarRef.current?.getApi();
          if (api) {
            api.removeAllEventSources();
            api.changeView(viewType);

            if (viewType === AppointmentViewTypes.TimeGridDay) {
              api.addEventSource(eventSources.dayView);
            } else if (viewType === AppointmentViewTypes.TimeGridWeek) {
              api.addEventSource(eventSources.weekView);
            } else {
              api.addEventSource(eventSources.listView);
            }
          }
        });
      },
      renderNavigationLabel: renderToolbarNavigationLabel,
      options: [
        { value: AppointmentViewTypes.TimeGridDay, label: "Tag" },
        { value: AppointmentViewTypes.TimeGridWeek, label: "Woche" },
        { value: AppointmentViewTypes.ListMonth, label: "Terminübersicht" },
      ],
    },
    calendarWrapperSx: [
      appointmentCalendarSxProps,
      dayViewColumnsSxProps(columnCount ?? 0),
    ],
  };
}

const DEFAULT_VIEW_OPTIONS: CalendarOptions["views"] = {
  week: {
    titleFormat: { year: "numeric", month: "long", day: "numeric" },
    dayHeaderFormat: { weekday: "short", day: "numeric", omitCommas: true },
  },
  timeGridDay: {
    eventOrder: "appointmentBlockOrder",
    titleFormat(info: VerboseFormattingArg) {
      return formatDate(info.date.marker, {
        locale: deLocale.code,
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
  },
};

function renderEventContent(eventInfo: EventContentArg) {
  const isListView = eventInfo.view.type === AppointmentViewTypes.ListMonth;
  return isListView ? (
    <ListEventContent info={eventInfo} />
  ) : (
    <TimeGridEventContent info={eventInfo} />
  );
}

function renderDayHeader(info: DayHeaderContentArg) {
  const date =
    info.view.type === AppointmentViewTypes.TimeGridDay ||
    info.view.type === AppointmentViewTypes.ListMonth
      ? formatDateToFullReadableString(info.date)
      : info.text;
  return date.replaceAll(".", "");
}

function renderNoEventsContent(eventsLoading: boolean) {
  return eventsLoading ? <LoadingIndicator /> : <>Keine Termine vorhanden</>;
}

function setupKeyboardAccessForScrollableRegion() {
  const element = document.getElementsByClassName("fc-timegrid-slots")[0];
  if (isNonNullish(element)) {
    element.setAttribute("tabindex", "0");
  }
}
