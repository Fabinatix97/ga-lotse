/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.report.persistence;

import de.eshg.domain.model.GloballyUniqueEntityBase;
import de.eshg.inspection.inspection.InspectionValidator;
import de.eshg.inspection.inspection.persistence.Inspection;
import de.eshg.inspection.inspection.persistence.Inspection_;
import de.eshg.inspection.report.persistence.element.ReportElement;
import de.eshg.inspection.report.persistence.element.ReportElement_;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import de.eshg.lib.procedure.domain.model.Pdf;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.ErrorCode;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.OrderBy;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@EntityListeners(AuditingEntityListener.class)
public class Report extends GloballyUniqueEntityBase {

  @CreatedBy
  @Column(nullable = false)
  @NotNull
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private UUID createdBy;

  @CreatedDate
  @Column(nullable = false)
  @NotNull
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private Instant createdAt;

  @NotNull
  @OneToOne(mappedBy = Inspection_.REPORT, cascade = CascadeType.PERSIST)
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private Inspection inspection;

  @OneToMany(
      cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE},
      orphanRemoval = true)
  @JoinColumn(name = "report_id", nullable = false)
  @OrderBy(ReportElement_.POSITION)
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private final List<ReportElement> reportElements = new ArrayList<>();

  @OneToOne(cascade = {CascadeType.PERSIST, CascadeType.REMOVE})
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private Pdf reportFile;

  @OneToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE})
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private InspectionSignature signature;

  public UUID getCreatedBy() {
    return createdBy;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }

  public Inspection getInspection() {
    return inspection;
  }

  public void setInspection(Inspection inspection) {
    checkIllegalModification();
    this.inspection = inspection;
  }

  public List<ReportElement> getReportElements() {
    return reportElements;
  }

  public Pdf getReportFile() {
    return reportFile;
  }

  public void setReportFile(Pdf reportFile) {
    checkIllegalModification();
    this.reportFile = reportFile;
  }

  public InspectionSignature getSignature() {
    validateSignature();
    return signature;
  }

  public void setSignature(InspectionSignature signature) {
    checkIllegalModification();
    this.signature = signature;
  }

  public Report validateSignature() {
    if (signature != null
        && signature.getHashValue() != null
        && !InspectionValidator.verifySignature(inspection, signature)) {
      throw new BadRequestException(
          ErrorCode.CORRUPT, "Signature validation failed. Signature is corrupt");
    }
    return this;
  }

  private void checkIllegalModification() {
    if (reportFile != null) {
      throw new IllegalStateException(
          "Report has already been created; modification of report is not allowed");
    }
  }
}
