/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.document.informationstatement;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.travelmedicine.document.api.DocumentContentDto;
import de.eshg.travelmedicine.document.informationstatement.api.InformationStatementDto;
import de.eshg.travelmedicine.document.informationstatement.persistence.entity.InformationStatement;
import de.eshg.travelmedicine.notification.NotificationService;
import de.eshg.travelmedicine.template.informationstatementtemplate.persistence.entity.InformationStatementTemplate;
import de.eshg.travelmedicine.template.informationstatementtemplate.persistence.entity.InformationStatementTemplateRepository;
import de.eshg.travelmedicine.template.informationstatementtemplate.persistence.entity.InformationStatementTemplateState;
import de.eshg.travelmedicine.vaccinationconsultation.ProcedureAccessor;
import de.eshg.travelmedicine.vaccinationconsultation.VaccinationConsultationService;
import de.eshg.travelmedicine.vaccinationconsultation.api.GetInformationStatementsResponse;
import de.eshg.travelmedicine.vaccinationconsultation.api.PostInformationStatementsRequest;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.CreatedByUserType;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.VaccinationConsultation;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class InformationStatementService {

  private final ProcedureAccessor procedureAccessor;
  private final InformationStatementTemplateRepository informationStatementTemplateRepository;
  private final InformationStatementMapper informationStatementMapper;
  private final InformationStatementFactory informationStatementFactory;
  private final NotificationService notificationService;
  private final VaccinationConsultationService vaccinationConsultationService;
  private final ObjectMapper objectMapper = new ObjectMapper();

  public InformationStatementService(
      ProcedureAccessor procedureAccessor,
      InformationStatementTemplateRepository informationStatementTemplateRepository,
      InformationStatementMapper informationStatementMapper,
      InformationStatementFactory informationStatementFactory,
      NotificationService notificationService,
      VaccinationConsultationService vaccinationConsultationService) {
    this.procedureAccessor = procedureAccessor;
    this.informationStatementTemplateRepository = informationStatementTemplateRepository;
    this.informationStatementMapper = informationStatementMapper;
    this.informationStatementFactory = informationStatementFactory;
    this.notificationService = notificationService;
    this.vaccinationConsultationService = vaccinationConsultationService;
  }

  public DocumentContentDto getInformationStatementForCitizenPortal(
      UUID citizenUserId, UUID informationStatementId) {
    InformationStatement informationStatement =
        findInformationStatement(citizenUserId, informationStatementId);

    if (informationStatement.isCitizenHasAnswered()) {
      throw new BadRequestException("Information statement already answered.");
    }

    return informationStatementMapper
        .mapInformationStatementToInterfaceType(informationStatement)
        .content();
  }

  public GetInformationStatementsResponse getInformationStatementsForEmployeePortal(
      UUID procedureId) {
    VaccinationConsultation vaccinationConsultation =
        procedureAccessor.accessProcedure(procedureId, ProcedureAccessor.noChecks);

    List<InformationStatementDto> informationStatements =
        informationStatementMapper.mapInformationStatementsToInterfaceType(
            vaccinationConsultation.getInformationStatements());
    return new GetInformationStatementsResponse(procedureId, informationStatements);
  }

  private InformationStatement findInformationStatement(
      UUID citizenUserId, UUID informationStatementId) {
    return procedureAccessor.accessInformationStatement(
        informationStatementId,
        null,
        List.of(new ProcedureAccessor.CheckCitizenUserId(citizenUserId)));
  }

  public void patchInformationStatementForCitizenPortal(
      UUID citizenUserId,
      UUID informationStatementId,
      DocumentContentDto patchInformationStatementContent) {

    InformationStatement statementToPatch =
        findInformationStatement(citizenUserId, informationStatementId);

    if (statementToPatch.isCitizenHasAnswered()) {
      throw new BadRequestException("Information statement already answered.");
    }

    statementToPatch.setContent(toJsonString(patchInformationStatementContent));
    statementToPatch.setCitizenHasAnswered(true);
  }

  public List<UUID> addInformationStatements(
      UUID procedureId, PostInformationStatementsRequest request) {
    VaccinationConsultation vaccinationConsultation =
        procedureAccessor.accessProcedure(procedureId, ProcedureAccessor.checkNotClosed);

    List<InformationStatement> newStatements =
        request.templateIds().stream()
            .map(
                templateID -> {
                  InformationStatementTemplate template =
                      informationStatementTemplateRepository
                          .findById(templateID)
                          .orElseThrow(
                              () -> new NotFoundException("No such template: " + templateID));
                  if (template.getState() != InformationStatementTemplateState.FINAL)
                    throw new BadRequestException(
                        "The template can't be used until it's in its FINAL state.");
                  return template;
                })
            .map(informationStatementFactory::createInformationStatement)
            .toList();

    vaccinationConsultation.getInformationStatements().addAll(newStatements);
    newStatements.forEach(s -> s.setVaccinationConsultation(vaccinationConsultation));
    if (vaccinationConsultation.getCreatedBy() == CreatedByUserType.CITIZEN_PORTAL) {
      notificationService.notifyNewInformationStatement(
          vaccinationConsultationService.patientOf(vaccinationConsultation));
    }
    informationStatementTemplateRepository.flush();
    return newStatements.stream().map(InformationStatement::getId).toList();
  }

  public void deleteInformationStatement(UUID procedureId, UUID informationStatementId) {
    InformationStatement informationStatement =
        procedureAccessor.accessInformationStatement(
            informationStatementId, procedureId, ProcedureAccessor.checkNotClosed);

    VaccinationConsultation vaccinationConsultation =
        informationStatement.getVaccinationConsultation();

    vaccinationConsultation.getInformationStatements().remove(informationStatement);
  }

  private String toJsonString(Object content) {
    try {
      return objectMapper.writeValueAsString(content);
    } catch (JsonProcessingException e) {
      throw new BadRequestException("Content does not match required structure");
    }
  }
}
