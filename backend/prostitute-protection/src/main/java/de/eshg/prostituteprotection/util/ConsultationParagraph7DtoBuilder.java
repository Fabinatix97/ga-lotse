/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.prostituteprotection.util;

import de.eshg.prostituteprotection.api.ConsultationParagraph7Dto;

public class ConsultationParagraph7DtoBuilder {
  private boolean legalAdvices = true;
  private boolean healthAndSocialInsurance = true;
  private boolean consultingServices = true;
  private boolean emergencyHelp = true;
  private boolean taxLiability = true;
  private boolean informationMaterial = true;
  private boolean predicament = true;

  public ConsultationParagraph7DtoBuilder healthAndSocialInsurance(
      boolean healthAndSocialInsurance) {
    this.healthAndSocialInsurance = healthAndSocialInsurance;
    return this;
  }

  public ConsultationParagraph7DtoBuilder emergencyHelp(boolean emergencyHelp) {
    this.emergencyHelp = emergencyHelp;
    return this;
  }

  public ConsultationParagraph7DtoBuilder informationMaterial(boolean informationMaterial) {
    this.informationMaterial = informationMaterial;
    return this;
  }

  public ConsultationParagraph7DtoBuilder predicament(boolean predicament) {
    this.predicament = predicament;
    return this;
  }

  public ConsultationParagraph7Dto build() {
    return new ConsultationParagraph7Dto(
        legalAdvices,
        healthAndSocialInsurance,
        consultingServices,
        emergencyHelp,
        taxLiability,
        informationMaterial,
        predicament);
  }
}
