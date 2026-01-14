/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.testhelper;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import de.eshg.measlesprotection.polytune.PolytuneMeaslesVaccinationCheckResponse;
import de.eshg.measlesprotection.polytune.PolytuneScheduleMeaslesVaccinationCheckRequest;
import de.eshg.measlesprotection.testhelper.PolytuneMockInteraction.GetResult;
import de.eshg.measlesprotection.testhelper.PolytuneMockInteraction.Schedule;
import jakarta.validation.Valid;
import java.time.Instant;
import java.util.UUID;

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "@type")
@JsonSubTypes({
  @JsonSubTypes.Type(value = Schedule.class, name = "Schedule"),
  @JsonSubTypes.Type(value = GetResult.class, name = "GetResult")
})
public sealed interface PolytuneMockInteraction permits Schedule, GetResult {

  Instant time();

  PolytuneMockHttpStatus httpStatus();

  record Schedule(
      Instant time,
      PolytuneMockHttpStatus httpStatus,
      @Valid PolytuneScheduleMeaslesVaccinationCheckRequest request)
      implements PolytuneMockInteraction {}

  record GetResult(
      Instant time,
      PolytuneMockHttpStatus httpStatus,
      UUID requestId,
      @Valid PolytuneMeaslesVaccinationCheckResponse response)
      implements PolytuneMockInteraction {}
}
