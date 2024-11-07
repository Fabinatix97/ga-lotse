/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.vaccinationconsultation;

import de.eshg.travelmedicine.document.informationstatement.persistence.entity.InformationStatement;
import de.eshg.travelmedicine.vaccinationconsultation.api.InformationStatementSummaryDto;
import java.util.List;

public class InformationStatementSummaryMapper {

  public static List<InformationStatementSummaryDto> mapToInterfaceType(
      List<InformationStatement> informationStatements) {
    return informationStatements.stream()
        .map(
            statement ->
                new InformationStatementSummaryDto(
                    statement.getId(), statement.getTitle(), statement.isCitizenHasAnswered()))
        .toList();
  }
}
