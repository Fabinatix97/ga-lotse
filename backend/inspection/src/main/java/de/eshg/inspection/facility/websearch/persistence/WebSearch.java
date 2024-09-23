/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.facility.websearch.persistence;

import de.eshg.domain.model.GloballyUniqueEntityBase;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@EntityListeners(AuditingEntityListener.class)
public class WebSearch extends GloballyUniqueEntityBase {

  @Column(nullable = false)
  @NotNull
  @DataSensitivity(SensitivityLevel.PUBLIC)
  private String name;

  @Column(nullable = false)
  @NotNull
  @DataSensitivity(SensitivityLevel.PUBLIC)
  private String basicURL;

  @Column(nullable = false)
  @NotNull
  @DataSensitivity(SensitivityLevel.PUBLIC)
  private String searchCity;

  @NotNull
  @JdbcType(PostgreSQLEnumJdbcType.class)
  @DataSensitivity(SensitivityLevel.PUBLIC)
  private WebSearchStatus status;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @Column
  private Instant runningSince;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @Column
  private Instant lastExecution;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @Column
  private Instant lastSuccessfulExecution;

  @DataSensitivity(SensitivityLevel.PROTECTED)
  @Column
  private String lastError;

  @Column(nullable = false)
  @DataSensitivity(SensitivityLevel.PUBLIC)
  private int entryCount = 0;

  @OneToMany(
      mappedBy = WebSearchEntry_.WEB_SEARCH,
      cascade = CascadeType.ALL,
      fetch = FetchType.LAZY,
      orphanRemoval = true)
  @OrderBy(
      WebSearchEntry_.POSTAL_CODE + ", " + WebSearchEntry_.NAME + ", " + WebSearchEntry_.OSM_ID)
  @DataSensitivity(SensitivityLevel.PUBLIC)
  private final List<WebSearchEntry> entries = new ArrayList<>();

  @OneToMany(
      mappedBy = WebSearchQuery_.WEB_SEARCH,
      cascade = {CascadeType.PERSIST, CascadeType.REMOVE, CascadeType.MERGE},
      fetch = FetchType.EAGER,
      orphanRemoval = true)
  @OrderBy
  @DataSensitivity(SensitivityLevel.PUBLIC)
  private final List<WebSearchQuery> queries = new ArrayList<>();

  @CreatedBy
  @Column(nullable = false)
  @DataSensitivity(SensitivityLevel.PROTECTED)
  private UUID createdBy;

  @CreatedDate
  @Column(nullable = false)
  @DataSensitivity(SensitivityLevel.PUBLIC)
  private Instant createdAt;

  public WebSearch(String name, String basicURL, String searchCity) {
    this.name = name;
    this.basicURL = basicURL;
    this.searchCity = searchCity;
    this.status = WebSearchStatus.NEW;
  }

  public WebSearch() {}

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getBasicURL() {
    return basicURL;
  }

  public void setBasicURL(String basicURL) {
    this.basicURL = basicURL;
  }

  public String getSearchCity() {
    return searchCity;
  }

  public void setSearchCity(String searchCity) {
    this.searchCity = searchCity;
  }

  public WebSearchStatus getStatus() {
    return status;
  }

  public void setStatus(WebSearchStatus status) {
    this.status = status;
  }

  public Instant getRunningSince() {
    return runningSince;
  }

  public void setRunningSince(Instant runningSince) {
    this.runningSince = runningSince;
  }

  public Instant getLastExecution() {
    return lastExecution;
  }

  public void setLastExecution(Instant lastExecution) {
    this.lastExecution = lastExecution;
  }

  public Instant getLastSuccessfulExecution() {
    return lastSuccessfulExecution;
  }

  public void setLastSuccessfulExecution(Instant lastSucessfulExecution) {
    this.lastSuccessfulExecution = lastSucessfulExecution;
  }

  public String getLastError() {
    return lastError;
  }

  public void setLastError(String lastError) {
    this.lastError = lastError;
  }

  public int getEntryCount() {
    return entryCount;
  }

  public void setEntryCount(int entryCount) {
    this.entryCount = entryCount;
  }

  public List<WebSearchEntry> getEntries() {
    return entries;
  }

  public List<WebSearchQuery> getQueries() {
    return queries;
  }

  public UUID getCreatedBy() {
    return createdBy;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }
}
