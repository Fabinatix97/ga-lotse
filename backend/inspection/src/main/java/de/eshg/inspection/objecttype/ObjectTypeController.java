/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.objecttype;

import de.eshg.inspection.feature.InspectionFeature;
import de.eshg.inspection.feature.InspectionFeatureToggle;
import de.eshg.inspection.inspection.InspectionService;
import de.eshg.inspection.inspection.api.InspectionType;
import de.eshg.inspection.objecttype.api.GetObjectTypesHierarchyResponse;
import de.eshg.inspection.objecttype.api.GetObjectTypesResponse;
import de.eshg.inspection.objecttype.api.ObjectTypeDto;
import de.eshg.inspection.objecttype.api.SingleObjectTypeResponse;
import de.eshg.inspection.objecttype.api.UpdateObjectTypeRequest;
import de.eshg.inspection.objecttype.persistence.ObjectType;
import de.eshg.inspection.objecttype.persistence.ObjectTypeHierarchyTreeNodeRepository;
import de.eshg.inspection.objecttype.persistence.ObjectTypeRepository;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.Comparator;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = ObjectTypeController.BASE_URL, produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = "ObjectType")
public class ObjectTypeController {

  public static final String BASE_URL = BaseUrls.Inspection.OBJECT_TYPE_CONTROLLER;

  private static final Logger log = LoggerFactory.getLogger(ObjectTypeController.class);

  private final ObjectTypeRepository objectTypeRepository;
  private final ObjectTypeHierarchyTreeNodeRepository objectTypeHierarchyTreeNodeRepository;
  private final InspectionService inspectionService;
  private final InspectionFeatureToggle inspectionFeatureToggle;

  public ObjectTypeController(
      ObjectTypeRepository objectTypeRepository,
      ObjectTypeHierarchyTreeNodeRepository objectTypeHierarchyTreeNodeRepository,
      InspectionService inspectionService,
      InspectionFeatureToggle inspectionFeatureToggle) {
    this.objectTypeRepository = objectTypeRepository;
    this.objectTypeHierarchyTreeNodeRepository = objectTypeHierarchyTreeNodeRepository;
    this.inspectionService = inspectionService;
    this.inspectionFeatureToggle = inspectionFeatureToggle;
  }

  @GetMapping
  @Operation(summary = "Get all objecttypes")
  @Transactional(readOnly = true)
  public GetObjectTypesResponse getObjectTypes() {
    return new GetObjectTypesResponse(
        objectTypeRepository.findAll().stream()
            .map(ObjectTypeMapper::toDto)
            .sorted(Comparator.comparing(ObjectTypeDto::name))
            .toList());
  }

  @GetMapping(path = "/hierarchy")
  @Operation(summary = "Get the tree of all objecttypes")
  @Transactional(readOnly = true)
  public GetObjectTypesHierarchyResponse getObjectTypesHierarchy() {
    if (!inspectionFeatureToggle.isNewFeatureEnabled(InspectionFeature.OBJECT_TYPE_HIERARCHY)) {
      throw new BadRequestException("Feature toggle for object type hierarchy is not enabled!");
    }
    return new GetObjectTypesHierarchyResponse(
        objectTypeHierarchyTreeNodeRepository
            .findByRootNode(true)
            .map(ObjectTypeMapper::toDto)
            .orElseThrow());
  }

  @GetMapping(path = "/{id}")
  @Operation(summary = "Get details of an objecttype")
  @Transactional(readOnly = true)
  public SingleObjectTypeResponse getObjectType(@PathVariable("id") UUID id) {
    ObjectType objectType =
        objectTypeRepository.findById(id).orElseThrow(() -> new NotFoundException("ObjectType"));
    ObjectType savedObjectType = objectTypeRepository.save(objectType);
    ObjectTypeDto dto = ObjectTypeMapper.toDto(savedObjectType);
    return new SingleObjectTypeResponse(dto);
  }

  @PutMapping(path = "/{id}")
  @Operation(summary = "Update settings of an objecttype")
  @Transactional
  public SingleObjectTypeResponse updateObjectType(
      @PathVariable("id") UUID id, @Valid @RequestBody UpdateObjectTypeRequest request) {
    ObjectType currentObjectType =
        objectTypeRepository.findById(id).orElseThrow(() -> new NotFoundException("ObjectType"));
    Integer oldRoutineInterval = currentObjectType.getRoutineInterval();
    Integer oldComplaintInterval = currentObjectType.getComplaintInterval();

    ObjectType changedObjectType = ObjectTypeMapper.mapUpdateRequest(request, currentObjectType);
    ObjectType savedObjectType = objectTypeRepository.save(changedObjectType);

    int routineIntervalDifference = savedObjectType.getRoutineInterval() - oldRoutineInterval;
    int complaintIntervalDifference = savedObjectType.getComplaintInterval() - oldComplaintInterval;

    if (routineIntervalDifference != 0) {
      log.info(
          "Routine interval of object type {} / {} has changed. Updating inspection appointments.",
          savedObjectType.getId(),
          savedObjectType.getName());
      inspectionService.updateInspectionsWithChangedIntervals(
          savedObjectType, routineIntervalDifference, InspectionType.REGULAR);
    }
    if (complaintIntervalDifference != 0) {
      log.info(
          "Complaint interval of object type {} / {} has changed. Updating inspection appointments.",
          savedObjectType.getId(),
          savedObjectType.getName());
      inspectionService.updateInspectionsWithChangedIntervals(
          savedObjectType, complaintIntervalDifference, InspectionType.REGULAR_AFTER_INCIDENTS);
    }

    ObjectTypeDto dto = ObjectTypeMapper.toDto(savedObjectType);
    return new SingleObjectTypeResponse(dto);
  }
}
