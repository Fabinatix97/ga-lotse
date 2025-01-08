/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.mutex;

import de.eshg.persistence.TransactionHelper;
import java.util.function.Supplier;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.PessimisticLockingFailureException;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

/**
 * Inspired by Quartz’s clustered job store (JDBC-JobStoreTX) see
 * org.quartz.impl.jdbcjobstore.DBSemaphore#obtainLock
 */
@Service
public class DatabaseMutexService implements MutexService {

  private static final Logger log = LoggerFactory.getLogger(DatabaseMutexService.class);

  private final TransactionHelper transactionHelper;

  private final MutexRepository mutexRepository;

  public DatabaseMutexService(
      TransactionHelper transactionHelper, MutexRepository mutexRepository) {
    this.transactionHelper = transactionHelper;
    this.mutexRepository = mutexRepository;
  }

  private void insertIfNotExisting(String mutexName) {
    try {
      transactionHelper.executeInNewTransaction(
          () -> {
            if (!mutexRepository.existsById(mutexName)) {
              log.info("creating mutex '{}'", mutexName);
              mutexRepository.save(new Mutex(mutexName));
            }
          });
    } catch (DataIntegrityViolationException e) {
      log.warn("failed to create missing mutex '{}'", mutexName, e);
    }
  }

  @Override
  public <T> T doWithLockedMutex(String mutexName, Supplier<T> supplier) {
    log.debug("Trying to lock mutex '{}'", mutexName);
    insertIfNotExisting(mutexName);
    try {
      T result =
          transactionHelper.executeInNewTransaction(
              () -> {
                try {
                  Mutex mutex = mutexRepository.findByName(mutexName);
                  Assert.notNull(mutex, "Mutex '%s' does not exist".formatted(mutexName));
                  log.info("Successfully locked mutex '{}'", mutex.getName());
                } catch (PessimisticLockingFailureException e) {
                  throw new DatabaseMutexLockingException(
                      "Failed to lock mutex '" + mutexName + "'", e);
                }
                return supplier.get();
              });
      log.debug("Action running with locked mutex ('{}') finished", mutexName);
      return result;
    } catch (DatabaseMutexLockingException e) {
      log.warn("{}: Action skipped", e.getMessage());
      throw e;
    } catch (RuntimeException e) {
      log.error("Action running with locked mutex ('{}') failed", mutexName, e);
      throw e;
    }
  }
}
