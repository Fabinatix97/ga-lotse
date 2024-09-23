/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.informationstatementtemplate;

import static de.eshg.rest.service.security.CurrentUserHelper.getCurrentUserId;

import de.eshg.travelmedicine.disease.DiseaseMapper;
import de.eshg.travelmedicine.disease.api.DiseaseDto;
import de.eshg.travelmedicine.disease.persistence.entity.Disease;
import de.eshg.travelmedicine.informationstatementtemplate.api.InformationStatementTemplateDto;
import de.eshg.travelmedicine.informationstatementtemplate.api.InformationStatementTemplateRequest;
import de.eshg.travelmedicine.informationstatementtemplate.api.InformationStatementTemplateStateDto;
import de.eshg.travelmedicine.informationstatementtemplate.persistence.entity.InformationStatementTemplate;
import de.eshg.travelmedicine.informationstatementtemplate.persistence.entity.InformationStatementTemplateState;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.springframework.stereotype.Component;

@Component
public class InformationStatementTemplateMapper {

  public InformationStatementTemplateDto toInterfaceType(
      InformationStatementTemplate informationStatementTemplate) {
    return new InformationStatementTemplateDto(
        informationStatementTemplate.getId(),
        informationStatementTemplate.getName(),
        informationStatementTemplate.getTitle(),
        toInterfaceType(informationStatementTemplate.getState()),
        informationStatementTemplate.getCreatedAt(),
        informationStatementTemplate.getModifiedAt(),
        mapDiseasesToInterfaceType(informationStatementTemplate.getDiseases()));
  }

  public InformationStatementTemplate toDomainType(
      InformationStatementTemplateRequest informationStatementTemplateRequest,
      Set<Disease> diseases) {
    return new InformationStatementTemplate(
        informationStatementTemplateRequest.name(),
        informationStatementTemplateRequest.title(),
        toDomainType(informationStatementTemplateRequest.state()),
        getCurrentUserId(),
        (diseases == null ? new HashSet<>() : diseases));
  }

  public static void updateInformationStatementTemplate(
      InformationStatementTemplateRequest informationStatementTemplateRequest,
      InformationStatementTemplate existingTemplate,
      Set<Disease> diseases) {
    existingTemplate.setName(informationStatementTemplateRequest.name());
    existingTemplate.setTitle(informationStatementTemplateRequest.title());
    existingTemplate.setState(toDomainType(informationStatementTemplateRequest.state()));
    existingTemplate.setModifiedBy(getCurrentUserId());
    existingTemplate.setDiseases(diseases == null ? new HashSet<>() : diseases);
  }

  public static InformationStatementTemplateState toDomainType(
      InformationStatementTemplateStateDto templateStateDto) {
    return InformationStatementTemplateState.valueOf(templateStateDto.name());
  }

  public static InformationStatementTemplateStateDto toInterfaceType(
      InformationStatementTemplateState templateState) {
    return InformationStatementTemplateStateDto.valueOf(templateState.name());
  }

  private static List<DiseaseDto> mapDiseasesToInterfaceType(Set<Disease> diseases) {
    return diseases == null
        ? Collections.emptyList()
        : diseases.stream()
            .map(DiseaseMapper::toInterfaceType)
            .sorted(Comparator.comparing(DiseaseDto::name))
            .toList();
  }
}
