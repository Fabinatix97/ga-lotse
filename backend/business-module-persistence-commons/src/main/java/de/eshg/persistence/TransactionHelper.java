/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.persistence;

import de.cronn.commons.lang.Action;
import java.util.function.Supplier;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionDefinition;
import org.springframework.transaction.support.DefaultTransactionDefinition;
import org.springframework.transaction.support.TransactionTemplate;

@Component
public class TransactionHelper {

  private final PlatformTransactionManager transactionManager;

  public TransactionHelper(
      @Autowired(required = false) PlatformTransactionManager transactionManager) {
    this.transactionManager = transactionManager;
  }

  public void executeInTransaction(Action action) {
    executeInTransaction(action.toSupplier());
  }

  public <T> T executeInTransaction(Supplier<T> supplier) {
    return executeInTransaction(supplier, DefaultTransactionDefinition::new);
  }

  public void executeInReadOnlyTransaction(Action action) {
    executeInReadOnlyTransaction(action.toSupplier());
  }

  public <T> T executeInReadOnlyTransaction(Supplier<T> supplier) {
    return executeInTransaction(supplier, TransactionHelper::readOnlyTransaction);
  }

  private static TransactionDefinition readOnlyTransaction() {
    DefaultTransactionDefinition transactionDefinition = new DefaultTransactionDefinition();
    transactionDefinition.setReadOnly(true);
    return transactionDefinition;
  }

  public void executeInNewTransaction(Action action) {
    executeInNewTransaction(action.toSupplier());
  }

  public <T> T executeInNewTransaction(Supplier<T> supplier) {
    return executeInTransaction(supplier, TransactionHelper::newTransaction);
  }

  private static TransactionDefinition newTransaction() {
    DefaultTransactionDefinition transactionDefinition = new DefaultTransactionDefinition();
    transactionDefinition.setPropagationBehavior(TransactionDefinition.PROPAGATION_REQUIRES_NEW);
    transactionDefinition.setReadOnly(false);
    return transactionDefinition;
  }

  private <T> T executeInTransaction(
      Supplier<T> supplier, Supplier<TransactionDefinition> transactionDefinitionSupplier) {
    if (transactionManager == null) {
      throw new IllegalStateException("No transaction manager available.");
    }
    TransactionDefinition transactionDefinition = transactionDefinitionSupplier.get();
    return new TransactionTemplate(transactionManager, transactionDefinition)
        .execute(status -> supplier.get());
  }
}
