/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.certificate;

import java.math.BigDecimal;
import java.text.NumberFormat;
import java.util.Locale;

public class PdfServiceParameters {
  private final String serviceDescriptor;
  private final BigDecimal fee;
  private final String stringFee;

  public PdfServiceParameters(String serviceDescriptor, BigDecimal fee) {
    this.serviceDescriptor = serviceDescriptor;
    this.fee = fee;
    this.stringFee = NumberFormat.getCurrencyInstance(Locale.GERMANY).format(fee);
  }

  public String getServiceDescriptor() {
    return serviceDescriptor;
  }

  public BigDecimal getFee() {
    return fee;
  }

  public String getStringFee() {
    return stringFee;
  }
}
