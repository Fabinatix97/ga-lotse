/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.document.persistence.entity;

import de.eshg.domain.model.GloballyUniqueEntityBase;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import de.eshg.officialmedicalservice.file.persistence.entity.OmsFile;
import de.eshg.officialmedicalservice.file.persistence.entity.OmsFile_;
import de.eshg.officialmedicalservice.procedure.persistence.entity.OmsProcedure;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@Entity
@Table(indexes = @Index(columnList = "oms_procedure_id"))
public class OmsDocument extends GloballyUniqueEntityBase {

  @ManyToOne(optional = false)
  @JoinColumn(name = "oms_procedure_id")
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private OmsProcedure omsProcedure;

  @Column(nullable = false)
  @NotNull
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private String documentTypeDe;

  @Column
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private String documentTypeEn;

  @Column
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private String helpTextDe;

  @Column
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private String helpTextEn;

  @Column(nullable = false)
  @NotNull
  @JdbcType(PostgreSQLEnumJdbcType.class)
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private OmsDocumentStatus documentStatus;

  @Column
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private Instant lastDocumentUpload;

  @Column
  @OneToMany(
      mappedBy = OmsFile_.DOCUMENT,
      cascade = {CascadeType.PERSIST, CascadeType.REMOVE},
      orphanRemoval = true)
  @OrderBy("createdDate")
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private final List<OmsFile> files = new ArrayList<>();

  @Column
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private String note;

  @Column(nullable = false)
  @NotNull
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private boolean mandatoryDocument;

  @Column(nullable = false)
  @NotNull
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private boolean uploadInCitizenPortal;

  @Column
  @JdbcType(PostgreSQLEnumJdbcType.class)
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private DocumentUploadedBy uploadedBy;

  @Column
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private String reasonForRejection;

  public OmsProcedure getOmsProcedure() {
    return omsProcedure;
  }

  public void setOmsProcedure(OmsProcedure omsProcedure) {
    this.omsProcedure = omsProcedure;
  }

  public String getDocumentTypeDe() {
    return documentTypeDe;
  }

  public void setDocumentTypeDe(String documentTypeDe) {
    this.documentTypeDe = documentTypeDe;
  }

  public String getDocumentTypeEn() {
    return documentTypeEn;
  }

  public void setDocumentTypeEn(String documentTypeEn) {
    this.documentTypeEn = documentTypeEn;
  }

  public String getHelpTextDe() {
    return helpTextDe;
  }

  public void setHelpTextDe(String helpTextDe) {
    this.helpTextDe = helpTextDe;
  }

  public String getHelpTextEn() {
    return helpTextEn;
  }

  public void setHelpTextEn(String helpTextEn) {
    this.helpTextEn = helpTextEn;
  }

  public OmsDocumentStatus getDocumentStatus() {
    return documentStatus;
  }

  public void setDocumentStatus(OmsDocumentStatus documentStatus) {
    this.documentStatus = documentStatus;
  }

  public Instant getLastDocumentUpload() {
    return lastDocumentUpload;
  }

  public void setLastDocumentUpload(Instant lastDocumentUpload) {
    this.lastDocumentUpload = lastDocumentUpload;
  }

  public List<OmsFile> getFiles() {
    return files;
  }

  public String getNote() {
    return note;
  }

  public void setNote(String note) {
    this.note = note;
  }

  public boolean isMandatoryDocument() {
    return mandatoryDocument;
  }

  public void setMandatoryDocument(boolean mandatoryDocument) {
    this.mandatoryDocument = mandatoryDocument;
  }

  public boolean isUploadInCitizenPortal() {
    return uploadInCitizenPortal;
  }

  public void setUploadInCitizenPortal(boolean uploadInCitizenPortal) {
    this.uploadInCitizenPortal = uploadInCitizenPortal;
  }

  public DocumentUploadedBy getUploadedBy() {
    return uploadedBy;
  }

  public void setUploadedBy(DocumentUploadedBy uploadedBy) {
    this.uploadedBy = uploadedBy;
  }

  public String getReasonForRejection() {
    return reasonForRejection;
  }

  public void setReasonForRejection(String reasonForRejection) {
    this.reasonForRejection = reasonForRejection;
  }
}
