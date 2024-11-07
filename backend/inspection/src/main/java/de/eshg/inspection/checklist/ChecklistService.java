/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.checklist;

import de.eshg.inspection.checklist.api.ChecklistDto;
import de.eshg.inspection.checklist.api.GetChecklistsResponse;
import de.eshg.inspection.checklist.api.update.UpdateChecklistDto;
import de.eshg.inspection.checklist.api.update.element.UpdateChecklistElementDto;
import de.eshg.inspection.checklist.mapper.ChecklistDtoMapper;
import de.eshg.inspection.checklist.mapper.ChecklistEntityMapper;
import de.eshg.inspection.checklist.persistence.Checklist;
import de.eshg.inspection.checklist.persistence.element.ChecklistElement;
import de.eshg.inspection.checklistdefinition.persistence.ChecklistDefinitionVersion;
import de.eshg.inspection.incident.persistence.InspectionIncidentRepository;
import de.eshg.inspection.inspection.persistence.Inspection;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class ChecklistService {

  private final InspectionIncidentRepository incidentRepository;
  private final ChecklistEntityMapper checklistEntityMapper;

  public ChecklistService(
      InspectionIncidentRepository incidentRepository,
      ChecklistEntityMapper checklistEntityMapper) {
    this.incidentRepository = incidentRepository;
    this.checklistEntityMapper = checklistEntityMapper;
  }

  /** create new checklists for the given selected checklist definition versions. */
  public static List<Checklist> createChecklists(
      List<ChecklistDefinitionVersion> versions, Inspection inspection) {
    return versions.stream()
        .map(cldv -> ChecklistService.createChecklist(cldv, inspection))
        .toList();
  }

  public static Checklist createChecklist(
      ChecklistDefinitionVersion version, Inspection inspection) {
    Checklist checklist = new Checklist();
    checklist.setInspection(inspection);
    checklist.setChecklistDefinitionVersion(version);
    version
        .getSections()
        .forEach(section -> checklist.addSection(ChecklistEntityMapper.newEntityFrom(section)));
    return checklist;
  }

  public GetChecklistsResponse getChecklists(Inspection inspection) {
    return ChecklistDtoMapper.dtoFrom(inspection.getChecklists());
  }

  public ChecklistDto updateChecklist(Checklist checklist, UpdateChecklistDto updateChecklist) {
    for (UpdateChecklistElementDto updateElementDto : updateChecklist.elements()) {
      ChecklistElement updatedElement =
          checklistEntityMapper.updateElement(checklist, updateElementDto);
      if (updatedElement.getInspectionIncident() != null) {
        incidentRepository.save(updatedElement.getInspectionIncident());
      }
    }
    return ChecklistDtoMapper.dtoFrom(checklist);
  }
}
