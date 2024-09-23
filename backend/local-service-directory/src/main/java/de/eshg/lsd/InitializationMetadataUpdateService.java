/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lsd;

import de.eshg.lib.servicedirectory.ServiceDirectoryApi;
import de.eshg.lib.servicedirectory.api.ActorMetadataDto;
import de.eshg.lib.servicedirectory.api.ActorResponseDto;
import java.time.Instant;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.retry.RetryContext;
import org.springframework.retry.support.RetryTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;

@Service
public class InitializationMetadataUpdateService {

  private static final Logger log =
      LoggerFactory.getLogger(InitializationMetadataUpdateService.class);

  private final ServiceDirectoryApi serviceDirectoryApi;

  private final RetryTemplate retryTemplate =
      RetryTemplate.builder()
          .maxAttempts(3)
          .fixedBackoff(1000)
          .retryOn(HttpClientErrorException.class)
          .build();

  public InitializationMetadataUpdateService(ServiceDirectoryApi serviceDirectoryApi) {
    this.serviceDirectoryApi = serviceDirectoryApi;
  }

  @EventListener(ApplicationReadyEvent.class)
  void applicationInitialized() {
    new Thread(this::trySendMyMetadata).start();
  }

  private void trySendMyMetadata() {
    Instant now = Instant.now();
    String content = "{\"timeStarted\": \"" + now.toString() + "\"}";
    ActorMetadataDto metadata = new ActorMetadataDto(null, content, now);
    retryTemplate.execute(
        context -> serviceDirectoryApi.updateActorMetadata(metadata),
        InitializationMetadataUpdateService::failedToSend);
  }

  private static ActorResponseDto failedToSend(RetryContext context) {
    log.warn(
        "could not update my metadata - service directory might not be reachable (yet) or my common name is incorrect, will continue nevertheless...",
        context.getLastThrowable());
    return null;
  }
}
