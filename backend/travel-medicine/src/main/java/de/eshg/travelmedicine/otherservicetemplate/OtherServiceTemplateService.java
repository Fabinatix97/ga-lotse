/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.otherservicetemplate;

import de.eshg.rest.service.error.AlreadyExistsException;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.travelmedicine.otherservicetemplate.api.GetOtherServiceTemplatesResponse;
import de.eshg.travelmedicine.otherservicetemplate.api.OtherServiceTemplateDto;
import de.eshg.travelmedicine.otherservicetemplate.api.PostPutOtherServiceTemplateRequest;
import de.eshg.travelmedicine.otherservicetemplate.persistence.entity.OtherServiceTemplate;
import de.eshg.travelmedicine.otherservicetemplate.persistence.entity.OtherServiceTemplateRepository;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class OtherServiceTemplateService {
  private final OtherServiceTemplateRepository otherServiceTemplateRepository;

  public OtherServiceTemplateService(
      OtherServiceTemplateRepository otherServiceTemplateRepository) {
    this.otherServiceTemplateRepository = otherServiceTemplateRepository;
  }

  public GetOtherServiceTemplatesResponse getOtherServiceTemplatesResponse() {
    List<OtherServiceTemplateDto> otherServiceTemplateDtos =
        otherServiceTemplateRepository.findAll().stream()
            .map(OtherServiceTemplateMapper::toInterfaceType)
            .sorted(Comparator.comparing(OtherServiceTemplateDto::description))
            .toList();
    return new GetOtherServiceTemplatesResponse(otherServiceTemplateDtos);
  }

  public OtherServiceTemplateDto createOtherServiceTemplate(
      PostPutOtherServiceTemplateRequest request) {
    String description = request.description().trim();
    otherServiceTemplateRepository
        .findByDescription(description)
        .ifPresent(
            existingOtherServiceTemplate -> {
              throw new AlreadyExistsException("OtherServiceTemplate exists: " + description);
            });
    OtherServiceTemplate newOtherServiceTemplate = new OtherServiceTemplate();
    newOtherServiceTemplate.setDescription(description);
    newOtherServiceTemplate.setFee(request.fee());
    otherServiceTemplateRepository.save(newOtherServiceTemplate);
    return OtherServiceTemplateMapper.toInterfaceType(newOtherServiceTemplate);
  }

  public OtherServiceTemplateDto updateOtherServiceTemplate(
      UUID id, PostPutOtherServiceTemplateRequest request) {
    String newDescription = request.description();
    Optional<OtherServiceTemplate> foundByDescription =
        otherServiceTemplateRepository.findByDescription(newDescription);
    if (foundByDescription.isPresent() && !foundByDescription.get().getId().equals(id)) {
      throw new AlreadyExistsException("OtherServiceTemplate exists: " + newDescription);
    }

    OtherServiceTemplate otherServiceTemplate = retrieveOtherServiceTemplateFromRepo(id);
    otherServiceTemplate.setDescription(request.description());
    otherServiceTemplate.setFee(request.fee());
    otherServiceTemplateRepository.flush();
    return OtherServiceTemplateMapper.toInterfaceType(otherServiceTemplate);
  }

  public void deleteOtherServiceTemplate(UUID id) {
    OtherServiceTemplate otherServiceTemplate = retrieveOtherServiceTemplateFromRepo(id);
    otherServiceTemplateRepository.delete(otherServiceTemplate);
  }

  private OtherServiceTemplate retrieveOtherServiceTemplateFromRepo(UUID id) {
    return otherServiceTemplateRepository
        .findById(id)
        .orElseThrow(() -> new NotFoundException("OtherServiceTemplate not found"));
  }
}
