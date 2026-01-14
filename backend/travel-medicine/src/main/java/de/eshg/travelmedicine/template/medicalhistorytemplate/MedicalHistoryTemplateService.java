/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.template.medicalhistorytemplate;

import static de.eshg.rest.service.security.CurrentUserHelper.getCurrentUserId;

import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.travelmedicine.template.medicalhistorytemplate.api.GetMedicalHistoryTemplatesResponse;
import de.eshg.travelmedicine.template.medicalhistorytemplate.api.MedicalHistoryTemplateDto;
import de.eshg.travelmedicine.template.medicalhistorytemplate.api.PatchMedicalHistoryTemplateFlagRequest;
import de.eshg.travelmedicine.template.medicalhistorytemplate.api.PostPutMedicalHistoryTemplateRequest;
import de.eshg.travelmedicine.template.medicalhistorytemplate.persistence.entity.MedicalHistoryTemplate;
import de.eshg.travelmedicine.template.medicalhistorytemplate.persistence.entity.MedicalHistoryTemplateRepository;
import de.eshg.travelmedicine.template.medicalhistorytemplate.persistence.entity.MedicalHistoryTemplateState;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class MedicalHistoryTemplateService {

  private static final Logger log = LoggerFactory.getLogger(MedicalHistoryTemplateService.class);

  private final MedicalHistoryTemplateRepository medicalHistoryTemplateRepository;

  public MedicalHistoryTemplateService(
      MedicalHistoryTemplateRepository medicalHistoryTemplateRepository) {

    this.medicalHistoryTemplateRepository = medicalHistoryTemplateRepository;
  }

  public GetMedicalHistoryTemplatesResponse readAllMedicalHistoryTemplates() {
    List<MedicalHistoryTemplateDto> medicalHistoryTemplateDtos =
        medicalHistoryTemplateRepository.findAllOrderByTitle().stream()
            .map(MedicalHistoryTemplateMapper::toInterfaceType)
            .sorted(Comparator.comparing(MedicalHistoryTemplateDto::title))
            .toList();
    return new GetMedicalHistoryTemplatesResponse(medicalHistoryTemplateDtos);
  }

  public MedicalHistoryTemplateDto readOneMedicalHistoryTemplate(UUID id) {
    MedicalHistoryTemplate medicalHistoryTemplate = retrieveMedicalHistoryTemplate(id);
    return MedicalHistoryTemplateMapper.toInterfaceType(medicalHistoryTemplate);
  }

  public MedicalHistoryTemplateDto createMedicalHistoryTemplate(
      PostPutMedicalHistoryTemplateRequest request) {

    MedicalHistoryTemplate medicalHistoryTemplate =
        medicalHistoryTemplateRepository.save(MedicalHistoryTemplateMapper.toDomainType(request));
    log.info("Saved new Medical History Template: {}", medicalHistoryTemplate);

    return MedicalHistoryTemplateMapper.toInterfaceType(medicalHistoryTemplate);
  }

  public MedicalHistoryTemplateDto updateMedicalHistoryTemplate(
      UUID id, PostPutMedicalHistoryTemplateRequest request) {

    MedicalHistoryTemplate medicalHistoryTemplate = retrieveMedicalHistoryTemplate(id);
    if (medicalHistoryTemplate.getState() == MedicalHistoryTemplateState.FINAL)
      throw new BadRequestException("Cannot change a FINAL template");

    MedicalHistoryTemplateMapper.updateMedicalHistoryTemplate(request, medicalHistoryTemplate);

    medicalHistoryTemplateRepository.flush();

    log.info("Changed a Medical History Template: {} ", id);

    return MedicalHistoryTemplateMapper.toInterfaceType(medicalHistoryTemplate);
  }

  public void deleteMedicalHistoryTemplate(UUID id) {
    if (!medicalHistoryTemplateRepository.existsById(id)) {
      throw new NotFoundException("Medical History Template not found");
    }
    medicalHistoryTemplateRepository.deleteById(id);

    log.info("Deleted a Medical History Template: {}", id);
  }

  private MedicalHistoryTemplate retrieveMedicalHistoryTemplate(UUID id) {
    return medicalHistoryTemplateRepository
        .findById(id)
        .orElseThrow(() -> new NotFoundException("Medical History Template not found"));
  }

  public MedicalHistoryTemplateDto updateMedicalHistoryTemplateMainFlag(
      UUID id, PatchMedicalHistoryTemplateFlagRequest request) {

    if (request.flag().equals(false))
      throw new BadRequestException("cannot change main flag to false");

    MedicalHistoryTemplate medicalHistoryTemplate = retrieveMedicalHistoryTemplate(id);
    if (medicalHistoryTemplate.getState() != MedicalHistoryTemplateState.FINAL)
      throw new BadRequestException("Cannot set main flag of a DRAFT template");

    Optional<MedicalHistoryTemplate> curMainTemplate =
        medicalHistoryTemplateRepository.findByMainFlagIsTrue();

    curMainTemplate.ifPresent(
        curr -> {
          if (!curr.getId().equals(id)) {
            MedicalHistoryTemplateMapper.updateMedicalHistoryTemplateMainFlag(
                curr, false, getCurrentUserId());
          }
        });

    MedicalHistoryTemplateMapper.updateMedicalHistoryTemplateMainFlag(
        medicalHistoryTemplate, true, getCurrentUserId());
    medicalHistoryTemplateRepository.flush();

    log.info("Updated the main flag of Medical History Template: {} ", id);

    return MedicalHistoryTemplateMapper.toInterfaceType(medicalHistoryTemplate);
  }

  public MedicalHistoryTemplateDto updateMedicalHistoryTemplateFollowUpFlag(
      UUID id, PatchMedicalHistoryTemplateFlagRequest request) {

    if (request.flag().equals(false))
      throw new BadRequestException("cannot change follow up flag to false");

    MedicalHistoryTemplate medicalHistoryTemplate = retrieveMedicalHistoryTemplate(id);
    if (medicalHistoryTemplate.getState() != MedicalHistoryTemplateState.FINAL)
      throw new BadRequestException("Cannot set follow up flag of a DRAFT template");

    Optional<MedicalHistoryTemplate> curFollowUpTemplate =
        medicalHistoryTemplateRepository.findByFollowUpFlagIsTrue();

    curFollowUpTemplate.ifPresent(
        curr -> {
          if (!curr.getId().equals(id)) {
            MedicalHistoryTemplateMapper.updateMedicalHistoryTemplateFollowUpFlag(
                curr, false, getCurrentUserId());
          }
        });

    MedicalHistoryTemplateMapper.updateMedicalHistoryTemplateFollowUpFlag(
        medicalHistoryTemplate, true, getCurrentUserId());
    medicalHistoryTemplateRepository.flush();

    log.info("Updated the follow up flag of a Medical History Template: {} ", id);

    return MedicalHistoryTemplateMapper.toInterfaceType(medicalHistoryTemplate);
  }
}
