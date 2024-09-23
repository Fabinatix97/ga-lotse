/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lsd.advice;

import de.eshg.lsd.exception.ActorNotFoundException;
import de.eshg.lsd.exception.InvalidCertificateException;
import de.eshg.lsd.exception.SignatureServiceException;
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

  @ResponseBody
  @ExceptionHandler(InvalidCertificateException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  String invalidCertificateHandler(InvalidCertificateException ex) {
    logger.debug("invalidCertificateHandler", ex);
    return ex.getMessage();
  }

  @ResponseBody
  @ExceptionHandler(SignatureServiceException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  String signatureExceptionHandler(SignatureServiceException ex) {
    logger.debug("signatureExceptionHandler", ex);
    return ex.getMessage();
  }
}
