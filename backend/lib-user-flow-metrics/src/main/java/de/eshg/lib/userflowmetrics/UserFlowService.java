/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.userflowmetrics;

import de.eshg.lib.userflowmetrics.api.GetStartUserFlowTrackingResponse;
import de.eshg.lib.userflowmetrics.api.UserFlowTypeDto;
import de.eshg.lib.userflowmetrics.persistence.UserFlow;
import de.eshg.lib.userflowmetrics.persistence.UserFlowRepository;
import java.time.Clock;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserFlowService {
  private final Clock clock;
  private final UserFlowRepository userFlowRepository;

  public UserFlowService(Clock clock, UserFlowRepository userFlowRepository) {
    this.clock = clock;
    this.userFlowRepository = userFlowRepository;
  }

  @Transactional
  public GetStartUserFlowTrackingResponse startUserFlow(UserFlowTypeDto userFlowType) {
    UserFlow userFlow = new UserFlow();
    userFlow.setUserFlowType(UserFlowTypeMapper.mapToDomain(userFlowType));
    userFlowRepository.save(userFlow);
    return new GetStartUserFlowTrackingResponse(userFlow.getExternalId());
  }

  @Transactional
  public void finishUserFlow(UUID id) {
    if (id == null) {
      return;
    }
    Instant end = Instant.now(clock);
    Optional<UserFlow> userFlowOptional = userFlowRepository.findByExternalId(id);
    userFlowOptional.ifPresent(
        userFlow -> {
          if (userFlow.getFlowEnd() == null) {
            userFlow.setFlowEnd(end);
          }
        });
  }
}
