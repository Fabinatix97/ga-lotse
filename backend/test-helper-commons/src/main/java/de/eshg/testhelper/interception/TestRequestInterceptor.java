/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.testhelper.interception;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.eshg.rest.service.error.ErrorCode;
import de.eshg.rest.service.error.ErrorResponse;
import de.eshg.testhelper.ConditionalOnTestHelperEnabled;
import de.eshg.testhelper.TestHelperController;
import de.eshg.testhelper.environment.EnvironmentConfig;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.BrokenBarrierException;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CyclicBarrier;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;
import java.util.concurrent.atomic.AtomicLong;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
@ConditionalOnTestHelperEnabled
public class TestRequestInterceptor extends OncePerRequestFilter {

  private static final Logger log = LoggerFactory.getLogger(TestRequestInterceptor.class);

  private static final Duration DEFAULT_CYCLIC_BARRIER_TIMEOUT = Duration.ofMinutes(10);

  private final List<Interception> interceptions = new ArrayList<>();
  private final AtomicLong barrierCounter = new AtomicLong();
  private final Map<Long, CyclicBarrier> cyclicBarriers = new ConcurrentHashMap<>();

  private final ObjectMapper objectMapper;

  TestRequestInterceptor(ObjectMapper objectMapper, EnvironmentConfig environmentConfig) {
    environmentConfig.assertIsNotProduction();
    this.objectMapper = objectMapper;
    log.warn("{} is enabled!", getClass().getSimpleName());
  }

  public void reset() {
    if (!cyclicBarriers.isEmpty()) {
      log.warn("Clearing {} cyclic barriers", cyclicBarriers.size());
      for (CyclicBarrier cyclicBarrier : cyclicBarriers.values()) {
        cyclicBarrier.reset();
      }
    }
    cyclicBarriers.clear();
    barrierCounter.set(0);
    synchronized (interceptions) {
      int size = interceptions.size();
      if (size > 0) {
        log.warn("Removing {} elements from interception queue", size);
      }
      interceptions.clear();
    }
  }

