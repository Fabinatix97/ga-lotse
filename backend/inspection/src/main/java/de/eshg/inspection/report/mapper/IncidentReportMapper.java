/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.report.mapper;

import static de.eshg.inspection.inspection.InspectionMapper.getSortedIncidents;

import de.eshg.inspection.checklist.persistence.Checklist;
import de.eshg.inspection.incident.persistence.InspectionIncident;
import de.eshg.inspection.report.persistence.Report;
import de.eshg.inspection.report.persistence.element.ReportElementChapter;
import de.eshg.inspection.report.persistence.element.ReportElementFullTextBlock;
import de.eshg.inspection.report.persistence.element.ReportElementSection;
import jakarta.annotation.Nullable;
import java.util.List;

public class IncidentReportMapper {

  private IncidentReportMapper() {}

  public static void addIncidents(Report report, List<InspectionIncident> incidents) {
    if (!incidents.isEmpty()) {
      addIncidentsChapter(report);

      Checklist lastChecklist = null;

      for (InspectionIncident incident : getSortedIncidents(incidents).toList()) {
        Checklist currentChecklist =
            incident.getChecklistElement() != null
                ? incident.getChecklistElement().getChecklistSection().getChecklist()
                : null;
        // add a new section if we encounter a new checklist, or arrive at the "non-checklist"
        // incidents
        if (currentChecklist != lastChecklist) {
          addChecklistSection(report, currentChecklist);
          lastChecklist = currentChecklist;
        }
        addIncident(report, incident);
      }
    }
  }

  private static void addIncidentsChapter(Report report) {
    ReportElementChapter chapter = new ReportElementChapter();
    chapter.setEditable(false);
    chapter.setTitle("Vorkommnisse");
    report.getReportElements().add(chapter);
  }

  private static void addChecklistSection(Report report, @Nullable Checklist checklist) {
    ReportElementSection section = new ReportElementSection();
    section.setEditable(false);
    section.setTitle(
        checklist != null ? checklist.getChecklistDefinitionVersion().getName() : "Sonstige");
    report.getReportElements().add(section);
  }

  private static void addIncident(Report report, InspectionIncident incident) {
    ReportElementFullTextBlock fullTextBlock = new ReportElementFullTextBlock();
    fullTextBlock.setEditable(true);
    fullTextBlock.setIncident(true);
    fullTextBlock.setTitle(incident.createTitleForReport());
    fullTextBlock.setText(incident.getDescription());
    report.getReportElements().add(fullTextBlock);
  }
}
