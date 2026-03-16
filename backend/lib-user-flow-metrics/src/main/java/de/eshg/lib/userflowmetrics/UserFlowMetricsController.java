/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.userflowmetrics;

import de.eshg.lib.common.BusinessModule;
import de.eshg.lib.userflowmetrics.api.GetUserFlowMetricsResponse;
import de.eshg.lib.userflowmetrics.api.UserFlowMetric;
import de.eshg.lib.userflowmetrics.api.UserFlowMetricsApi;
import de.eshg.lib.userflowmetrics.persistence.UserFlow;
import de.eshg.lib.userflowmetrics.persistence.UserFlowRepository;
import de.eshg.lib.userflowmetrics.persistence.UserFlowType;
import de.eshg.lib.userflowmetrics.spring.UserFlowMetricsProperties;
import de.eshg.rest.service.error.BadRequestException;
import io.swagger.v3.oas.annotations.Hidden;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Set;
import java.util.concurrent.atomic.AtomicLong;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RestController;

@Hidden
@RestController
public class UserFlowMetricsController implements UserFlowMetricsApi {
  private static final Logger log = LoggerFactory.getLogger(UserFlowMetricsController.class);

  private final Clock clock;
  private final Duration countAsAbortedAfter;
  private final UserFlowRepository userFlowRepository;
  private final BusinessModule businessModule;

  public UserFlowMetricsController(
      Clock clock,
      UserFlowMetricsProperties properties,
      UserFlowRepository userFlowRepository,
      BusinessModule businessModule) {
    this.clock = clock;
    this.countAsAbortedAfter = properties.getCountAsAbortedAfterMinutes();
    this.userFlowRepository = userFlowRepository;
    this.businessModule = businessModule;
  }

  @Override
  @Transactional(readOnly = true)
  public GetUserFlowMetricsResponse getUserFlowMetrics(
      Instant timeRangeStart, Instant timeRangeEnd) {
    validateStartBeforeEnd(timeRangeStart, timeRangeEnd);
    Instant now = Instant.now(clock);
    Set<UserFlowType> distinctUserFlowTypes = userFlowRepository.findDistinctUserFlowTypes();

    return new GetUserFlowMetricsResponse(
        distinctUserFlowTypes.stream()
            .map(type -> getUserFlowMetricForType(now, type, timeRangeStart, timeRangeEnd))
            .sorted(Comparator.comparing(UserFlowMetric::userFlowType))
            .toList());
  }

  private static void validateStartBeforeEnd(Instant start, Instant end) {
    if (start.isAfter(end)) {
      throw new BadRequestException("End before start");
    }
  }

  private UserFlowMetric getUserFlowMetricForType(
      Instant now, UserFlowType type, Instant timeRangeStart, Instant timeRangeEnd) {
    AtomicLong total = new AtomicLong(0);
    AtomicLong noDuration = new AtomicLong(0);
    List<Duration> durations = new ArrayList<>();
    userFlowRepository
        .findByUserFlowTypeAndFlowStartBetween(type, timeRangeStart, timeRangeEnd)
        .forEach(
            userFlow -> {
              if (userFlowRelevant(now, countAsAbortedAfter, userFlow)) {
                total.getAndIncrement();
                if (userFlow.getFlowEnd() == null) {
                  noDuration.getAndIncrement();
                } else {
                  durations.add(Duration.between(userFlow.getFlowStart(), userFlow.getFlowEnd()));
                }
              }
            });

    String averageDuration = getAverageDuration(durations, type, timeRangeStart, timeRangeEnd);

    return new UserFlowMetric(
        businessModule,
        UserFlowTypeMapper.mapToApi(type),
        total.get(),
        averageDuration,
        noDuration.get());
  }

  private static boolean userFlowRelevant(
      Instant now, Duration countAsAbortedAfter, UserFlow userFlow) {
    return userFlow.getFlowEnd() != null
        || !userFlow.getFlowStart().plus(countAsAbortedAfter).isAfter(now);
  }

  private static String getAverageDuration(
      List<Duration> durations, UserFlowType type, Instant timeRangeStart, Instant timeRangeEnd) {
    if (durations.isEmpty()) {
      return null;
    }
    Duration averageDuration =
        Duration.ofMinutes(
            Math.round(durations.stream().mapToLong(Duration::toMinutes).average().orElseThrow()));
    if (isValidDuration(averageDuration)) {
      return averageDuration.toString();
    } else {
      log.warn(
          "Negative duration for type of '{}' from '{}' to '{}'",
          type,
          timeRangeStart,
          timeRangeEnd);
      return null;
    }
  }

  /*
   * Duration.isNegative only checks the seconds, not the nanos
   */
  private static boolean isValidDuration(Duration duration) {
    return duration.isZero() || duration.isPositive();
  }
}
