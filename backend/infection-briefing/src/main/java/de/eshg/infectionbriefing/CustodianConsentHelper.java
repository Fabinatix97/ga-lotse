/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.infectionbriefing;

import de.eshg.infectionbriefing.api.CustodianConsentInfoDto;
import de.eshg.infectionbriefing.domain.model.InfectionBriefingProcedure;
import de.eshg.infectionbriefing.domain.model.NewCertificateProcedure;
import de.eshg.infectionbriefing.mapper.CustodianConsentMapper;
import java.time.Clock;
import java.time.LocalDate;
import java.util.Optional;
import org.springframework.stereotype.Component;

@Component
public class CustodianConsentHelper {

  private final Clock clock;

  public CustodianConsentHelper(Clock clock) {
    this.clock = clock;
  }

  public CustodianConsentInfoDto getCustodianConsent(
      InfectionBriefingProcedure procedure, LocalDate dateOfBirth) {
    if (procedure instanceof NewCertificateProcedure newCertificateProcedure) {
      return Optional.ofNullable(newCertificateProcedure.getCustodianConsent())
          .map(CustodianConsentMapper::toInterfaceType)
          .orElse(
              isMinor(dateOfBirth)
                  ? CustodianConsentInfoDto.MISSING
                  : CustodianConsentInfoDto.NOT_REQUIRED);
    }
    return CustodianConsentInfoDto.NOT_REQUIRED;
  }

  public boolean isMinor(LocalDate dateOfBirth) {
    return LocalDate.now(clock).isBefore(dateOfBirth.plusYears(18));
  }
}
