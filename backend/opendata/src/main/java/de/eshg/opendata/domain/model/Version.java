/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.opendata.domain.model;

import de.eshg.domain.model.BaseEntityWithExternalId;
import de.eshg.lib.common.BusinessModule;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.time.LocalDate;
import java.util.LinkedHashSet;
import java.util.Set;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@DataSensitivity(SensitivityLevel.PUBLIC)
@Table(indexes = @Index(columnList = "resource_id"))
@Entity
public class Version extends BaseEntityWithExternalId {

  public Version() {}

  @NotNull private String versionName;

  @NotNull private int major;

  @NotNull private int minor;

  @NotNull private Instant publicationDate;

  private LocalDate statisticStartDate;

  private LocalDate statisticEndDate;

  @NotNull private int fileSize;

  @OneToOne(
      optional = false,
      fetch = FetchType.LAZY,
      orphanRemoval = true,
      cascade = CascadeType.PERSIST)
  private FileContent document;

  @ElementCollection
  @JdbcType(PostgreSQLEnumJdbcType.class)
  @OrderBy
  @Column(nullable = false)
  private Set<BusinessModule> sources = new LinkedHashSet<>();

  private String author;

  private String description;

  @NotNull
  @JdbcType(PostgreSQLEnumJdbcType.class)
  private OpenDataFileType fileType;

  @NotNull private String fileName;

  @NotNull private String licence;

  @ManyToOne(optional = false)
  @JoinColumn(name = "resource_id")
  private Resource resource;

  public String getVersionName() {
    return versionName;
  }

  public void setVersionName(String versionName) {
    this.versionName = versionName;
  }

  public int getMajor() {
    return major;
  }

  public void setMajor(int major) {
    this.major = major;
  }

  public int getMinor() {
    return minor;
  }

  public void setMinor(int minor) {
    this.minor = minor;
  }

  public Instant getPublicationDate() {
    return publicationDate;
  }

  public void setPublicationDate(Instant publicationDate) {
    this.publicationDate = publicationDate;
  }

  public LocalDate getStatisticStartDate() {
    return statisticStartDate;
  }

  public void setStatisticStartDate(LocalDate statisticStartDate) {
    this.statisticStartDate = statisticStartDate;
  }

  public LocalDate getStatisticEndDate() {
    return statisticEndDate;
  }

  public void setStatisticEndDate(LocalDate statisticEndDate) {
    this.statisticEndDate = statisticEndDate;
  }

  public FileContent getDocument() {
    return document;
  }

  public void setDocument(FileContent document) {
    this.document = document;
  }

  public Set<BusinessModule> getSources() {
    return sources;
  }

  public void setSources(Set<BusinessModule> sources) {
    this.sources = sources;
  }

  public String getAuthor() {
    return author;
  }

  public void setAuthor(String author) {
    this.author = author;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public OpenDataFileType getFileType() {
    return fileType;
  }

  public void setFileType(OpenDataFileType fileType) {
    this.fileType = fileType;
  }

  public String getFileName() {
    return fileName;
  }

  public void setFileName(String fileName) {
    this.fileName = fileName;
  }

  public String getLicence() {
    return licence;
  }

  public void setLicence(String licence) {
    this.licence = licence;
  }

  public Resource getResource() {
    return resource;
  }

  public void setResource(Resource resource) {
    this.resource = resource;
  }

  public String getFullVersionNumber() {
    return major + "." + minor;
  }

  @NotNull
  public int getFileSize() {
    return fileSize;
  }

  public void setFileSize(@NotNull int fileSize) {
    this.fileSize = fileSize;
  }
}
