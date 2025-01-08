/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.document.informationstatement;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import de.eshg.travelmedicine.document.api.DocumentContentDto;
import de.eshg.travelmedicine.document.informationstatement.api.InformationStatementDto;
import de.eshg.travelmedicine.document.informationstatement.persistence.entity.InformationStatement;
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
    ObjectMapper objectMapper = new ObjectMapper();
    DocumentContentDto informationStatementContent;
    try {
      informationStatementContent =
          objectMapper.readValue(informationStatement.getContent(), DocumentContentDto.class);
    } catch (JsonProcessingException e) {
      throw new IllegalArgumentException("Content does not match required structure");
    }
    return new InformationStatementDto(
        informationStatement.getId(),
        informationStatement.getTitle(),
        informationStatementContent,
        informationStatement.isCitizenHasAnswered(),
        informationStatement.getCreatedAt(),
        informationStatement.getModifiedAt());
  }
}
