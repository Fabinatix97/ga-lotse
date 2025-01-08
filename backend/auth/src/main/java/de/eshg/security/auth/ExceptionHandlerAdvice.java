/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.security.auth;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.TypeMismatchException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.client.ClientAuthorizationException;
import org.springframework.web.bind.ServletRequestBindingException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@RestControllerAdvice
public class ExceptionHandlerAdvice extends ResponseEntityExceptionHandler {

  private static final Logger log = LoggerFactory.getLogger(ExceptionHandlerAdvice.class);

  private final RedirectToAuthorizationEndpoint redirectToAuthorization;

  public ExceptionHandlerAdvice(RedirectToAuthorizationEndpoint redirectToAuthorization) {
    this.redirectToAuthorization = redirectToAuthorization;
  }

  @Override
  protected ResponseEntity<Object> handleTypeMismatch(
      TypeMismatchException ex, HttpHeaders headers, HttpStatusCode status, WebRequest request) {
    log.error("Bad Request", ex);
    return super.handleTypeMismatch(ex, headers, status, request);
  }

  @Override
  protected ResponseEntity<Object> handleServletRequestBindingException(
      ServletRequestBindingException ex,
      HttpHeaders headers,
      HttpStatusCode status,
      WebRequest request) {
    log.error("Bad Request", ex);
    return super.handleServletRequestBindingException(ex, headers, status, request);
  }

  @ExceptionHandler
  @ResponseStatus(HttpStatus.FORBIDDEN)
  void handleForbiddenException(ForbiddenException forbiddenException) {
    log.info("Forbidden", forbiddenException);
  }

  @ExceptionHandler
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  void handleBadRequestException(BadRequestException badRequestException) {
    log.info("Bad Request", badRequestException);
  }

  @ExceptionHandler
  @ResponseStatus(HttpStatus.UNAUTHORIZED)
  void handleUnauthorizedException(UnauthorizedException unauthorizedException) {
    log.info("Unauthorized", unauthorizedException);
  }

  @ExceptionHandler
  @ResponseStatus(HttpStatus.UNAUTHORIZED)
  void handleClientAuthorizationException(
      ClientAuthorizationException exception,
      HttpServletRequest request,
      HttpServletResponse response)
      throws IOException {
    log.info("ClientAuthorizationException", exception);
    redirectToAuthorization.redirect(request, response);
  }

  @ExceptionHandler
  @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
  void handleException(Exception exception) {
    log.info("Unexpected error", exception);
  }
}
