/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.template.medicalhistorytemplate;

import static de.eshg.rest.service.security.CurrentUserHelper.getCurrentUserId;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.travelmedicine.template.api.TemplateContentDto;
import de.eshg.travelmedicine.template.medicalhistorytemplate.api.MedicalHistoryTemplateDto;
import de.eshg.travelmedicine.template.medicalhistorytemplate.api.MedicalHistoryTemplateStateDto;
import de.eshg.travelmedicine.template.medicalhistorytemplate.api.PostPutMedicalHistoryTemplateRequest;
import de.eshg.travelmedicine.template.medicalhistorytemplate.persistence.entity.MedicalHistoryTemplate;
import de.eshg.travelmedicine.template.medicalhistorytemplate.persistence.entity.MedicalHistoryTemplateState;
import java.util.UUID;

public class MedicalHistoryTemplateMapper {
  private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

  private MedicalHistoryTemplateMapper() {}

  public static MedicalHistoryTemplateDto toInterfaceType(
      MedicalHistoryTemplate medicalHistoryTemplate) {
    TemplateContentDto medicalHistoryTemplateContent;
    try {
      medicalHistoryTemplateContent =
          OBJECT_MAPPER.readValue(medicalHistoryTemplate.getContent(), TemplateContentDto.class);
    } catch (JsonProcessingException e) {
      throw new IllegalArgumentException("Content does not match required structure");
    }
    return new MedicalHistoryTemplateDto(
        medicalHistoryTemplate.getId(),
        medicalHistoryTemplate.getTitle(),
        toInterfaceType(medicalHistoryTemplate.getState()),
        medicalHistoryTemplateContent,
        medicalHistoryTemplate.getMainFlag(),
        medicalHistoryTemplate.getFollowUpFlag(),
        medicalHistoryTemplate.getCreatedAt(),
        medicalHistoryTemplate.getModifiedAt());
  }

  public static MedicalHistoryTemplate toDomainType(
      PostPutMedicalHistoryTemplateRequest medicalHistoryTemplateRequest) {
    String content;
    try {
      content = OBJECT_MAPPER.writeValueAsString(medicalHistoryTemplateRequest.content());
    } catch (JsonProcessingException e) {
      throw new BadRequestException("Content does not match required structure");
    }

    return new MedicalHistoryTemplate(
        medicalHistoryTemplateRequest.title(),
        toDomainType(medicalHistoryTemplateRequest.state()),
        content,
        getCurrentUserId());
  }

  public static void updateMedicalHistoryTemplate(
      PostPutMedicalHistoryTemplateRequest medicalHistoryTemplateRequest,
      MedicalHistoryTemplate existingTemplate) {
    String content;
    try {
      content = OBJECT_MAPPER.writeValueAsString(medicalHistoryTemplateRequest.content());
    } catch (JsonProcessingException e) {
      throw new BadRequestException("Content does not match required structure");
    }

    existingTemplate.setTitle(medicalHistoryTemplateRequest.title());
    existingTemplate.setState(toDomainType(medicalHistoryTemplateRequest.state()));
    existingTemplate.setContent(content);
    existingTemplate.setModifiedBy(getCurrentUserId());
  }

  public static MedicalHistoryTemplateState toDomainType(
      MedicalHistoryTemplateStateDto medicalHistoryTemplateStateDto) {
    return MedicalHistoryTemplateState.valueOf(medicalHistoryTemplateStateDto.name());
  }

  public static MedicalHistoryTemplateStateDto toInterfaceType(
      MedicalHistoryTemplateState medicalHistoryTemplateState) {
    return MedicalHistoryTemplateStateDto.valueOf(medicalHistoryTemplateState.name());
  }

  public static void updateMedicalHistoryTemplateMainFlag(
      MedicalHistoryTemplate existingTemplate, Boolean flag, UUID currentUserId) {
    existingTemplate.setMainFlag(flag);
    existingTemplate.setModifiedBy(currentUserId);
  }

  public static void updateMedicalHistoryTemplateFollowUpFlag(
      MedicalHistoryTemplate existingTemplate, Boolean flag, UUID currentUserId) {
    existingTemplate.setFollowUpFlag(flag);
    existingTemplate.setModifiedBy(currentUserId);
  }
}
