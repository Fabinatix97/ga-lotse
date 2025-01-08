/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.calendar;

import com.google.common.annotations.VisibleForTesting;
import com.google.common.base.Suppliers;
import de.eshg.base.calendar.api.DetailedEventWithoutCalendarId;
import de.eshg.base.calendar.api.EventMetaData;
import de.eshg.base.calendar.api.EventTimeData;
import de.eshg.base.calendar.api.EventTypeDto;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.time.*;
import java.util.*;
import java.util.function.Supplier;
import java.util.stream.Stream;
import net.fortuna.ical4j.data.CalendarBuilder;
import net.fortuna.ical4j.data.ParserException;
import net.fortuna.ical4j.model.*;
import net.fortuna.ical4j.model.Calendar;
import net.fortuna.ical4j.model.Period;
import net.fortuna.ical4j.model.component.VEvent;
import org.springframework.core.env.Environment;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Component;

@Component
public final class RegionalHolidayCalendar {

  public static final UUID HOLIDAY_CALENDAR_ID =
      UUID.fromString("7ef1e6c5-fffe-4e10-a6cf-b858ab4f568b");
  public static final String HOLIDAY_CALENDAR_NAME = "Feiertage Hessen";
  private final ResourceLoader loader;
  private final Environment env;
  private final Clock clock;

  private Supplier<Calendar> calendarSource;

  public RegionalHolidayCalendar(ResourceLoader loader, Environment env, Clock clock) {
    this.loader = loader;
    this.env = env;
    this.clock = clock;
    reset();
  }

  @VisibleForTesting
  void reset() {
    this.calendarSource =
        Suppliers.memoize(
            () -> {
              try (InputStream calendarIcs =
                  loader
                      .getResource(
                          env.getProperty(
                              "eshg.calendar.regional-holiday-ics-path",
                              "classpath:calendar/hessian-public-holidays.ics"))
                      .getInputStream()) {
                return new CalendarBuilder().build(calendarIcs);
              } catch (IOException | ParserException e) {
                throw new IllegalArgumentException(
                    "The configured holiday calender could not be parsed.", e);
              }
            });
  }

  List<DetailedEventWithoutCalendarId> findByDateRangeAndCalendarId(
      Instant startTimeStamp, Instant endTimeStamp) {
    LocalDate requestedStart = toLocalDate(startTimeStamp);
    LocalDate requestedEnd = toLocalDate(endTimeStamp);

    return calendarSource.get().getComponents().stream()
        .filter(VEvent.class::isInstance)
        .map(VEvent.class::cast)
        .flatMap(baseEvent -> materializeRecurrentEvents(baseEvent, requestedStart, requestedEnd))
        .toList();
  }

  private LocalDate toLocalDate(Instant instant) {
    return instant.atZone(clock.getZone()).toLocalDate();
  }

  private Stream<DetailedEventWithoutCalendarId> materializeRecurrentEvents(
      VEvent event, LocalDate requestedStart, LocalDate requestedEnd) {
    Set<Period<LocalDate>> periods =
        event.calculateRecurrenceSet(new Period<>(requestedStart, requestedEnd.plusDays(1)));
    return periods.stream().map(period -> convert(period, event));
  }

  private DetailedEventWithoutCalendarId convert(Period<LocalDate> period, VEvent periodSource) {
    ZonedDateTime start = toStartOfDayInGermany(period.getStart());
    ZonedDateTime end = toStartOfDayInGermany(period.getEnd()).minusSeconds(1);

    return new DetailedEventWithoutCalendarId(
        UUID.nameUUIDFromBytes(
            (periodSource.getProperty(Property.UID).orElseThrow().getValue() + start + end)
                .getBytes(StandardCharsets.UTF_8)),
        EventTypeDto.HOLIDAY,
        null,
        new EventMetaData(
            periodSource.getProperty(Property.SUMMARY).orElseThrow().getValue(),
            null,
            null,
            null,
            null),
        new EventTimeData(start.toInstant(), end.toInstant(), true));
  }

  private ZonedDateTime toStartOfDayInGermany(LocalDate dateTime) {
    return dateTime.atStartOfDay(clock.getZone());
  }
}
