/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medsabroad.aspect;

import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.medsabroad.persistence.database.MedsAbroadProcedure;
import de.eshg.medsabroad.persistence.database.MedsAbroadProcedureRepository;
import de.eshg.rest.service.error.BadRequestException;
import java.util.Optional;
import java.util.UUID;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.EnableAspectJAutoProxy;

@Aspect
@Configuration(proxyBeanMethods = false)
@EnableAspectJAutoProxy
public class ProtectedProcedureAspect {

  private static final Logger log = LoggerFactory.getLogger(ProtectedProcedureAspect.class);

  private final MedsAbroadProcedureRepository procedures;

  public ProtectedProcedureAspect(MedsAbroadProcedureRepository procedures) {
    this.procedures = procedures;
  }

  @Pointcut("args(externalId, ..)")
  public void hasExternalId(UUID externalId) {}

  @Pointcut("@annotation(de.eshg.medsabroad.aspect.ProcedureStatusTransition)")
  public void statusTransition() {}

  @Pointcut("@annotation(org.springframework.web.bind.annotation.PostMapping)")
  public void post() {}

  @Pointcut("@annotation(org.springframework.web.bind.annotation.PutMapping)")
  public void put() {}

  @Pointcut("@annotation(org.springframework.web.bind.annotation.PatchMapping)")
  public void patch() {}

  @Pointcut("post() || put() || patch()")
  public void write() {}

  @Pointcut("within(de.eshg.medsabroad..*)")
  public void withinMedsAbroad() {}

  @Before(
      value = "withinMedsAbroad() && !statusTransition() && hasExternalId(externalId) && write()",
      argNames = "joinPoint,externalId")
  public void denyModificationIfClosed(JoinPoint joinPoint, UUID externalId) {
    log.trace("externalId = {}, joinPoint = {}", externalId, joinPoint);
    Optional<MedsAbroadProcedure> procedure = procedures.findByExternalId(externalId);
    if (procedure.isEmpty()) {
      return;
    }
    if (ProcedureStatus.isClosed(procedure.get().getProcedureStatus())) {
      throw new BadRequestException(externalId + ": Access denied: procedure closed.");
    }
  }
}