  @Override
  protected void doFilterInternal(
      HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {
    Interception interception = pollNextInterception(request);

    switch (interception) {
      case null -> filterChain.doFilter(request, response);
      case InterceptionOverwriteResponse interceptionOverwriteResponse -> {
        handleInterceptionType(interceptionOverwriteResponse.type(), request, response);
        // Since we overwrite the response, we DO NOT CALL filterChain.doFilter(…) here!
      }
      case InterceptionAwaitBarrier interceptionAwaitBarrier -> {
        awaitBarrier(interceptionAwaitBarrier.barrierId());
        filterChain.doFilter(request, response);
      }
    }
  }

  private Interception pollNextInterception(HttpServletRequest request) {
    synchronized (interceptions) {
      if (!shouldIntercept(request)) {
        if (!interceptions.isEmpty()) {
          log.warn("NOT intercepting request to {}", request.getRequestURI());
        }
      } else {
        Interception interceptionData =
            interceptions.stream()
                .filter(data -> filterByRequest(data, request))
                .findFirst()
                .orElse(null);
        if (interceptionData != null) {
          interceptions.remove(interceptionData);
          return interceptionData;
        } else if (!interceptions.isEmpty()) {
          log.info(
              "Request {} {} does not match any of the interceptions",
              request.getMethod(),
              request.getRequestURI());
        }
      }
    }
    return null;
  }

  private void awaitBarrier(long barrierId) {
    awaitBarrier(barrierId, DEFAULT_CYCLIC_BARRIER_TIMEOUT);
  }

  private void awaitBarrier(long barrierId, Duration timeout) {
    try {
      CyclicBarrier cyclicBarrier = cyclicBarriers.get(barrierId);
      Assert.notNull(cyclicBarrier, "Found no cyclic barrier for ID " + barrierId);
      log.info("Awaiting cyclic barrier for barrier ID {} (timeout: {})", barrierId, timeout);
      cyclicBarrier.await(timeout.toMillis(), TimeUnit.MILLISECONDS);
      log.info("Finished awaiting cyclic barrier for barrier ID {}", barrierId);
    } catch (InterruptedException e) {
      Thread.currentThread().interrupt();
      throw new RuntimeException(e);
    } catch (TimeoutException | BrokenBarrierException e) {
      throw new RuntimeException(e);
    }
  }

  private void removeBarrier(long barrierId) {
    CyclicBarrier removedBarrier = cyclicBarriers.remove(barrierId);
    Assert.notNull(
        removedBarrier,
        () -> "Failed to remove cyclic barrier for barrier ID %d".formatted(barrierId));
  }

  private static boolean filterByRequest(Interception interception, HttpServletRequest request) {
    TestHelperInterceptionRequestFilter filter = interception.filter();
    if (filter == null) {
      return true;
    }

    if (filter.httpMethodFilter() != null) {
      if (filter.httpMethodFilter().matches(request.getMethod())) {
        log.info("Request method matches interception method: {}", filter.httpMethodFilter());
      } else {
        return false;
      }
    }

    if (filter.urlPatternFilter() != null) {
      if (filter.urlPatternFilter().matcher(request.getRequestURI()).matches()) {
        log.info(
            "Request URI {} matches interception URL pattern '{}'",
            request.getRequestURI(),
            filter.urlPatternFilter());
      } else {
        return false;
      }
    }

    if (filter.queryPatternFilter() != null) {
      String queryString = request.getQueryString();
      if (queryString != null && filter.queryPatternFilter().matcher(queryString).matches()) {
        log.info(
            "Query string '{}' matches interception query pattern '{}'",
            queryString,
            filter.queryPatternFilter());
      } else {
        return false;
      }
    }

    return true;
  }

  private boolean shouldIntercept(HttpServletRequest request) {
    return !request.getRequestURI().startsWith(TestHelperController.BASE_URL)
        && !request.getRequestURI().startsWith("/actuator/");
  }

  private void handleInterceptionType(
      InterceptionType interceptionType, HttpServletRequest request, HttpServletResponse response)
      throws IOException {
    log.warn(
        "Intercepting {} {} with type {}",
        request.getMethod(),
        request.getRequestURI(),
        interceptionType);
    HttpStatus status = determineDesiredStatus(interceptionType);
    response.setStatus(status.value());
    writeResponse(response, interceptionType);
  }

  private void writeResponse(ServletResponse response, InterceptionType interceptionType)
      throws IOException {
    response.setCharacterEncoding(StandardCharsets.UTF_8.name());
    response.setContentType(MediaType.TEXT_PLAIN_VALUE);
    try (PrintWriter writer = response.getWriter()) {
      ErrorCode errorCode =
          switch (interceptionType) {
            case BAD_REQUEST -> ErrorCode.BAD_REQUEST;
            case UNAUTHORIZED -> ErrorCode.UNAUTHORIZED;
            case FORBIDDEN -> ErrorCode.INSUFFICIENT_USER_RIGHTS;
            case NOT_FOUND -> ErrorCode.NOT_FOUND;
            case INTERNAL_SERVER_ERROR -> ErrorCode.UNEXPECTED_ERROR;
          };
      writer.write(objectMapper.writeValueAsString(new ErrorResponse(errorCode, "Intercepted")));
    }
  }

  private static HttpStatus determineDesiredStatus(InterceptionType interceptionType) {
    return switch (interceptionType) {
      case BAD_REQUEST -> HttpStatus.BAD_REQUEST;
      case UNAUTHORIZED -> HttpStatus.UNAUTHORIZED;
      case FORBIDDEN -> HttpStatus.FORBIDDEN;
      case NOT_FOUND -> HttpStatus.NOT_FOUND;
      case INTERNAL_SERVER_ERROR -> HttpStatus.INTERNAL_SERVER_ERROR;
    };
  }

  public void interceptNextRequest(
      InterceptionType type, TestHelperInterceptionRequestFilter filter) {
    synchronized (interceptions) {
      boolean success = interceptions.add(new InterceptionOverwriteResponse(type, filter));
      Assert.isTrue(success, "Failed to add interception");
    }
  }

  public long addBarrier(TestHelperInterceptionRequestFilter filter) {
    synchronized (interceptions) {
      long barrierId = barrierCounter.incrementAndGet();
      CyclicBarrier cyclicBarrier = new CyclicBarrier(2);
      Object existing = cyclicBarriers.put(barrierId, cyclicBarrier);
      Assert.isNull(
          existing, () -> "Cyclic barrier for barrier ID %d already exists".formatted(barrierId));
      log.debug("Stored {} for barrier ID {}", cyclicBarrier, barrierId);
      boolean success = interceptions.add(new InterceptionAwaitBarrier(barrierId, filter));
      Assert.isTrue(success, "Failed to add barrier");
      return barrierId;
    }
  }

  @SuppressWarnings("BusyWait")
  public void waitUntilSomeoneIsAwaitingTheCyclicBarrier(long barrierId) {
    log.debug("Waiting until someone awaits the cyclic barrier");
    CyclicBarrier cyclicBarrier = cyclicBarriers.get(barrierId);
    Assert.notNull(
        cyclicBarrier, () -> "Found no cyclic barrier for barrier ID %d".formatted(barrierId));
    while (cyclicBarrier.getNumberWaiting() == 0) {
      try {
        Thread.sleep(50);
      } catch (InterruptedException e) {
        Thread.currentThread().interrupt();
        throw new RuntimeException(e);
      }
    }
    log.info("{} parties wait for the cyclic barrier", cyclicBarrier.getNumberWaiting());
  }

  public void awaitAndRemoveBarrier(long barrierId, Long timeoutInMillis) {
    if (timeoutInMillis != null) {
      awaitBarrier(barrierId, Duration.ofMillis(timeoutInMillis));
    } else {
      awaitBarrier(barrierId);
    }
    removeBarrier(barrierId);
  }
}
