/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.testhelper;

import de.eshg.base.feature.BaseFeature;
import de.eshg.base.feature.BaseFeatureTogglesApi;
import de.eshg.measlesprotection.MeaslesProtectionProperties;
import de.eshg.measlesprotection.polytune.PolytuneMeaslesVaccinationCheckApi;
import de.eshg.measlesprotection.polytune.PolytuneMeaslesVaccinationCheckResponse;
import de.eshg.measlesprotection.polytune.PolytuneMeaslesVaccinationCheckResult;
import de.eshg.measlesprotection.polytune.PolytuneMeaslesVaccinationCheckStatus;
import de.eshg.measlesprotection.polytune.PolytuneScheduleMeaslesVaccinationCheckRequest;
import de.eshg.measlesprotection.testhelper.PolytuneMockInteraction.GetResult;
import de.eshg.measlesprotection.testhelper.PolytuneMockInteraction.Schedule;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.InternalServerErrorException;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.testhelper.TestHelperServiceResetAction;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@Order(90)
public class PolytuneMock
    implements PolytuneMeaslesVaccinationCheckApi, TestHelperServiceResetAction {

  private boolean initialized;
  private Map<UUID, PolytuneMeaslesVaccinationCheckResult> resultsByFileStateId;
  private Map<UUID, ScheduledProcess> scheduledProcesses;
  private List<PolytuneMockInteraction> interactions;
  private Duration calculationTime;
  private PolytuneMockSimulateErrorRequest errorToSimulate;

  private final BaseFeatureTogglesApi baseFeatureTogglesApi;
  private final MeaslesProtectionProperties properties;
  private final Clock clock;

  public PolytuneMock(
      BaseFeatureTogglesApi baseFeatureTogglesApi,
      MeaslesProtectionProperties properties,
      Clock clock) {
    this.baseFeatureTogglesApi = baseFeatureTogglesApi;
    this.properties = properties;
    this.clock = clock;
    clear();
  }

  @Override
  public void schedule(PolytuneScheduleMeaslesVaccinationCheckRequest request) {
    assertFeatureTogglesEnabledAndMockInitialized();
    simulateErrorIfPresent();
    processInteraction(mockSchedule(request));
  }

  @Override
  public PolytuneMeaslesVaccinationCheckResponse getResult(UUID requestId) {
    assertFeatureTogglesEnabledAndMockInitialized();
    simulateErrorIfPresent();
    return processGetResultInteraction(mockGetResult(requestId));
  }

  @Override
  public void reset() {
    clear();
  }

  void initialize(PolytuneMockIntitializeRequest request) {
    initialized = true;
    resultsByFileStateId = request.results();
    scheduledProcesses = new HashMap<>();
    interactions = new ArrayList<>();
    calculationTime = request.calculationTime();
  }

  void simulateError(PolytuneMockSimulateErrorRequest errorToSimulate) {
    initialized = true;
    this.errorToSimulate = errorToSimulate;
  }

  List<PolytuneMockInteraction> getInteractions() {
    return interactions;
  }

  private void clear() {
    initialized = false;
    resultsByFileStateId = new HashMap<>();
    scheduledProcesses = new HashMap<>();
    interactions = new ArrayList<>();
    calculationTime = Duration.ZERO;
  }

  private PolytuneMockInteraction.Schedule mockSchedule(
      PolytuneScheduleMeaslesVaccinationCheckRequest request) {
    if (scheduledProcesses.containsKey(request.requestId())) {
      return new Schedule(Instant.now(clock), PolytuneMockHttpStatus.BAD_REQUEST, request);
    }
    scheduledProcesses.put(
        request.requestId(),
        new ScheduledProcess(
            getResult(request.fileStateIds()), Instant.now(clock).plus(calculationTime)));
    return new Schedule(Instant.now(clock), PolytuneMockHttpStatus.OK, request);
  }

  private PolytuneMeaslesVaccinationCheckResult getResult(List<UUID> fileStateIds) {
    List<PolytuneMeaslesVaccinationCheckResult> results =
        fileStateIds.stream()
            .filter(resultsByFileStateId::containsKey)
            .map(resultsByFileStateId::get)
            .distinct()
            .toList();
    if (results.size() == 1) {
      return results.getFirst();
    } else {
      return null;
    }
  }

  private PolytuneMockInteraction.GetResult mockGetResult(UUID requestId) {
    if (scheduledProcesses.containsKey(requestId)) {
      if (scheduledProcesses.get(requestId).finishingTime.isAfter(Instant.now(clock))) {
        return new GetResult(
            Instant.now(clock),
            PolytuneMockHttpStatus.OK,
            requestId,
            new PolytuneMeaslesVaccinationCheckResponse(
                PolytuneMeaslesVaccinationCheckStatus.PENDING, null));
      } else {
        return new GetResult(
            Instant.now(clock),
            PolytuneMockHttpStatus.OK,
            requestId,
            new PolytuneMeaslesVaccinationCheckResponse(
                PolytuneMeaslesVaccinationCheckStatus.COMPLETED,
                scheduledProcesses.get(requestId).eventualResult()));
      }
    } else {
      return new GetResult(Instant.now(clock), PolytuneMockHttpStatus.NOT_FOUND, requestId, null);
    }
  }

  private PolytuneMeaslesVaccinationCheckResponse processGetResultInteraction(
      PolytuneMockInteraction.GetResult interaction) {
    return processInteraction(interaction).response();
  }

  private <T extends PolytuneMockInteraction> T processInteraction(T interaction) {
    interactions.add(interaction);
    switch (interaction.httpStatus()) {
      case OK -> {
        return interaction;
      }
      case BAD_REQUEST -> throw new BadRequestException("Mock returns 400 Bad Request");
      case NOT_FOUND -> throw new NotFoundException("Mock returns 404 Not Found");
      default ->
          throw new IllegalStateException("Unexpected http status in polytune mock interaction");
    }
  }

  private void simulateErrorIfPresent() {
    if (errorToSimulate != null) {
      RuntimeException exception =
          switch (errorToSimulate.errorType()) {
            case BAD_REQUEST -> new BadRequestException(errorToSimulate.errorMessage());
            case NOT_FOUND -> new NotFoundException(errorToSimulate.errorMessage());
            case INTERNAL_SERVER_ERROR ->
                new InternalServerErrorException(errorToSimulate.errorMessage());
          };
      errorToSimulate = null;
      throw exception;
    }
  }

  private void assertFeatureTogglesEnabledAndMockInitialized() {
    if (!baseFeatureTogglesApi
        .getFeatureToggles()
        .enabledNewFeatures()
        .contains(BaseFeature.VACCINATION_CHECK)) {
      throw new IllegalStateException(
          "Trying to call polytune mock: Feature toggle VACCINATION_CHECK not enabled");
    }
    if (!properties.isPolytuneActive()) {
      throw new IllegalStateException("Trying to call polytune mock: POLYTUNE is not active");
    }
    if (!initialized) {
      throw new IllegalStateException("Trying to call polytune mock: Mock not initialized");
    }
  }

  private record ScheduledProcess(
      PolytuneMeaslesVaccinationCheckResult eventualResult, Instant finishingTime) {}
}
