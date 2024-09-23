/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.centralrepository.advice;

import de.eshg.centralrepository.exception.CentralRepositoryIOException;
import de.eshg.centralrepository.exception.ManualValidationException;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.NotFoundException;
import java.util.Map;
import java.util.TreeMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

@ControllerAdvice
public class CentralRepositoryAdvice {

  Logger logger = LoggerFactory.getLogger(CentralRepositoryAdvice.class);

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

  @ResponseBody
  @ExceptionHandler(ManualValidationException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  ResponseEntity<Object> failedManualValidation(ManualValidationException ex) {
    Map<String, String> errors = new TreeMap<>();
    for (ObjectError err : ex.getBindingResult().getAllErrors()) {
      errors.put(getAffectedItem(err), err.getDefaultMessage());
    }
    return ResponseEntity.badRequest().contentType(MediaType.APPLICATION_JSON).body(errors);
  }

  private static String getAffectedItem(ObjectError error) {
    if (error instanceof FieldError fieldError) {
      return fieldError.getField();
    } else {
      return error.getObjectName();
    }
  }
}
