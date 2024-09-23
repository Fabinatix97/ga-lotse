/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.servicedirectory.common.advice;

import de.eshg.servicedirectory.actor.exception.ActorNotActiveException;
import de.eshg.servicedirectory.actor.exception.ActorNotFoundException;
import de.eshg.servicedirectory.common.exception.ChangesNotFoundException;
import de.eshg.servicedirectory.common.exception.CommitForbiddenException;
import de.eshg.servicedirectory.common.exception.ConflictingChangesException;
import de.eshg.servicedirectory.common.exception.ServiceDirectoryBadRequestException;
import de.eshg.servicedirectory.common.exception.ServiceDirectoryForbiddenException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

@ControllerAdvice
public class ServiceDirectoryControllerAdvice {

  Logger logger = LoggerFactory.getLogger(ServiceDirectoryControllerAdvice.class);

  @ResponseBody
  @ExceptionHandler(ServiceDirectoryBadRequestException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  String serviceDirectoryBadRequestHandler(ServiceDirectoryBadRequestException ex) {
    logger.debug("serviceDirectoryBadRequestHandler", ex);
    return ex.getMessage();
  }

  @ResponseBody
  @ExceptionHandler(ServiceDirectoryForbiddenException.class)
  @ResponseStatus(HttpStatus.FORBIDDEN)
  String serviceDirectoryForbiddenHandler(ServiceDirectoryForbiddenException ex) {
    logger.debug("serviceDirectoryForbiddenHandler", ex);
    return ex.getMessage();
  }

  @ResponseBody
  @ExceptionHandler(ActorNotFoundException.class)
  @ResponseStatus(HttpStatus.NOT_FOUND)
  String serviceDirectoryActorNotFoundHandler(ActorNotFoundException ex) {
    logger.debug("serviceDirectoryActorNotFoundHandler", ex);
    return ex.getMessage();
  }

  @ResponseBody
  @ExceptionHandler(ActorNotActiveException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  String serviceDirectoryActorWasNotActiveHandler(ActorNotActiveException ex) {
    logger.debug("serviceDirectoryActorWasNotActiveHandler", ex);
    return ex.getMessage();
  }

  @ResponseBody
  @ExceptionHandler(CommitForbiddenException.class)
  @ResponseStatus(HttpStatus.FORBIDDEN)
  String serviceDirectoryCommitForbiddenHandler(CommitForbiddenException ex) {
    logger.debug("serviceDirectoryCommitForbiddenHandler", ex);
    return ex.getMessage();
  }

  @ResponseBody
  @ExceptionHandler(ConflictingChangesException.class)
  @ResponseStatus(HttpStatus.CONFLICT)
  String serviceDirectoryCommitForbiddenHandler(ConflictingChangesException ex) {
    logger.debug("serviceDirectoryCommitForbiddenHandler", ex);
    return ex.getMessage();
  }

  @ResponseBody
  @ExceptionHandler(ChangesNotFoundException.class)
  @ResponseStatus(HttpStatus.NOT_FOUND)
  String serviceDirectoryCommitForbiddenHandler(ChangesNotFoundException ex) {
    logger.debug("serviceDirectoryCommitForbiddenHandler", ex);
    return ex.getMessage();
  }

  @ResponseBody
  @ExceptionHandler(OptimisticLockingFailureException.class)
  @ResponseStatus(HttpStatus.CONFLICT)
  String serviceDirectoryOptimisticLockingFailure(OptimisticLockingFailureException ex) {
    logger.debug("serviceDirectoryOptimisticLockingFailure", ex);
    return ex.getMessage();
  }
}
