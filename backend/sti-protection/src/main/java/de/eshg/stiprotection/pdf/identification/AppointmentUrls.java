/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.pdf.identification;

import de.eshg.stiprotection.persistence.db.Concern;
import org.springframework.web.util.UriComponentsBuilder;

public class AppointmentUrls {

  private AppointmentUrls() {}

  public static String url(String uri, Concern concern) {
    return UriComponentsBuilder.fromUriString(uri)
        .pathSegment(urlPath(concern))
        .scheme(null)
        .build()
        .toUriString()
        .replaceFirst("^//", "");
  }

  public static String urlPath(Concern concern) {
    return switch (concern) {
      case HIV_STI_CONSULTATION -> "sti";
      case SEX_WORK -> "sab";
    };
  }
}
