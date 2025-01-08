/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.testhelper;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.time.Period;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.Objects;
import java.util.concurrent.atomic.AtomicReference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.Assert;

public class TestHelperClock extends Clock {

  public static final Instant DEFAULT_TEST_INSTANT = Instant.parse("2024-02-01T00:00:00.123456Z");

  private static final Logger log = LoggerFactory.getLogger(TestHelperClock.class);

  private final AtomicReference<Instant> instant;
  private final ZoneId zone;

  public TestHelperClock() {
    this(DEFAULT_TEST_INSTANT, ZoneOffset.UTC);
  }

  private TestHelperClock(Instant instant, ZoneId zone) {
    this.instant = new AtomicReference<>(instant);
    this.zone = zone;
  }

  public static TestHelperClock defaultBerlin() {
    return new TestHelperClock(DEFAULT_TEST_INSTANT, ZoneId.of("Europe/Berlin"));
  }

  @Override
  public ZoneId getZone() {
    return zone;
  }

  @Override
  public Clock withZone(ZoneId zone) {
    Objects.requireNonNull(zone);
    if (zone.equals(this.zone)) {
      return this;
    }
    return new TestHelperClock(instant.get(), this.zone);
  }

  @Override
  public Instant instant() {
    return instant.get();
  }

  public ZonedDateTime now() {
    return ZonedDateTime.ofInstant(this.instant(), this.zone);
  }

  public void changeToInstant(Instant instant) {
    this.instant.set(instant);
    log.info("Setting test time to {}", instant);
  }

  public void changeToDate(LocalDate localDate) {
    changeToInstant(localDate.atStartOfDay(zone).toInstant());
  }

  public void reset() {
    changeToInstant(DEFAULT_TEST_INSTANT);
  }

  public void windForward(Period period, Duration duration) {
    if (!period.isZero()) {
      windForward(period);
    }
    if (!duration.isZero()) {
      windForward(duration);
    }
  }

  public void windForward(Period period) {
    assertPeriodIsNotNegative(period);
    ZonedDateTime now = ZonedDateTime.now(this);
    ZonedDateTime target = now.plus(period);
    windForward(Duration.between(now, target));
  }

  public void windForward(Duration duration) {
    if (duration.isNegative()) {
      throw new IllegalArgumentException(
          String.format("Cannot wind clock *forward* by a negative duration: %s", duration));
    }
    Instant newInstant = instant.updateAndGet(i -> i.plus(duration));
    log.info("Winding test time forward to {}", newInstant);
  }

  public void windForwardSeconds(int seconds) {
    this.windForward(Duration.ofSeconds(seconds));
  }

  public void windForwardHours(int hours) {
    this.windForward(Duration.ofHours(hours));
  }

  public void windForwardDays(int days) {
    this.windForward(Period.ofDays(days));
  }

  private static void assertPeriodIsNotNegative(Period period) {
    Assert.isTrue(!period.isNegative() && !period.isZero(), () -> "Illegal period: " + period);
  }

  public void windBack(Period period) {
    assertPeriodIsNotNegative(period);
    ZonedDateTime now = ZonedDateTime.now(this);
    ZonedDateTime target = now.minus(period);
    windBack(Duration.between(target, now));
  }

  public void windBack(Duration duration) {
    if (duration.isNegative()) {
      throw new IllegalArgumentException(
          String.format("Cannot wind clock *backward* by a negative duration: %s", duration));
    }
    Instant newInstant = instant.updateAndGet(i -> i.minus(duration));
    log.info("Winding test time back to {}", newInstant);
  }

  public void windBackSeconds(int seconds) {
    this.windBack(Duration.ofSeconds(seconds));
  }

  public void windBackHours(int hours) {
    this.windBack(Duration.ofHours(hours));
  }

  public void windBackDays(int days) {
    this.windBack(Period.ofDays(days));
  }
}
