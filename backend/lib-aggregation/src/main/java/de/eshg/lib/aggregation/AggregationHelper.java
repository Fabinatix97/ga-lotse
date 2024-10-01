/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.aggregation;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.rest.service.error.ErrorCode;
import de.eshg.rest.service.error.ErrorResponseWithLocation;
import java.time.Duration;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Executor;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;
import java.util.function.Function;
import java.util.function.Supplier;
import org.slf4j.Logger;
import org.springframework.security.concurrent.DelegatingSecurityContextExecutor;
import org.springframework.web.client.HttpClientErrorException.Forbidden;
import org.springframework.web.client.HttpClientErrorException.Unauthorized;

public abstract class AggregationHelper {

  private static final Map<Class<?>, ErrorCode> EXPECTED_EXCEPTIONS =
      Map.of(
          TimeoutException.class, ErrorCode.TIMEOUT,
          Forbidden.class, ErrorCode.INSUFFICIENT_USER_RIGHTS,
          Unauthorized.class, ErrorCode.UNAUTHORIZED);

  protected abstract Logger logger();

  protected abstract ErrorResponseWithLocation createErrorResponse(
      ErrorCode errorCode, String location, ExecutionException e);

  <R, C extends ClientWithLocationAndTimeout> List<ClientResponse<R>> requestFromClients(
      List<C> clients, Function<C, R> getFromClient) {
    try (ExecutorService executorService = Executors.newVirtualThreadPerTaskExecutor()) {
      Executor executor =
          new CorrelationIdAwareExecutor(new DelegatingSecurityContextExecutor(executorService));

      Map<String, Future<R>> futures =
          clients.stream()
              .collect(
                  StreamUtil.toLinkedHashMap(
                      ClientWithLocationAndTimeout::getLocation,
                      client ->
                          getAsyncOrTimout(
                              () -> getFromClient.apply(client),
                              client.getClientTimeout(),
                              executor)));

      try {
        return futures.entrySet().stream()
            .map(entry -> extractResponse(entry.getValue(), entry.getKey()))
            .filter(Objects::nonNull)
            .toList();
      } finally {
        // Note: We do not care about any belated responses to cancel all pending futures
        executorService.shutdownNow();
      }
    }
  }

  private static <R> Future<R> getAsyncOrTimout(
      Supplier<R> responseEntitySupplier, Duration clientTimeout, Executor executor) {
    return CompletableFuture.supplyAsync(responseEntitySupplier, executor)
        .orTimeout(clientTimeout.toMillis(), TimeUnit.MILLISECONDS);
  }

  private <R> ClientResponse<R> extractResponse(Future<R> future, String location) {
    try {
      R successfulResponse = future.get();
      return new ClientResponse<>(location, successfulResponse, null);
    } catch (InterruptedException e) {
      Thread.currentThread().interrupt();
      return null;
    } catch (ExecutionException e) {
      ErrorResponseWithLocation errorResponseWithLocation =
          getErrorResponseWithLocation(location, e);

      return new ClientResponse<>(location, null, errorResponseWithLocation);
    }
  }

  private ErrorResponseWithLocation getErrorResponseWithLocation(
      String location, ExecutionException e) {
    ErrorCode errorCode = EXPECTED_EXCEPTIONS.get(e.getCause().getClass());
    if (errorCode != null) {
      logger()
          .error(
              "Exception occurred during aggregation from {} (caused by {})",
              location,
              e.getCause().getClass().getName());

      return createErrorResponse(errorCode, location, e);
    }

    logger().error("Exception occurred during aggregation from {}", location, e);
    return createErrorResponse(ErrorCode.AGGREGATION_EXCEPTION, location, e);
  }

  public static <R> List<ErrorResponseWithLocation> aggregateErrorResponses(
      List<ClientResponse<R>> clientResponses) {
    return clientResponses.stream()
        .map(ClientResponse::errorResponse)
        .filter(Objects::nonNull)
        .sorted(Comparator.comparing(ErrorResponseWithLocation::errorLocation))
        .toList();
  }
}
