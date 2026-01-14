/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.foureyes.approval;

import static java.util.function.Predicate.not;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.lib.foureyes.domain.model.ApprovalRequest;
import jakarta.persistence.EntityManager;
import jakarta.persistence.metamodel.Bindable;
import java.lang.reflect.Modifier;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.hibernate.Hibernate;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

@Service
public class ApprovalRequestDecisionHandlerRegistry {

  private final Map<Class<?>, AbstractApprovalRequestDecisionHandler<?>>
      approvalRequestEntityToHandlerMap;
  private final List<AbstractApprovalRequestDecisionHandler<?>> approvalRequestDecisionHandlers;
  private final EntityManager entityManager;

  public ApprovalRequestDecisionHandlerRegistry(
      List<AbstractApprovalRequestDecisionHandler<?>> approvalRequestDecisionHandlers,
      EntityManager entityManager) {
    this.approvalRequestDecisionHandlers = approvalRequestDecisionHandlers;
    this.entityManager = entityManager;

    validateEveryApprovalRequestEntityIsHandledExactlyOnce();

    this.approvalRequestEntityToHandlerMap = getApprovalRequestEntityToHandlerMapAndValidate();
  }

  AbstractApprovalRequestDecisionHandler<?> getHandler(ApprovalRequest<?> approvalRequest) {
    Class<? extends ApprovalRequest<?>> entityClass = Hibernate.getClass(approvalRequest);
    return this.approvalRequestEntityToHandlerMap.get(entityClass);
  }

  private void validateEveryApprovalRequestEntityIsHandledExactlyOnce() {
    List<Class<?>> approvalRequestEntities = getConcreteApprovalRequestEntityClasses();

    List<String> nonUniquelyHandledApprovalRequestEntityNames =
        approvalRequestEntities.stream()
            .filter(not(this::hasExactlyOneHandler))
            .map(Class::getName)
            .toList();

    Assert.isTrue(
        nonUniquelyHandledApprovalRequestEntityNames.isEmpty(),
        "Expected all approval requests to be handled by exactly one %s, however the following were not: %s"
            .formatted(
                ApprovalRequest.class.getName(), nonUniquelyHandledApprovalRequestEntityNames));
  }

  private Map<Class<?>, AbstractApprovalRequestDecisionHandler<?>>
      getApprovalRequestEntityToHandlerMapAndValidate() {
    List<Class<?>> approvalRequestEntities = getConcreteApprovalRequestEntityClasses();

    return approvalRequestEntities.stream()
        .collect(StreamUtil.toLinkedHashMap(Function.identity(), this::getApprovalRequestHandler));
  }

  private List<Class<?>> getConcreteApprovalRequestEntityClasses() {
    return entityManager.getMetamodel().getEntities().stream()
        .map(Bindable::getBindableJavaType)
        .filter(ApprovalRequest.class::isAssignableFrom)
        .filter(this::isNotAbstract)
        .collect(Collectors.toUnmodifiableList()); // NOSONAR
  }

  private boolean hasExactlyOneHandler(Class<?> approvalRequestClass) {
    long matchingHandlers =
        this.approvalRequestDecisionHandlers.stream()
            .filter(h -> h.canHandle(approvalRequestClass))
            .count();
    return matchingHandlers == 1;
  }

  private AbstractApprovalRequestDecisionHandler<?> getApprovalRequestHandler(
      Class<?> approvalRequestClass) {
    return this.approvalRequestDecisionHandlers.stream()
        .filter(handler -> handler.canHandle(approvalRequestClass))
        .findAny()
        .orElseThrow();
  }

  private boolean isNotAbstract(Class<?> approvalRequestClass) {
    return !Modifier.isAbstract(approvalRequestClass.getModifiers());
  }
}
