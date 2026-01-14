/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.pdf.identification;

import de.eshg.lib.document.generator.qrcode.QrCodeGenerator;
import de.eshg.stiprotection.persistence.db.Concern;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import org.springframework.web.util.UriComponentsBuilder;

public class QrCodes {
  public QrCodes() {}

  public static String qrCode(String uri, Concern concern, String accessCode) {
    String qrCodeUrl = qrCodeUrl(uri, concern, accessCode);
    String qrCodeSvg = QrCodeGenerator.createQrCode(qrCodeUrl);
    return Base64.getEncoder().encodeToString(qrCodeSvg.getBytes(StandardCharsets.UTF_8));
  }

  private static String qrCodeUrl(String uri, Concern concern, String accessCode) {
    return UriComponentsBuilder.fromUriString(uri)
        .pathSegment(AppointmentUrls.urlPath(concern))
        .queryParam("access_code", accessCode)
        .build()
        .toUriString();
  }
}
