/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection;

import de.eshg.measlesprotection.polytune.PolytuneMeaslesVaccinationCheckApi;
import de.eshg.measlesprotection.polytune.PolytuneMeaslesVaccinationCheckResponse;
import de.eshg.measlesprotection.polytune.PolytuneMeaslesVaccinationCheckResult;
import de.eshg.measlesprotection.polytune.PolytuneMeaslesVaccinationCheckStatus;
import de.eshg.measlesprotection.polytune.PolytuneScheduleMeaslesVaccinationCheckRequest;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class PolytuneClient {

  private static final Logger log = LoggerFactory.getLogger(PolytuneClient.class);

  private final PolytuneMeaslesVaccinationCheckApi polytuneApi;

  public PolytuneClient(PolytuneMeaslesVaccinationCheckApi polytuneApi) {
    this.polytuneApi = polytuneApi;
  }

  public UUID requestUpdate(List<UUID> fileStateIds) {
    UUID requestId = UUID.randomUUID();
    polytuneApi.schedule(
        new PolytuneScheduleMeaslesVaccinationCheckRequest(requestId, fileStateIds));
    return requestId;
  }

  public Optional<PolytuneMeaslesVaccinationCheckResult> getResultIfCompleted(UUID requestId) {
    return getResult(requestId)
        .filter(this::completed)
        .map(PolytuneMeaslesVaccinationCheckResponse::result);
  }

  private boolean completed(PolytuneMeaslesVaccinationCheckResponse response) {
    return response.status() == PolytuneMeaslesVaccinationCheckStatus.COMPLETED;
  }

  private Optional<PolytuneMeaslesVaccinationCheckResponse> getResult(UUID requestId) {
    try {
      return Optional.of(polytuneApi.getResult(requestId));
    } catch (Exception e) {
      log.error(
          "Error when trying to get polytune result for requestId %s".formatted(requestId), e);
      return Optional.empty();
    }
  }
}
