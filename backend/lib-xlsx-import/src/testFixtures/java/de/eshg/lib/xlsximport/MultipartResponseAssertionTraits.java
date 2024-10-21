/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.xlsximport;

import de.cronn.assertions.validationfile.normalization.SimpleRegexReplacement;
import de.cronn.assertions.validationfile.normalization.ValidationNormalizer;
import de.cronn.assertions.validationfile.replacements.Replacer;
import de.eshg.base.spring.ResponseEntityValidationFileAssertionTraits;
import jakarta.activation.DataSource;
import jakarta.mail.BodyPart;
import jakarta.mail.internet.MimeMultipart;
import jakarta.mail.util.ByteArrayDataSource;
import java.util.Collections;
import java.util.Objects;
import java.util.stream.Collectors;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

public interface MultipartResponseAssertionTraits
    extends ResponseEntityValidationFileAssertionTraits {

  default ValidationNormalizer contentLengthNormalizer() {
    return new SimpleRegexReplacement("Content-Length: \\[\\d+\\]", "Content-Length: [[MASKED]]")
        .and(new SimpleRegexReplacement("Content-Length: \\d+", "Content-Length: [MASKED]"));
  }

  default void assertMultipartHeadersWithFile(
      ResponseEntity<byte[]> response, ValidationNormalizer validationNormalizer) throws Exception {

    String multipartHeaders = renderMultipartHeaders(response);

    assertWithFileWithSuffix(
        multipartHeaders,
        validationNormalizer.and(multipartBoundaryNormalizer(response)),
        "headers");
  }

  private static ValidationNormalizer multipartBoundaryNormalizer(ResponseEntity<?> response) {
    MediaType contentType = Objects.requireNonNull(response.getHeaders().getContentType());
    return new Replacer(
        "boundary=" + contentType.getParameter("boundary"), "boundary=[masked_boundary]");
  }

  private String renderMultipartHeaders(ResponseEntity<byte[]> response) throws Exception {
    MediaType contentType = response.getHeaders().getContentType();
    DataSource datasource = new ByteArrayDataSource(response.getBody(), contentType.toString());
    MimeMultipart multipart = new MimeMultipart(datasource);

    StringBuilder sb = new StringBuilder();
    sb.append(renderHeaders(response));
    sb.append("\n");

    for (int i = 0; i < multipart.getCount(); i++) {
      BodyPart part = multipart.getBodyPart(i);
      String headers =
          Collections.list(part.getAllHeaders()).stream()
              .map(header -> header.getName() + ": " + header.getValue())
              .sorted()
              .collect(Collectors.joining("\n"));

      sb.append("\n");
      sb.append(headers);
      sb.append("\n");
    }

    return sb.toString();
  }
}
