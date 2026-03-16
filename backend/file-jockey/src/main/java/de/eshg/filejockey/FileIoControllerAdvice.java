/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.filejockey;

import de.eshg.filejockey.exception.DeviceNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

@ControllerAdvice
public class FileIoControllerAdvice {

  @ResponseBody
  @ExceptionHandler(DeviceNotFoundException.class)
  @ResponseStatus(HttpStatus.NOT_FOUND)
  public String handle(DeviceNotFoundException ex) {
    return ex.getMessage();
  }
}
