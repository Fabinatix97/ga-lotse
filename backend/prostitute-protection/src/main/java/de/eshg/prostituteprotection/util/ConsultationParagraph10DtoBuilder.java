/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.prostituteprotection.util;

import de.eshg.prostituteprotection.api.ConsultationParagraph10Dto;

public class ConsultationParagraph10DtoBuilder {
  private boolean diseasePrevention = true;
  private boolean birthControl = true;
  private boolean pregnancy = true;
  private boolean alcoholAndDrugUsage = true;
  private boolean referral = true;
  private boolean clearing = true;

  public ConsultationParagraph10DtoBuilder diseasePrevention(boolean diseasePrevention) {
    this.diseasePrevention = diseasePrevention;
    return this;
  }

  public ConsultationParagraph10DtoBuilder birthControl(boolean birthControl) {
    this.birthControl = birthControl;
    return this;
  }

  public ConsultationParagraph10DtoBuilder pregnancy(boolean pregnancy) {
    this.pregnancy = pregnancy;
    return this;
  }

  public ConsultationParagraph10DtoBuilder alcoholAndDrugUsage(boolean alcoholAndDrugUsage) {
    this.alcoholAndDrugUsage = alcoholAndDrugUsage;
    return this;
  }

  public ConsultationParagraph10DtoBuilder referral(boolean referral) {
    this.referral = referral;
    return this;
  }

  public ConsultationParagraph10DtoBuilder clearing(boolean clearing) {
    this.clearing = clearing;
    return this;
  }

  public ConsultationParagraph10Dto build() {
    return new ConsultationParagraph10Dto(
        diseasePrevention, birthControl, pregnancy, alcoholAndDrugUsage, referral, clearing);
  }
}
