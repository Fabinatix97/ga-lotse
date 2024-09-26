/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.service.error;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Objects;
import java.util.TreeMap;
import java.util.stream.Collectors;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.MessageSourceResolvable;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.transaction.TransactionSystemException;
import org.springframework.validation.BindException;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.validation.method.ParameterValidationResult;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.method.annotation.HandlerMethodValidationException;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

  private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

  @Override
  protected ResponseEntity<Object> handleMethodArgumentNotValid(
      @NotNull MethodArgumentNotValidException ex,
      @NotNull HttpHeaders headers,
      @NotNull HttpStatusCode status,
      @NotNull WebRequest request) {
    return handleBadRequest(ex);
  }

  @Override
  protected ResponseEntity<Object> handleHttpMessageNotReadable(
      @NotNull HttpMessageNotReadableException ex,
      @NotNull HttpHeaders headers,
      @NotNull HttpStatusCode status,
      @NotNull WebRequest request) {
    log.error("Bad Request", ex);
    String errorMessage;
    Throwable cause = ex.getCause();
    if (cause instanceof JsonParseException) {
      errorMessage = "Invalid JSON format.";
    } else if (cause instanceof JsonMappingException) {
      errorMessage = "Error in mapping if JSON data.";
    } else if (ex.getMessage().contains("Required request body is missing")) {
      errorMessage = "Required request body is missing";
    } else {
      errorMessage = "The request contains invalid data";
    }
    return ResponseEntity.badRequest().body(errorMessage);
  }

  @Override
  protected ResponseEntity<Object> handleMaxUploadSizeExceededException(
      @NotNull MaxUploadSizeExceededException ex,
      @NotNull HttpHeaders headers,
      @NotNull HttpStatusCode status,
      @NotNull WebRequest request) {

    log.error("Bad Request", ex);
    return ResponseEntity.badRequest().body(ex.getMessage());
  }

  @Override
  protected ResponseEntity<Object> handleHandlerMethodValidationException(
      @NotNull HandlerMethodValidationException ex,
      @NotNull HttpHeaders headers,
      @NotNull HttpStatusCode status,
      @NotNull WebRequest request) {
    Map<String, String> errors = new LinkedHashMap<>();

    for (ParameterValidationResult parameterValidationResult : ex.getAllValidationResults()) {
      String parameterName = parameterValidationResult.getMethodParameter().getParameterName();
      String detail =
          parameterValidationResult.getResolvableErrors().stream()
              .map(MessageSourceResolvable::getDefaultMessage)
              .collect(Collectors.joining(", "));
      errors.put(parameterName, detail);
    }

    log.error("Invalid request: {}", errors);
    return ResponseEntity.badRequest().contentType(MediaType.APPLICATION_JSON).body(errors);
  }

  private static ResponseEntity<Object> handleBadRequest(BindException ex) {
    Map<String, String> errors = new TreeMap<>();
    ex.getBindingResult()
        .getAllErrors()
        .forEach(
            error -> {
              String item = getAffectedItem(error);
              String errorMessage = error.getDefaultMessage();
              errors.put(item, errorMessage);
            });
    log.error("Invalid request, failed to bind with errors:\n{}", errors, ex);
    return ResponseEntity.badRequest().contentType(MediaType.APPLICATION_JSON).body(errors);
  }

  private static String getAffectedItem(ObjectError error) {
    if (error instanceof FieldError fieldError) {
      return fieldError.getField();
    } else {
      return error.getObjectName();
    }
  }

  @ExceptionHandler
  @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
  public ErrorResponse fallBack(Exception ex) {
    return logAndMapToErrorResponse(ex, ErrorCode.UNEXPECTED_ERROR, "Unexpected error");
  }

  @ExceptionHandler
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  public ErrorResponse handleConstraintViolation(ConstraintViolationException ex) {
    String affectedFields =
        ex.getConstraintViolations().stream()
            .map(ConstraintViolation::getPropertyPath)
            .map(Objects::toString)
            .collect(Collectors.joining(", "));
    return logAndMapToErrorResponse(
        ex, ErrorCode.CONSTRAINT_VIOLATION, "Constraint violation for " + affectedFields);
  }

  // When using batched inserts, constraint violations are checked at transaction commit time.
  // Spring/Hibernate do not throw a ConstraintViolationException directly,
  // instead it’s nested inside a TransactionSystemException/RollbackException
  @ExceptionHandler
  public ResponseEntity<ErrorResponse> handleTransactionSystemException(
      TransactionSystemException ex) {
    if (ex.getCause() != null) {
      if (ex.getCause().getCause()
          instanceof ConstraintViolationException constraintViolationException) {
        return ResponseEntity.badRequest()
            .body(handleConstraintViolation(constraintViolationException));
      }
    }
    return ResponseEntity.internalServerError().body(fallBack(ex));
  }

  @ExceptionHandler
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  public ErrorResponse handleUnauthorized(HttpClientErrorException.Unauthorized ex) {
    return logAndMapToErrorResponse(ex, ErrorCode.UNAUTHORIZED, "Unauthorized");
  }

  @ExceptionHandler
  @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
  public ErrorResponse handleDataIntegrityViolation(DataIntegrityViolationException ex) {
    return logAndMapToErrorResponse(
        ex, ErrorCode.DATA_INTEGRITY_VIOLATION, "Data integrity violation");
  }

  @ExceptionHandler
  @ResponseStatus(HttpStatus.NOT_FOUND)
  public ErrorResponse handleNotFoundException(NotFoundException ex) {
    return logAndMapToErrorResponse(ex);
  }

  @ExceptionHandler
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  public ErrorResponse handleAlreadyExistsException(AlreadyExistsException ex) {
    return logAndMapToErrorResponse(ex);
  }

  @ExceptionHandler
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  public ErrorResponse handleBadRequestException(BadRequestException ex) {
    return logAndMapToErrorResponse(ex);
  }

  private static ErrorResponse logAndMapToErrorResponse(EshgBusinessException businessException) {
    ErrorResponse errorResponse =
        new ErrorResponse(
            businessException.getErrorCode(), businessException.getClientVisibleMessage());
    log.error("{}", businessException.getClientVisibleMessage(), businessException);
    return errorResponse;
  }

  private static ErrorResponse logAndMapToErrorResponse(
      Exception ex, ErrorCode errorCode, String message) {
    ErrorResponse error = new ErrorResponse(errorCode, message);
    log.error("{}", message, ex);
    return error;
  }
}
