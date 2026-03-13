/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.config.i18n;

import de.eshg.config.domain.Document;
import de.eshg.config.domain.MultiLangDocument;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.rest.service.i18n.Language;
import de.eshg.rest.service.i18n.LanguageContextHolder;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.charset.StandardCharsets;
import java.util.Locale;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.Assert;

public final class MultiLangDocumentHelper {

  private MultiLangDocumentHelper() {}

  public static ResponseEntity<Resource> forwardInternationalizedResponse(
      ResponseEntity<Resource> response) {
    HttpHeaders headers = response.getHeaders();
    try {
      Resource body = response.getBody();
      Assert.notNull(body, "Response body was not expected to be null");

      return toResponseEntity(
          body.getContentAsByteArray(),
          headers.getContentType(),
          headers.getContentDisposition(),
          headers.getContentLanguage());
    } catch (IOException e) {
      throw new UncheckedIOException(e);
    }
  }

  public static ResponseEntity<Resource> getAsPdfResponseByCurrentLanguageWithFallback(
      MultiLangDocument multiLangDocument, MultiLangFileName filename) {
    return getAsResponseByCurrentLanguageWithFallback(
        multiLangDocument, filename, MediaType.APPLICATION_PDF);
  }

  public static ResponseEntity<Resource> getAsResponseWithFallback(
      MultiLangDocument multiLangDocument,
      MultiLangFileName filename,
      Language language,
      MediaType contentType) {
    Document document = multiLangDocument.get(language);
    ;
    if (document != null) {
      return toResponseEntity(document, filename.getFileName(language), language, contentType);
    }
    return getAsResourceByDefaultLanguage(multiLangDocument, filename, contentType);
  }

  public static ResponseEntity<Resource> getAsResponseByCurrentLanguageWithFallback(
      MultiLangDocument multiLangDocument, MultiLangFileName filename, MediaType contentType) {
    return getAsResponseWithFallback(
        multiLangDocument, filename, LanguageContextHolder.getLanguage(), contentType);
  }

  private static ResponseEntity<Resource> getAsResourceByDefaultLanguage(
      MultiLangDocument multiLangDocument, MultiLangFileName filename, MediaType contentType) {
    return toResponseEntity(
        multiLangDocument.get(Language.DEFAULT),
        filename.getFileName(Language.DEFAULT),
        Language.DEFAULT,
        contentType);
  }

  public static ResponseEntity<Resource> getAsResourceByLanguageOrThrow(
      MultiLangDocument multiLangDocument,
      MultiLangFileName multiLangFileName,
      Language language,
      MediaType mediaType) {
    Document document = multiLangDocument.get(language);
    if (document == null) {
      throw new NotFoundException("Document does not exist in %s".formatted(language));
    }
    return toResponseEntity(document, multiLangFileName.getFileName(language), language, mediaType);
  }

  private static ResponseEntity<Resource> toResponseEntity(
      Document document, String filename, Language contentLanguage, MediaType contentType) {
    return toResponseEntity(
        document.getContent(),
        contentType,
        ContentDisposition.attachment().filename(filename, StandardCharsets.UTF_8).build(),
        contentLanguage.getLocale());
  }

  private static ResponseEntity<Resource> toResponseEntity(
      byte[] content,
      MediaType contentType,
      ContentDisposition contentDisposition,
      Locale contentLanguage) {
    return ResponseEntity.ok()
        .headers(httpHeaders -> httpHeaders.setContentDisposition(contentDisposition))
        .headers(httpHeaders -> httpHeaders.setContentLanguage(contentLanguage))
        .varyBy(HttpHeaders.ACCEPT_LANGUAGE)
        .contentType(contentType)
        .body(new ByteArrayResource(content));
  }
}
