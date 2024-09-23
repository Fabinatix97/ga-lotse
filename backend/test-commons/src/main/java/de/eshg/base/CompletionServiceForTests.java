/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base;

import static org.assertj.core.api.Assertions.*;

import de.cronn.commons.lang.Action;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.Callable;
import java.util.concurrent.CompletionService;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicLong;
import org.jetbrains.annotations.CheckReturnValue;
import org.jetbrains.annotations.NotNull;

public class CompletionServiceForTests implements CompletionService<Void> {

  private final CompletionService<Void> delegate;
  private final Duration waitTimeout;

  private final AtomicLong numberOfSubmittedFutures = new AtomicLong();

  public CompletionServiceForTests(CompletionService<Void> delegate, Duration waitTimeout) {
    this.delegate = delegate;
    this.waitTimeout = waitTimeout;
  }

  @NotNull
  public Future<Void> submit(@NotNull Action task) {
    return submit(task.toCallable());
  }

  @NotNull
  @Override
  public Future<Void> submit(@NotNull Callable<Void> task) {
    Future<Void> future = delegate.submit(task);
    numberOfSubmittedFutures.incrementAndGet();
    return future;
  }

  @NotNull
  @Override
  public Future<Void> submit(@NotNull Runnable task, Void result) {
    Future<Void> future = delegate.submit(task, result);
    numberOfSubmittedFutures.incrementAndGet();
    return future;
  }

  @Override
  public Future<Void> take() throws InterruptedException {
    return delegate.take();
  }

  @Override
  public Future<Void> poll() {
    return delegate.poll();
  }

  @Override
  public Future<Void> poll(long timeout, @NotNull TimeUnit unit) throws InterruptedException {
    return delegate.poll(timeout, unit);
  }

  public void waitUntilAllFuturesFinished() throws Exception {
    List<Throwable> exceptions = waitUntilAllFuturesFinishedAndCollectExecutionExceptions(true);
    assertThat(exceptions).isEmpty();
  }

  @CheckReturnValue
  private List<Throwable> waitUntilAllFuturesFinishedAndCollectExecutionExceptions(
      boolean throwEarly) throws Exception {
    List<Throwable> executionExceptions = new ArrayList<>();

    for (long i = 0; i < numberOfSubmittedFutures.longValue(); i++) {
      Future<?> result = poll(waitTimeout.toMillis(), TimeUnit.MILLISECONDS);
      assertThat(result).isNotNull();

      try {
        result.get(waitTimeout.toMillis(), TimeUnit.MILLISECONDS);
      } catch (ExecutionException e) {
        if (throwEarly) {
          throw e;
        }
        executionExceptions.add(e.getCause());
      }
    }
    numberOfSubmittedFutures.set(0);
    return executionExceptions;
  }
}
