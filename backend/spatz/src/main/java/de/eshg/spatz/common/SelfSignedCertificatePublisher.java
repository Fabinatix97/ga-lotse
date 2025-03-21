/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.spatz.common;

import de.eshg.lsd.register.api.ActorTypeDto;
import de.eshg.lsd.register.api.AnnounceRequest;
import de.eshg.lsd.register.api.LsdActorApi;
import de.eshg.spatz.config.SelfSignedCertificateLatch;
import java.time.Duration;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.retry.support.RetryTemplate;

public class SelfSignedCertificatePublisher {

  private static final Logger logger =
      LoggerFactory.getLogger(SelfSignedCertificatePublisher.class);
  private final LsdActorApi lsdApi;

  private final SelfSignedCertificateLatch latch;
  private final String readableName;

  private final ActorTypeDto type;

  public SelfSignedCertificatePublisher(
      LsdActorApi lsdApi,
      SelfSignedCertificateLatch latch,
      String readableName,
      ActorTypeDto type) {
    this.lsdApi = lsdApi;
    this.latch = latch;
    this.readableName = readableName;
    this.type = type;
    logger.info("creating {}", getClass());
  }

  public void publishServerCertificates(String certificate) {
    RetryTemplate.builder()
        .fixedBackoff(Duration.ofSeconds(10))
        .infiniteRetry()
        .build()
        .execute(
            ctx -> {
              if (ctx.getRetryCount() > 0) {
                logger.info(
                    "retry #{}: uploading server certificate to local service directory. Failed before due to {}",
                    ctx.getRetryCount(),
                    ctx.getLastThrowable().toString());
              }

              lsdApi.announceActor(new AnnounceRequest(type, certificate, readableName));
              logger.info("uploaded server certificate to local service directory");
              latch.notifyCertificatePublished();
              return null;
            });
  }

  public void heartBeat(String subjectLocation) {
    lsdApi.heartbeat(subjectLocation);
  }
}
