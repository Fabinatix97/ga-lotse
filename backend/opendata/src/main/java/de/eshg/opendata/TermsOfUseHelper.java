/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.opendata;

import java.nio.charset.StandardCharsets;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

public final class TermsOfUseHelper {

  public static final String TERMS_OF_USE_FILENAME = "Terms-of-use.pdf";

  private TermsOfUseHelper() {}

  static ResponseEntity<Resource> termsOfUseResponse(byte[] termsOfUse) {
    return ResponseEntity.ok()
        .header(
            HttpHeaders.CONTENT_DISPOSITION,
            ContentDisposition.attachment()
                .filename(TERMS_OF_USE_FILENAME, StandardCharsets.UTF_8)
                .build()
                .toString())
        .contentType(MediaType.APPLICATION_PDF)
        .body(new ByteArrayResource(termsOfUse));
  }
}
