/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.mapper;

import de.eshg.lib.procedure.mapping.FileMapper;
import de.eshg.lib.procedure.model.PdfDto;
import de.eshg.measlesprotection.api.ProofRequestLetterDto;
import de.eshg.measlesprotection.persistence.db.ProofRequestLetter;
import java.time.Clock;
import org.springframework.stereotype.Component;

@Component
public class ProofRequestLetterMapper {

  private final Clock clock;

  public ProofRequestLetterMapper(Clock clock) {
    this.clock = clock;
  }

  public ProofRequestLetterDto toInterface(ProofRequestLetter proofRequestLetter) {
    return new ProofRequestLetterDto(
        proofRequestLetter.getRecipientId(),
        proofRequestLetter.getCreatedAt().atZone(clock.getZone()).toLocalDate(),
        proofRequestLetter.getDeadline(),
        (PdfDto) FileMapper.toInterfaceType(proofRequestLetter.getPdf()));
  }
}
