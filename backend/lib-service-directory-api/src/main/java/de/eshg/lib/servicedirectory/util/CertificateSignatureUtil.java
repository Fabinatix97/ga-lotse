/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.servicedirectory.util;

import de.eshg.lib.servicedirectory.api.ActorRequestDto;
import de.eshg.lib.servicedirectory.api.CertificateDto;
import de.eshg.servicedirectory.util.X509Utils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class CertificateSignatureUtil {

  private static final Logger logger = LoggerFactory.getLogger(CertificateSignatureUtil.class);

  private CertificateSignatureUtil() {}

  public static boolean validateSignature(ActorRequestDto actor) {
    String name = actor.readableName();
    if (actor.certificate() == null) {
      logger.warn("No certificate. Ignoring actor {}.", name);
      return false;
    }
    if (!innerValidateSignature(actor.certificate())) {
      logger.warn("Signature of certificate invalid. Ignoring actor {}.", name);
      return false;
    }
    return true;
  }

  private static boolean innerValidateSignature(CertificateDto certificateDTO) {
    try {
      return X509Utils.isValidSignature(
          certificateDTO.value(), certificateDTO.signature(), certificateDTO.signatory());
    } catch (IllegalStateException e) {
      logger.warn("Failed to validate signature", e);
      return false;
    }
  }
}
