/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.inspection;

import de.eshg.inspection.inspection.api.InspectionAnnouncementType;
import de.eshg.inspection.inspection.persistence.Inspection;
import de.eshg.lib.procedure.domain.factory.SystemProgressEntryFactory;
import de.eshg.lib.procedure.domain.model.SystemProgressEntry;
import de.eshg.lib.procedure.domain.model.TriggerType;
import java.util.UUID;
import org.springframework.stereotype.Component;

@Component
public class InspectionProgressEntryService {

  public void createProgressEntryForUpdateFacility(
      Inspection inspection, UUID previousFacilityFileStateId) {

    SystemProgressEntry progressEntry =
        SystemProgressEntryFactory.createSystemProgressEntry(
            "INSPECTION_FACILITY_UPDATED", TriggerType.EMPLOYEE);
    progressEntry.setPreviousFacilityFileStateId(previousFacilityFileStateId);
    inspection.addProgressEntry(progressEntry);
  }

  public void createProgressEntryForUpdateFacility(
      Inspection inspection, UUID previousFacilityFileStateId, String changeDescription) {

    SystemProgressEntry progressEntry =
        SystemProgressEntryFactory.createSystemProgressEntry(
            "INSPECTION_FACILITY_UPDATED", changeDescription, TriggerType.EMPLOYEE);
    progressEntry.setPreviousFacilityFileStateId(previousFacilityFileStateId);
    inspection.addProgressEntry(progressEntry);
  }

  public void createProgressEntryForSyncFacility(
      Inspection inspection, UUID previousFacilityFileStateId) {

    SystemProgressEntry progressEntry =
        SystemProgressEntryFactory.createSystemProgressEntry(
            "INSPECTION_FACILITY_SYNCED", TriggerType.EMPLOYEE);
    progressEntry.setPreviousFacilityFileStateId(previousFacilityFileStateId);
    inspection.addProgressEntry(progressEntry);
  }

  public void createProgressEntryForSyncFacility(
      Inspection inspection, UUID previousFacilityFileStateId, String changeDescription) {
    SystemProgressEntry progressEntry =
        SystemProgressEntryFactory.createSystemProgressEntry(
            "INSPECTION_FACILITY_SYNCED", changeDescription, TriggerType.EMPLOYEE);
    progressEntry.setPreviousFacilityFileStateId(previousFacilityFileStateId);
    inspection.addProgressEntry(progressEntry);
  }

  public void addProgressEntryForFinalization(Inspection inspection) {
    SystemProgressEntry progressEntry =
        SystemProgressEntryFactory.createSystemProgressEntry(
            "INSPECTION_FINALIZED", TriggerType.EMPLOYEE);
    inspection.addProgressEntry(progressEntry);
  }

  public void addProgressEntryForApproval(Inspection inspection) {
    SystemProgressEntry progressEntry =
        SystemProgressEntryFactory.createSystemProgressEntry(
            "INSPECTION_APPROVED", TriggerType.EMPLOYEE);
    progressEntry.setFile(inspection.getReport().getReportFile());
    inspection.addProgressEntry(progressEntry);
  }

  public void addAnnouncementProgressEntry(
      InspectionAnnouncementType announcementType,
      String formattedAnnouncementDate,
      Inspection inspection) {
    SystemProgressEntry progressEntry =
        SystemProgressEntryFactory.createSystemProgressEntry(
            "INSPECTION_ANNOUNCED",
            "Ankündigung am %s per %s durchgeführt"
                .formatted(formattedAnnouncementDate, announcementType.description),
            TriggerType.EMPLOYEE);
    inspection.addProgressEntry(progressEntry);
  }
}
