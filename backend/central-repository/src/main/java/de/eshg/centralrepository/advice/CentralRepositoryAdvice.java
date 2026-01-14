/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.centralrepository.advice;

import de.eshg.centralrepository.exception.CentralRepositoryIOException;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.NotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

@ControllerAdvice
public class CentralRepositoryAdvice {

  private static final Logger logger = LoggerFactory.getLogger(CentralRepositoryAdvice.class);

  @ResponseBody
  @ExceptionHandler(CentralRepositoryIOException.class)
  @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
  String ioExceptionHandler(CentralRepositoryIOException ex) {
    logger.debug("ioExceptionHandler", ex);
    return ex.getMessage();
  }

  @ResponseBody
  @ExceptionHandler(DataIntegrityViolationException.class)
  @ResponseStatus(HttpStatus.CONFLICT)
  String alreadyExistsHandler(DataIntegrityViolationException ex) {
    logger.debug("alreadyExistsHandler", ex);
    return ex.getMessage();
  }

  @ResponseBody
  @ExceptionHandler(NotFoundException.class)
  @ResponseStatus(HttpStatus.NOT_FOUND)
  String actorNotFoundHandler(NotFoundException ex) {
    logger.debug("actorNotFoundHandler", ex);
    return ex.getMessage();
  }

  @ResponseBody
  @ExceptionHandler(BadRequestException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  String centralRepositoryBadRequestHandler(BadRequestException ex) {
    logger.debug("badRequestHandler", ex);
    return ex.getMessage();
  }
}
