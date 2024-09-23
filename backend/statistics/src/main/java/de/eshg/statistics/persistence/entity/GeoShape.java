/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.persistence.entity;

import static de.eshg.lib.common.SensitivityLevel.PROTECTED;
import static de.eshg.lib.common.SensitivityLevel.PUBLIC;

import de.eshg.domain.model.BaseEntityWithExternalId;
import de.eshg.lib.common.DataSensitivity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import java.time.Instant;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@EntityListeners(AuditingEntityListener.class)
public class GeoShape extends BaseEntityWithExternalId {
  @DataSensitivity(PROTECTED)
  @CreatedDate
  @Column(nullable = false)
  private Instant createdAt;

  @DataSensitivity(PUBLIC)
  @Column(nullable = false, unique = true)
  private String title;

  @DataSensitivity(PUBLIC)
  @Column(nullable = false)
  @JdbcType(PostgreSQLEnumJdbcType.class)
  private GeoShapeStatus status;

  @DataSensitivity(PUBLIC)
  @Column(nullable = false)
  private String geoJson;

  public Instant getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(Instant createdAt) {
    this.createdAt = createdAt;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public GeoShapeStatus getStatus() {
    return status;
  }

  public void setStatus(GeoShapeStatus status) {
    this.status = status;
  }

  public String getGeoJson() {
    return geoJson;
  }

  public void setGeoJson(String geoJson) {
    this.geoJson = geoJson;
  }
}
