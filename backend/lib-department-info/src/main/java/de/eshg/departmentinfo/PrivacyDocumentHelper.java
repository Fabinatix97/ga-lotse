/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.departmentinfo;

import java.nio.charset.StandardCharsets;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

public final class PrivacyDocumentHelper {

  private static final String PRIVACY_POLICY_PDF_FILENAME = "Datenschutzerklaerung.pdf";
  private static final String PRIVACY_NOTICE_PDF_FILENAME = "Datenschutz-Information.pdf";

  private PrivacyDocumentHelper() {}

  public static ResponseEntity<Resource> privacyNoticeAttachmentResponse(byte[] privacyNotice) {
    return privacyNoticeAttachmentResponse(new ByteArrayResource(privacyNotice));
  }

  public static ResponseEntity<Resource> privacyNoticeAttachmentResponse(Resource privacyNotice) {
    return pdfAttachmentResponse(privacyNotice, PRIVACY_NOTICE_PDF_FILENAME);
  }

  public static ResponseEntity<Resource> privacyPolicyAttachmentResponse(byte[] privacyPolicy) {
    return privacyPolicyAttachmentResponse(new ByteArrayResource(privacyPolicy));
  }

  public static ResponseEntity<Resource> privacyPolicyAttachmentResponse(Resource privacyPolicy) {
    return pdfAttachmentResponse(privacyPolicy, PRIVACY_POLICY_PDF_FILENAME);
  }

  private static ResponseEntity<Resource> pdfAttachmentResponse(
      Resource privacyDocument, String filename) {
    return ResponseEntity.ok()
        .header(
            HttpHeaders.CONTENT_DISPOSITION,
            ContentDisposition.attachment()
                .filename(filename, StandardCharsets.UTF_8)
                .build()
                .toString())
        .contentType(MediaType.APPLICATION_PDF)
        .body(privacyDocument);
  }
}
