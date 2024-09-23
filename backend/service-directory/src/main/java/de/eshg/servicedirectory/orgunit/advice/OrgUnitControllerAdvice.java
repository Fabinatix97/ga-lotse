/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.servicedirectory.orgunit.advice;

import de.eshg.servicedirectory.orgunit.exception.OrgUnitNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

@ControllerAdvice
public class OrgUnitControllerAdvice {

  Logger logger = LoggerFactory.getLogger(OrgUnitControllerAdvice.class);

  @ResponseBody
  @ExceptionHandler(OrgUnitNotFoundException.class)
  @ResponseStatus(HttpStatus.NOT_FOUND)
  String orgUnitNotFoundHandler(OrgUnitNotFoundException ex) {
    logger.debug("orgUnitNotFoundHandler", ex);
    return ex.getMessage();
  }
}
