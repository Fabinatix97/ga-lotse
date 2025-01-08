/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.servicedirectory.actor.advice;

import de.eshg.servicedirectory.actor.exception.ActorNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

@ControllerAdvice
public class ActorControllerAdvice {

  Logger logger = LoggerFactory.getLogger(ActorControllerAdvice.class);

  @ResponseBody
  @ExceptionHandler(ActorNotFoundException.class)
  @ResponseStatus(HttpStatus.NOT_FOUND)
  String actorNotFoundHandler(ActorNotFoundException ex) {
    logger.debug("actorNotFoundHandler", ex);
    return ex.getMessage();
  }
}
