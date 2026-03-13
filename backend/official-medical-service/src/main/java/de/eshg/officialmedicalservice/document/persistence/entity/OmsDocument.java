/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.officialmedicalservice.document.persistence.entity;

import de.eshg.domain.model.GloballyUniqueEntityBase;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import de.eshg.officialmedicalservice.file.persistence.entity.OmsFile;
import de.eshg.officialmedicalservice.file.persistence.entity.OmsFile_;
import de.eshg.officialmedicalservice.procedure.persistence.entity.OmsProcedure;
import de.eshg.rest.service.i18n.Language;
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
@DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
public class OmsDocument extends GloballyUniqueEntityBase {

  @ManyToOne(optional = false)
  @JoinColumn(name = "oms_procedure_id")
  private OmsProcedure omsProcedure;

  @Column(nullable = false)
  @NotNull
  private String documentTypeDe;

  @Column private String documentTypeEn;

  @Column private String documentTypeEs;

  @Column private String documentTypeTr;

  @Column private String documentTypeRu;

  @Column private String documentTypeAr;

  @Column private String documentTypeFr;

  @Column private String documentTypeIt;

  @Column private String documentTypePl;

  @Column private String documentTypeRo;

  @Column private String documentTypeUk;

  @Column private String documentTypeHr;

  @Column private String documentTypeFa;

  @Column private String documentTypePrs;

  @Column private String helpTextDe;

  @Column private String helpTextEn;

  @Column private String helpTextEs;

  @Column private String helpTextTr;

  @Column private String helpTextRu;

  @Column private String helpTextAr;

  @Column private String helpTextFr;

  @Column private String helpTextIt;

  @Column private String helpTextPl;

  @Column private String helpTextRo;

  @Column private String helpTextUk;

  @Column private String helpTextHr;

  @Column private String helpTextFa;

  @Column private String helpTextPrs;

  @Column(nullable = false)
  @NotNull
  @JdbcType(PostgreSQLEnumJdbcType.class)
  private OmsDocumentStatus documentStatus;

  @Column private Instant lastDocumentUpload;

  @Column
  @OneToMany(
      mappedBy = OmsFile_.DOCUMENT,
      cascade = {CascadeType.PERSIST, CascadeType.REMOVE},
      orphanRemoval = true)
  @OrderBy("createdDate")
  private final List<OmsFile> files = new ArrayList<>();

  @Column private String note;

  @Column(nullable = false)
  @NotNull
  private boolean mandatoryDocument;

  @Column(nullable = false)
  @NotNull
  private boolean uploadInCitizenPortal;

  @Column
  @JdbcType(PostgreSQLEnumJdbcType.class)
  private DocumentUploadedBy uploadedBy;

  @Column private String reasonForRejection;

  @Column private String labCode;

  public OmsProcedure getOmsProcedure() {
    return omsProcedure;
  }

  public void setOmsProcedure(OmsProcedure omsProcedure) {
    this.omsProcedure = omsProcedure;
  }

  public String getDocumentType(Language language) {
    return switch (language) {
      case GERMAN -> documentTypeDe;
      case ENGLISH -> documentTypeEn;
      case SPANISH -> documentTypeEs;
      case TURKISH -> documentTypeTr;
      case RUSSIAN -> documentTypeRu;
      case ARABIC -> documentTypeAr;
      case FRENCH -> documentTypeFr;
      case ITALIAN -> documentTypeIt;
      case POLISH -> documentTypePl;
      case ROMANIAN -> documentTypeRo;
      case UKRAINIAN -> documentTypeUk;
      case CROATIAN -> documentTypeHr;
      case FARSI -> documentTypeFa;
      case DARI -> documentTypePrs;
    };
  }

  public void setDocumentType(Language language, String documentType) {
    switch (language) {
      case GERMAN -> documentTypeDe = documentType;
      case ENGLISH -> documentTypeEn = documentType;
      case SPANISH -> documentTypeEs = documentType;
      case TURKISH -> documentTypeTr = documentType;
      case RUSSIAN -> documentTypeRu = documentType;
      case ARABIC -> documentTypeAr = documentType;
      case FRENCH -> documentTypeFr = documentType;
      case ITALIAN -> documentTypeIt = documentType;
      case POLISH -> documentTypePl = documentType;
      case ROMANIAN -> documentTypeRo = documentType;
      case UKRAINIAN -> documentTypeUk = documentType;
      case CROATIAN -> documentTypeHr = documentType;
      case FARSI -> documentTypeFa = documentType;
      case DARI -> documentTypePrs = documentType;
    }
  }

  public String getHelpText(Language language) {
    return switch (language) {
      case GERMAN -> helpTextDe;
      case ENGLISH -> helpTextEn;
      case SPANISH -> helpTextEs;
      case TURKISH -> helpTextTr;
      case RUSSIAN -> helpTextRu;
      case ARABIC -> helpTextAr;
      case FRENCH -> helpTextFr;
      case ITALIAN -> helpTextIt;
      case POLISH -> helpTextPl;
      case ROMANIAN -> helpTextRo;
      case UKRAINIAN -> helpTextUk;
      case CROATIAN -> helpTextHr;
      case FARSI -> helpTextFa;
      case DARI -> helpTextPrs;
    };
  }

  public void setHelpText(Language language, String helpText) {
    switch (language) {
      case GERMAN -> helpTextDe = helpText;
      case ENGLISH -> helpTextEn = helpText;
      case SPANISH -> helpTextEs = helpText;
      case TURKISH -> helpTextTr = helpText;
      case RUSSIAN -> helpTextRu = helpText;
      case ARABIC -> helpTextAr = helpText;
      case FRENCH -> helpTextFr = helpText;
      case ITALIAN -> helpTextIt = helpText;
      case POLISH -> helpTextPl = helpText;
      case ROMANIAN -> helpTextRo = helpText;
      case UKRAINIAN -> helpTextUk = helpText;
      case CROATIAN -> helpTextHr = helpText;
      case FARSI -> helpTextFa = helpText;
      case DARI -> helpTextPrs = helpText;
    }
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

  public String getLabCode() {
    return labCode;
  }

  public void setLabCode(String labTestBarCode) {
    this.labCode = labTestBarCode;
  }
}
