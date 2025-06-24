/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.servicedirectory.logging;

import static de.eshg.lib.servicedirectory.ServiceDirectoryApi.GET_TRUSTED_ACTORS_FULL_PATH;

import java.io.IOException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.zalando.logbook.Correlation;
import org.zalando.logbook.HttpRequest;
import org.zalando.logbook.HttpResponse;
import org.zalando.logbook.Precorrelation;
import org.zalando.logbook.Sink;
import org.zalando.logbook.Strategy;

/**
 * All actors poll /api/actors/trustedActors/self every 5 seconds. This strains our logging system
 * on production. Do not log this request if it has a NOT_MODIFIED response.
 */
@Component
// @Profile("production")
public class NoGetTrustedActorsNotModifiedStrategy implements Strategy {

  @Override
  public void write(final Precorrelation precorrelation, final HttpRequest request, final Sink sink)
      throws IOException {
    if (!request.getPath().startsWith(GET_TRUSTED_ACTORS_FULL_PATH)) {
      sink.write(precorrelation, request);
    }
  }

  @Override
  public void write(
      final Correlation correlation,
      final HttpRequest request,
      final HttpResponse response,
      final Sink sink)
      throws IOException {
    if (!request.getPath().startsWith(GET_TRUSTED_ACTORS_FULL_PATH)) {
      sink.write(correlation, request, response);
    } else if (response.getStatus() != HttpStatus.NOT_MODIFIED.value()) {
      sink.writeBoth(correlation, request, response);
    }
  }
}
