/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.packlistdefinition.mapper;

import de.eshg.inspection.objecttype.persistence.ObjectType;
import de.eshg.inspection.objecttype.persistence.ObjectTypeRepository;
import de.eshg.inspection.packlistdefinition.api.AddPacklistDefinitionRevisionRequest;
import de.eshg.inspection.packlistdefinition.api.CreateNewPacklistDefinitionRequest;
import de.eshg.inspection.packlistdefinition.persistence.PacklistDefinition;
import de.eshg.inspection.packlistdefinition.persistence.PacklistDefinitionElement;
import de.eshg.inspection.packlistdefinition.persistence.PacklistDefinitionRevision;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.rest.service.security.CurrentUserHelper;
import java.time.Clock;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class PacklistDefinitionEntityMapper {

  private final ObjectTypeRepository objectTypeRepository;
  private final Clock clock;

  public PacklistDefinitionEntityMapper(ObjectTypeRepository objectTypeRepository, Clock clock) {
    this.objectTypeRepository = objectTypeRepository;
    this.clock = clock;
  }

  public PacklistDefinition entityFrom(CreateNewPacklistDefinitionRequest request) {
    PacklistDefinition definition = new PacklistDefinition();
    ObjectType objectType = findObjectType(request.objectTypeId());
    definition.setObjectType(objectType);

    PacklistDefinitionRevision revision = new PacklistDefinitionRevision();
    revision.setValidFrom(Instant.now(clock));
    revision.setValidTo(null);
    revision.setRevision(1);
    revision.setName(request.name());
    revision.setDescription(request.description());
    revision.setModifiedBy(CurrentUserHelper.getCurrentUserId());
    revision.addElements(elementsFrom(request.elements()));
    definition.addNewRevision(revision); // also sets revision.name to definition

    return definition;
  }

  public PacklistDefinitionRevision entityFrom(
      AddPacklistDefinitionRevisionRequest request,
      PacklistDefinition definition,
      int newRevision) {
    PacklistDefinitionRevision revision = new PacklistDefinitionRevision();
    revision.setValidFrom(Instant.now(clock));
    revision.setValidTo(null);
    revision.setRevision(newRevision);
    revision.setName(request.name());
    revision.setDescription(request.description());
    revision.setModifiedBy(CurrentUserHelper.getCurrentUserId());
    revision.addElements(elementsFrom(request.elements()));
    definition.addNewRevision(revision); // also sets revision.name to definition

    return revision;
  }

  List<PacklistDefinitionElement> elementsFrom(List<String> elementTexts) {
    List<PacklistDefinitionElement> elements = new ArrayList<>(elementTexts.size());
    for (int i = 0; i < elementTexts.size(); i++) {
      elements.add(elementFrom(elementTexts.get(i), i));
    }
    return elements;
  }

  PacklistDefinitionElement elementFrom(String elementText, int position) {
    PacklistDefinitionElement packlistDefinitionElement = new PacklistDefinitionElement();
    packlistDefinitionElement.setPosition(position);
    packlistDefinitionElement.setText(elementText);
    return packlistDefinitionElement;
  }

  private ObjectType findObjectType(UUID objectTypeId) {
    if (objectTypeId != null) {
      return objectTypeRepository
          .findById(objectTypeId)
          .orElseThrow(() -> new NotFoundException("Unknown objectTypeId"));
    }
    throw new BadRequestException("missing objectTypeId");
  }
}
