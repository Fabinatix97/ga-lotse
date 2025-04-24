/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.config;

import java.io.IOException;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class SecurityTxtService {
  private final InitialDepartmentConfiguration initialDepartmentConfiguration;

  SecurityTxtService(InitialDepartmentConfiguration initialDepartmentConfiguration) {
    this.initialDepartmentConfiguration = initialDepartmentConfiguration;
  }

  public ResponseEntity<byte[]> getSecurityTxt() {
    try {
      byte[] securityTxt = initialDepartmentConfiguration.securityTxt().getContentAsByteArray();
      return ResponseEntity.ok().contentType(MediaType.TEXT_PLAIN).body(securityTxt);
    } catch (IOException e) {
      throw new RuntimeException("Could not read security txt file.", e);
    }
  }

  public ResponseEntity<byte[]> getSecurityTxtPublicKey() {
    try {
      byte[] securityTxt =
          initialDepartmentConfiguration.securityTxtPublicKey().getContentAsByteArray();
      return ResponseEntity.ok().contentType(MediaType.TEXT_PLAIN).body(securityTxt);
    } catch (IOException e) {
      throw new RuntimeException("Could not read security txt public key file.", e);
    }
  }
}
