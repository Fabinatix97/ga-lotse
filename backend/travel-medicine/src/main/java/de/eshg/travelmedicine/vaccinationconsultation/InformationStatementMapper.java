/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.vaccinationconsultation;

import de.eshg.travelmedicine.vaccinationconsultation.api.InformationStatementDto;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.InformationStatement;
import java.util.Comparator;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class InformationStatementMapper {

  public List<InformationStatementDto> mapInformationStatementsToInterfaceType(
      List<InformationStatement> informationStatements) {
    return informationStatements.stream()
        .map(this::mapInformationStatementToInterfaceType)
        .sorted(Comparator.comparing(InformationStatementDto::title))
        .toList();
  }

  public InformationStatementDto mapInformationStatementToInterfaceType(
      InformationStatement informationStatement) {
    return new InformationStatementDto(
        informationStatement.getId(),
        informationStatement.getTitle(),
        informationStatement.getContent(),
        informationStatement.isCitizenHasAnswered(),
        informationStatement.getCreatedAt(),
        informationStatement.getModifiedAt());
  }
}
