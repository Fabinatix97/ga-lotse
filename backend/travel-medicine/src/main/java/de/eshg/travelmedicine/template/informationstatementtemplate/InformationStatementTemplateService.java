/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.template.informationstatementtemplate;

import de.eshg.rest.service.error.AlreadyExistsException;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.travelmedicine.disease.persistence.entity.Disease;
import de.eshg.travelmedicine.disease.persistence.entity.DiseaseRepository;
import de.eshg.travelmedicine.template.informationstatementtemplate.api.GetInformationStatementTemplatesResponse;
import de.eshg.travelmedicine.template.informationstatementtemplate.api.InformationStatementTemplateDto;
import de.eshg.travelmedicine.template.informationstatementtemplate.api.InformationStatementTemplateRequest;
import de.eshg.travelmedicine.template.informationstatementtemplate.persistence.entity.InformationStatementTemplate;
import de.eshg.travelmedicine.template.informationstatementtemplate.persistence.entity.InformationStatementTemplateRepository;
import de.eshg.travelmedicine.template.informationstatementtemplate.persistence.entity.InformationStatementTemplateState;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class InformationStatementTemplateService {

  private static final Logger log =
      LoggerFactory.getLogger(InformationStatementTemplateService.class);

  private final InformationStatementTemplateMapper informationStatementTemplateMapper;

  private final InformationStatementTemplateRepository informationStatementTemplateRepository;
  private final DiseaseRepository diseaseRepository;

  public InformationStatementTemplateService(
      InformationStatementTemplateMapper informationStatementTemplateMapper,
      InformationStatementTemplateRepository informationStatementTemplateRepository,
      DiseaseRepository diseaseRepository) {
    this.informationStatementTemplateMapper = informationStatementTemplateMapper;

    this.informationStatementTemplateRepository = informationStatementTemplateRepository;
    this.diseaseRepository = diseaseRepository;
  }

  public GetInformationStatementTemplatesResponse readAllInformationStatementTemplates() {
    List<InformationStatementTemplateDto> informationStatementTemplateDtos =
        informationStatementTemplateRepository.findAll().stream()
            .map(informationStatementTemplateMapper::toInterfaceType)
            .sorted(Comparator.comparing(InformationStatementTemplateDto::name))
            .toList();
    return new GetInformationStatementTemplatesResponse(informationStatementTemplateDtos);
  }

  public InformationStatementTemplateDto readOneInformationStatementTemplate(UUID id) {
    InformationStatementTemplate informationStatementTemplate =
        retrieveInformationStatementTemplate(id);
    return informationStatementTemplateMapper.toInterfaceType(informationStatementTemplate);
  }

  public InformationStatementTemplateDto createInformationStatementTemplate(
      InformationStatementTemplateRequest request) {
    if (informationStatementTemplateRepository.findByName(request.name()).isPresent()) {
      throw new AlreadyExistsException(
          "Information Statement Template with name %s already exists".formatted(request.name()));
    }

    Set<Disease> diseases = retrieveDiseases(request.diseaseIDs());

    InformationStatementTemplate informationStatementTemplate =
        informationStatementTemplateRepository.save(
            informationStatementTemplateMapper.toDomainType(request, diseases));

    log.info("Saved new Information Statement Template: {}", informationStatementTemplate);

    return informationStatementTemplateMapper.toInterfaceType(informationStatementTemplate);
  }

  public InformationStatementTemplateDto updateInformationStatementTemplate(
      UUID id, InformationStatementTemplateRequest request) {
    Optional<InformationStatementTemplate> optionalInformationStatementTemplate =
        informationStatementTemplateRepository.findByName(request.name());
    if (optionalInformationStatementTemplate.isPresent()
        && !optionalInformationStatementTemplate.get().getId().equals(id)) {
      throw new AlreadyExistsException(
          "Information Statement Template with name %s already exists".formatted(request.name()));
    }

    InformationStatementTemplate informationStatementTemplate =
        retrieveInformationStatementTemplate(id);
    if (informationStatementTemplate.getState() == InformationStatementTemplateState.FINAL)
      throw new BadRequestException("Cannot change a FINAL template");

    Set<Disease> diseases = retrieveDiseases(request.diseaseIDs());
    InformationStatementTemplateMapper.updateInformationStatementTemplate(
        request, informationStatementTemplate, diseases);

    informationStatementTemplateRepository.flush();

    log.info("Changed an Information Statement Template: {} ", id);

    return informationStatementTemplateMapper.toInterfaceType(informationStatementTemplate);
  }

  public void deleteInformationStatementTemplate(UUID id) {
    if (!informationStatementTemplateRepository.existsById(id)) {
      throw new NotFoundException("Information Statement Template not found");
    }
    informationStatementTemplateRepository.deleteById(id);

    log.info("Deleted an Information Statement Template: {}", id);
  }

  private InformationStatementTemplate retrieveInformationStatementTemplate(UUID id) {
    return informationStatementTemplateRepository
        .findById(id)
        .orElseThrow(() -> new NotFoundException("InformationStatementTemplate not found"));
  }

  private Set<Disease> retrieveDiseases(List<UUID> uuids) {
    return uuids == null
        ? null
        : uuids.stream()
            .map(
                uuid ->
                    diseaseRepository
                        .findById(uuid)
                        .orElseThrow(() -> new BadRequestException("No such disease: " + uuid)))
            .collect(Collectors.toSet());
  }
}
