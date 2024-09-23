/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.chat.service;

import org.springframework.http.ResponseEntity;

public class RestUtils {

  public static <T> T getResponseBody(ResponseEntity<T> response) {
    if (response.getStatusCode().is2xxSuccessful()) {
      return response.getBody();
    } else {
      throw new RuntimeException(response.toString());
    }
  }
}
