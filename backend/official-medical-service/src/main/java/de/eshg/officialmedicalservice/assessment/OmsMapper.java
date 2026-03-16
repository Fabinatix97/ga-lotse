/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.officialmedicalservice.assessment;

import de.eshg.base.user.api.UserDto;
import de.eshg.lib.assessment.domain.model.AssessmentResult;
import de.eshg.lib.assessment.domain.model.AssessmentStatus;
import de.eshg.lib.assessment.domain.model.AssessmentType;
import de.eshg.lib.assessment.domain.model.RecipientType;
import de.eshg.officialmedicalservice.assessment.api.AssessmentDetailsDto;
import de.eshg.officialmedicalservice.assessment.api.AssessmentDto;
import de.eshg.officialmedicalservice.assessment.api.AssessmentPreviewPersonDto;
import de.eshg.officialmedicalservice.assessment.api.AssessmentResultDto;
import de.eshg.officialmedicalservice.assessment.api.AssessmentStatusDto;
import de.eshg.officialmedicalservice.assessment.api.AssessmentTypeDto;
import de.eshg.officialmedicalservice.assessment.api.CreateAssessmentDto;
import de.eshg.officialmedicalservice.assessment.api.LegalBasisDto;
import de.eshg.officialmedicalservice.assessment.api.OmsUserDto;
import de.eshg.officialmedicalservice.assessment.api.RecipientTypeDto;
import de.eshg.officialmedicalservice.assessment.api.SourceDto;
import de.eshg.officialmedicalservice.assessment.persistence.entity.MedicalAssessment;
import de.eshg.officialmedicalservice.assessment.persistence.entity.OmsLegalBasis;
import de.eshg.officialmedicalservice.assessment.persistence.entity.OmsSource;
import de.eshg.officialmedicalservice.procedure.persistence.entity.Person;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;
import org.mapstruct.factory.Mappers;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface OmsMapper {
  OmsMapper INSTANCE = Mappers.getMapper(OmsMapper.class);

  default OmsUserDto resolveUser(UUID userId, @Context Map<UUID, UserDto> users) {
    var user = users.get(userId);
    if (user == null) {
      return new OmsUserDto(userId, null);
    }
    return new OmsUserDto(user.userId(), String.join(" ", user.firstName(), user.lastName()));
  }

  default AssessmentDetailsDto mapWithDetails(
      MedicalAssessment omsAssessment,
      @Context Map<UUID, UserDto> users,
      Function<String, String> styleHtml) {
    return new AssessmentDetailsDto(
        omsAssessment.getExternalId(),
        omsAssessment.getTitle(),
        omsAssessment.getSummary(),
        omsAssessment.getDocumentContent(),
        styleHtml.apply(omsAssessment.getDocumentCache()),
        map(omsAssessment.getAssessmentResult()),
        map(omsAssessment.getAssessmentType()),
        map(omsAssessment.getAssessmentStatus()),
        map(omsAssessment.getRecipientType()),
        resolveUser(omsAssessment.getEditor(), users),
        omsAssessment.getCreated(),
        omsAssessment.getFinished(),
        mapSources(omsAssessment.getSources()),
        mapLegalBasis(omsAssessment.getLegalBases()),
        omsAssessment.getPreviewReader().stream().map(u -> resolveUser(u, users)).toList());
  }

  default AssessmentDto map(MedicalAssessment omsAssessment, @Context Map<UUID, UserDto> users) {
    return new AssessmentDto(
        omsAssessment.getExternalId(),
        omsAssessment.getTitle(),
        map(omsAssessment.getAssessmentResult()),
        map(omsAssessment.getAssessmentType()),
        map(omsAssessment.getAssessmentStatus()),
        resolveUser(omsAssessment.getEditor(), users),
        omsAssessment.getCreated(),
        omsAssessment.getFinished(),
        omsAssessment.getPreviewReader().stream().map(u -> resolveUser(u, users)).toList());
  }

  MedicalAssessment map(CreateAssessmentDto createAssessmentRequest);

  AssessmentTypeDto map(AssessmentType assessmentType);

  List<AssessmentDto> map(List<MedicalAssessment> assessments, @Context Map<UUID, UserDto> users);

  AssessmentPreviewPersonDto map(Person person);

  LegalBasisDto map(OmsLegalBasis legalBasis);

  AssessmentType map(AssessmentTypeDto assessmentTypeDto);

  RecipientType map(RecipientTypeDto assessmentTypeDto);

  OmsSource map(SourceDto sourceDto);

  OmsLegalBasis map(LegalBasisDto legalBasisDto);

  Person map(AssessmentPreviewPersonDto previewPersonDto);

  AssessmentStatus map(AssessmentStatusDto assessmentStatusDto);

  AssessmentResult map(AssessmentResultDto assessmentResultDto);

  AssessmentStatusDto map(AssessmentStatus assessmentStatus);

  AssessmentResultDto map(AssessmentResult assessmentResult);

  RecipientTypeDto map(RecipientType recipientType);

  List<SourceDto> mapSources(List<OmsSource> sources);

  List<LegalBasisDto> mapLegalBasis(List<OmsLegalBasis> legalBasis);
}
