/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.userflowmetrics;

import de.eshg.lib.userflowmetrics.persistence.UserFlow;
import de.eshg.lib.userflowmetrics.persistence.UserFlowRepository;
import de.eshg.lib.userflowmetrics.persistence.UserFlowType;
import de.eshg.rest.service.error.NotFoundException;
import java.time.Clock;
import java.time.Instant;
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
  public UUID startUserFlow(UserFlowType userFlowType) {
    UserFlow userFlow = new UserFlow();
    userFlow.setUserFlowType(userFlowType);
    userFlowRepository.save(userFlow);
    return userFlow.getExternalId();
  }

  @Transactional
  public void finishUserFlow(UUID id) {
    Instant end = Instant.now(clock);
    UserFlow userFlow =
        userFlowRepository
            .findByExternalId(id)
            .orElseThrow(
                () -> new NotFoundException("User flow with ID %s not found".formatted(id)));
    userFlow.setFlowEnd(end);
  }
}
