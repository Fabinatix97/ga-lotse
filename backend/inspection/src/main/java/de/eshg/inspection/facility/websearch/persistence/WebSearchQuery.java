/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.facility.websearch.persistence;

import de.eshg.domain.model.BaseEntity;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.UUID;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@Table(indexes = @Index(columnList = "websearch_id"))
@EntityListeners(AuditingEntityListener.class)
public class WebSearchQuery extends BaseEntity {
  @ManyToOne(
      optional = false,
      cascade = {CascadeType.PERSIST, CascadeType.REMOVE, CascadeType.MERGE})
  @JoinColumn(name = "websearch_id", nullable = false)
  @NotNull
  @DataSensitivity(SensitivityLevel.PUBLIC)
  private WebSearch webSearch;

  @Column(nullable = false)
  @NotNull
  @DataSensitivity(SensitivityLevel.PUBLIC)
  private String queryName;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  private String facilityName;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  private String facilityAddress;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  private String keywords;

  @CreatedBy
  @Column(nullable = false)
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private UUID createdBy;

  @CreatedDate
  @Column(nullable = false)
  @DataSensitivity(SensitivityLevel.PUBLIC)
  private Instant createdAt;

  public WebSearchQuery() {}

  public WebSearchQuery(
      WebSearch webSearch,
      String queryName,
      String facilityName,
      String facilityAddress,
      String keywords) {
    this.webSearch = webSearch;
    this.queryName = queryName;
    this.facilityName = facilityName;
    this.facilityAddress = facilityAddress;
    this.keywords = keywords;
  }

  public WebSearch getWebSearch() {
    return webSearch;
  }

  public void setWebSearch(WebSearch webSearch) {
    this.webSearch = webSearch;
  }

  public String getQueryName() {
    return queryName;
  }

  public void setQueryName(String queryName) {
    this.queryName = queryName;
  }

  public String getFacilityName() {
    return facilityName;
  }

  public void setFacilityName(String facilityName) {
    this.facilityName = facilityName;
  }

  public String getFacilityAddress() {
    return facilityAddress;
  }

  public void setFacilityAddress(String facilityAddress) {
    this.facilityAddress = facilityAddress;
  }

  public String getKeywords() {
    return keywords;
  }

  public void setKeywords(String keywords) {
    this.keywords = keywords;
  }

  public UUID getCreatedBy() {
    return createdBy;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }
}
