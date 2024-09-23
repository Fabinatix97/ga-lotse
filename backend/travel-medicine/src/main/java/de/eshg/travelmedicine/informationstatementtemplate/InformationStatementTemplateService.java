/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.informationstatementtemplate;

import de.eshg.lib.editor.api.model.EditorBodyDto;
import de.eshg.lib.editor.api.model.EditorDto;
import de.eshg.lib.editor.api.model.MoveOperation;
import de.eshg.lib.editor.api.model.element.EditorElementDto;
import de.eshg.rest.service.error.AlreadyExistsException;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.travelmedicine.disease.persistence.entity.Disease;
import de.eshg.travelmedicine.disease.persistence.entity.DiseaseRepository;
import de.eshg.travelmedicine.featuretoggle.TravelMedicineFeature;
import de.eshg.travelmedicine.featuretoggle.TravelMedicineFeatureToggle;
import de.eshg.travelmedicine.informationstatementtemplate.api.GetInformationStatementTemplatesResponse;
import de.eshg.travelmedicine.informationstatementtemplate.api.InformationStatementTemplateDto;
import de.eshg.travelmedicine.informationstatementtemplate.api.InformationStatementTemplateRequest;
import de.eshg.travelmedicine.informationstatementtemplate.persistence.entity.ElementRepository;
import de.eshg.travelmedicine.informationstatementtemplate.persistence.entity.InformationStatementTemplate;
import de.eshg.travelmedicine.informationstatementtemplate.persistence.entity.InformationStatementTemplateRepository;
import de.eshg.travelmedicine.informationstatementtemplate.persistence.entity.InformationStatementTemplateState;
import de.eshg.travelmedicine.informationstatementtemplate.persistence.entity.element.Element;
import de.eshg.travelmedicine.informationstatementtemplate.persistence.entity.element.ElementText;
import de.eshg.travelmedicine.informationstatementtemplate.persistence.entity.element.ElementTextBlock;
import java.util.ArrayList;
import java.util.Collections;
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
  private final ElementRepository elementRepository;
  private final TravelMedicineFeatureToggle featureToggle;
  private final InformationStatementTemplateEditorMapper informationStatementTemplateEditorMapper;

  public InformationStatementTemplateService(
      InformationStatementTemplateMapper informationStatementTemplateMapper,
      InformationStatementTemplateRepository informationStatementTemplateRepository,
      DiseaseRepository diseaseRepository,
      ElementRepository elementRepository,
      TravelMedicineFeatureToggle featureToggle,
      InformationStatementTemplateEditorMapper informationStatementTemplateEditorMapper) {
    this.informationStatementTemplateMapper = informationStatementTemplateMapper;

    this.informationStatementTemplateRepository = informationStatementTemplateRepository;
    this.diseaseRepository = diseaseRepository;
    this.elementRepository = elementRepository;
    this.featureToggle = featureToggle;
    this.informationStatementTemplateEditorMapper = informationStatementTemplateEditorMapper;
  }

  public GetInformationStatementTemplatesResponse readAllInformationStatementTemplates() {
    featureToggle.assertNewFeatureIsEnabled(
        TravelMedicineFeature.CITIZEN_PORTAL_INFORMATION_STATEMENT);
    List<InformationStatementTemplateDto> informationStatementTemplateDtos =
        informationStatementTemplateRepository.findAll().stream()
            .map(informationStatementTemplateMapper::toInterfaceType)
            .sorted(Comparator.comparing(InformationStatementTemplateDto::name))
            .toList();
    return new GetInformationStatementTemplatesResponse(informationStatementTemplateDtos);
  }

  public InformationStatementTemplateDto readOneInformationStatementTemplate(UUID id) {
    featureToggle.assertNewFeatureIsEnabled(
        TravelMedicineFeature.CITIZEN_PORTAL_INFORMATION_STATEMENT);
    InformationStatementTemplate informationStatementTemplate =
        retrieveInformationStatementTemplate(id);
    return informationStatementTemplateMapper.toInterfaceType(informationStatementTemplate);
  }

  public InformationStatementTemplateDto createInformationStatementTemplate(
      InformationStatementTemplateRequest request) {
    featureToggle.assertNewFeatureIsEnabled(
        TravelMedicineFeature.CITIZEN_PORTAL_INFORMATION_STATEMENT);
    if (informationStatementTemplateRepository.findByName(request.name()).isPresent()) {
      throw new AlreadyExistsException(
          "Information Statement Template with name %s already exists".formatted(request.name()));
    }

    Set<Disease> diseases = retrieveDiseases(request.diseaseIDs());

    InformationStatementTemplate informationStatementTemplate =
        informationStatementTemplateRepository.save(
            informationStatementTemplateMapper.toDomainType(request, diseases));
    if (request.editorElements() != null) {
      request
          .editorElements()
          .forEach(
              editorElementDto ->
                  insertReportElement(
                      informationStatementTemplate.getExternalId(),
                      InformationStatementTemplateEditorMapper.elementToReportElement(
                          editorElementDto),
                      null));
    } else {
      ElementText block = new ElementText();
      block.setText("Textblock");
      block.setEditable(true);
      block.setMoveable(true);
      block.setDeletable(true);
      insertReportElement(informationStatementTemplate.getExternalId(), block, null);
    }
    log.info("Saved new Information Statement Template: {}", informationStatementTemplate);

    return informationStatementTemplateMapper.toInterfaceType(informationStatementTemplate);
  }

  public InformationStatementTemplateDto updateInformationStatementTemplate(
      UUID id, InformationStatementTemplateRequest request) {
    featureToggle.assertNewFeatureIsEnabled(
        TravelMedicineFeature.CITIZEN_PORTAL_INFORMATION_STATEMENT);
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
    featureToggle.assertNewFeatureIsEnabled(
        TravelMedicineFeature.CITIZEN_PORTAL_INFORMATION_STATEMENT);
    if (!informationStatementTemplateRepository.existsById(id)) {
      throw new NotFoundException("Information Statement Template not found: " + id);
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

  public EditorDto loadEditor(UUID id) {
    featureToggle.assertNewFeatureIsEnabled(
        TravelMedicineFeature.CITIZEN_PORTAL_INFORMATION_STATEMENT);
    Optional<InformationStatementTemplate> informationStatementTemplate =
        informationStatementTemplateRepository.findById(id);
    if (informationStatementTemplate.isPresent()) {
      return informationStatementTemplateEditorMapper.mapElementsToInterfaceType(
          informationStatementTemplate.get());
    } else {
      return new EditorDto(UUID.randomUUID(), new EditorBodyDto(Collections.emptyList()));
    }
  }

  public EditorElementDto insertReportElement(UUID id, Element element, Integer insertAfter) {
    featureToggle.assertNewFeatureIsEnabled(
        TravelMedicineFeature.CITIZEN_PORTAL_INFORMATION_STATEMENT);
    InformationStatementTemplate informationStatementTemplate =
        retrieveInformationStatementTemplate(id);
    List<Element> reportElements = informationStatementTemplate.getElements();
    if (reportElements == null) {
      reportElements = new ArrayList<>();
    }
    int pos;
    if (insertAfter == null) {
      // add at end
      reportElements.add(element);
      pos = reportElements.size() - 1;
    } else {
      // insert after position `insertAfter`
      if (insertAfter < 0 || insertAfter >= informationStatementTemplate.getElements().size()) {
        throw new BadRequestException("insertAfter out of range: " + insertAfter);
      }
      pos = insertAfter + 1;
      reportElements.add(pos, element);
    }
    // adjust positions
    adjustPosition(reportElements, pos);
    // ensure that child elements are properly persisted
    elementRepository.saveAndFlush(element);
    // save to enforce creation of new ids
    informationStatementTemplate =
        informationStatementTemplateRepository.saveAndFlush(informationStatementTemplate);
    return informationStatementTemplateEditorMapper.elementToEditorElementDto(
        informationStatementTemplate.getElements().get(pos));
  }

  public EditorElementDto updateReportElement(
      UUID id,
      UUID elementId,
      UUID answerId,
      String title,
      String text,
      MoveOperation moveOperation) {
    featureToggle.assertNewFeatureIsEnabled(
        TravelMedicineFeature.CITIZEN_PORTAL_INFORMATION_STATEMENT);
    InformationStatementTemplate informationStatementTemplate =
        retrieveInformationStatementTemplate(id);
    Element element = getReportElement(informationStatementTemplate, elementId);

    if (title != null || text != null) {
      element = updateElementText(element, answerId, title, text);
    }
    if (moveOperation != null) {
      element = moveElement(informationStatementTemplate, element, moveOperation);
    }
    return informationStatementTemplateEditorMapper.elementToEditorElementDto(element);
  }

  private Element updateElementText(
      Element reportElement, UUID answerId, String title, String text) {

    if (!reportElement.isEditable()) {
      throw new BadRequestException("Element is not editable");
    }

    Element updatedElement =
        switch (reportElement.getType()) {
          case TEXT -> updateText((ElementText) reportElement, text);
          case TEXT_BLOCK -> updateTextBlock((ElementTextBlock) reportElement, text);
          default ->
              throw new BadRequestException("Unsupported element type: " + reportElement.getType());
        };
    return elementRepository.saveAndFlush(updatedElement);
  }

  private Element updateText(ElementText reportElement, String text) {
    reportElement.setText(text);
    return reportElement;
  }

  private Element updateTextBlock(ElementTextBlock reportElement, String text) {
    reportElement.setText(text);
    return reportElement;
  }

  private Element moveElement(
      InformationStatementTemplate informationStatementTemplate,
      Element reportElement,
      MoveOperation moveOperation) {

    if (!reportElement.isMoveable()) {
      throw new BadRequestException("Element is not moveable");
    }

    int oldPosition = reportElement.getPosition();

    if (moveOperation == MoveOperation.UP) {
      switchPosition(informationStatementTemplate, reportElement, oldPosition, oldPosition - 1);
    } else if (moveOperation == MoveOperation.DOWN) {
      switchPosition(informationStatementTemplate, reportElement, oldPosition, oldPosition + 1);
    } else {
      throw new UnsupportedOperationException("Move operation not supported");
    }

    return elementRepository.saveAndFlush(reportElement);
  }

  private Element switchPosition(
      InformationStatementTemplate informationStatementTemplate,
      Element reportElement,
      int oldPosition,
      int switchPosition) {
    Element switchElement = getElementByPosition(informationStatementTemplate, switchPosition);
    switchElement.setPosition(oldPosition);
    reportElement.setPosition(switchPosition);
    return elementRepository.saveAndFlush(switchElement);
  }

  private static Element getElementByPosition(
      InformationStatementTemplate informationStatementTemplate, int position) {
    return informationStatementTemplate.getElements().stream()
        .filter(el -> position == el.getPosition())
        .findFirst()
        .orElseThrow(() -> new NotFoundException("Element not found by position"));
  }

  private static void adjustPosition(List<Element> elements, int deletedPosition) {
    for (int i = deletedPosition; i < elements.size(); i++) {
      elements.get(i).setPosition(i);
    }
  }

  public void deleteReportElement(UUID id, UUID elementId) {
    featureToggle.assertNewFeatureIsEnabled(
        TravelMedicineFeature.CITIZEN_PORTAL_INFORMATION_STATEMENT);
    InformationStatementTemplate informationStatementTemplate =
        retrieveInformationStatementTemplate(id);
    Element element = getReportElement(informationStatementTemplate, elementId);
    if (!element.isDeletable()) {
      throw new BadRequestException("Element is not deletable");
    }
    List<Element> elements = informationStatementTemplate.getElements();
    int deletedPosition = element.getPosition();
    elements.remove(deletedPosition);
    adjustPosition(elements, deletedPosition);
  }

  private static Element getReportElement(
      InformationStatementTemplate informationStatementTemplate, UUID elementId) {
    return informationStatementTemplate.getElements().stream()
        .filter(el -> el.getExternalId().equals(elementId))
        .findFirst()
        .orElseThrow(() -> new NotFoundException("Element not found"));
  }
}
