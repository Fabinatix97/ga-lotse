/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.opendata.domain.model;

import de.eshg.domain.model.BaseEntity;
import de.eshg.lib.common.BusinessModule;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import de.eshg.opendata.FileType;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.Set;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@DataSensitivity(SensitivityLevel.PUBLIC)
@Table(indexes = @Index(columnList = "resource_id"))
@Entity
public class Version extends BaseEntity {

  public Version() {}

  public Version(int major, int minor, Resource resource) {
    this.major = major;
    this.minor = minor;
    this.resource = resource;
    this.publicationDate = LocalDateTime.now();
  }

  private int major;

  private int minor;

  private LocalDateTime publicationDate;

  private Date statisticStartDate;

  private Date statisticEndDate;

  private byte[] document;

  @ElementCollection(fetch = FetchType.EAGER)
  @JdbcType(PostgreSQLEnumJdbcType.class)
  private Set<BusinessModule> sources;

  private String author;

  private String description;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  private FileType fileType;

  private String fileName;

  private String licence = "https://creativecommons.org/licenses/by/4.0/deed.de";

  @ManyToOne(optional = false)
  @JoinColumn(name = "resource_id")
  private Resource resource;

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

  public LocalDateTime getPublicationDate() {
    return publicationDate;
  }

  public void setPublicationDate(LocalDateTime publicationDate) {
    this.publicationDate = publicationDate;
  }

  public Date getStatisticStartDate() {
    return statisticStartDate;
  }

  public void setStatisticStartDate(Date statisticStartDate) {
    this.statisticStartDate = statisticStartDate;
  }

  public Date getStatisticEndDate() {
    return statisticEndDate;
  }

  public void setStatisticEndDate(Date statisticEndDate) {
    this.statisticEndDate = statisticEndDate;
  }

  public byte[] getDocument() {
    return document;
  }

  public void setDocument(byte[] document) {
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

  public FileType getFileType() {
    return fileType;
  }

  public void setFileType(FileType fileType) {
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

  public Resource getRessource() {
    return resource;
  }

  public void setRessource(Resource resource) {
    this.resource = resource;
  }

  public String getFullVersionNumber() {
    return major + "." + minor;
  }
}
