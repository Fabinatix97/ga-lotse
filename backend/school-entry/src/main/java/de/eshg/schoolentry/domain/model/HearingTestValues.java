/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.domain.model;

import static de.eshg.lib.common.SensitivityLevel.SENSITIVE;

import de.eshg.lib.common.DataSensitivity;
import jakarta.persistence.Embeddable;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@Embeddable
@DataSensitivity(SENSITIVE)
public class HearingTestValues {
  @JdbcType(PostgreSQLEnumJdbcType.class)
  private DecibelValue hz250;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  private DecibelValue hz500;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  private DecibelValue hz1000;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  private DecibelValue hz2000;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  private DecibelValue hz4000;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  private DecibelValue hz6000;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  private DecibelValue hz8000;

  public DecibelValue getHz250() {
    return hz250;
  }

  public void setHz250(DecibelValue hz250) {
    this.hz250 = hz250;
  }

  public DecibelValue getHz500() {
    return hz500;
  }

  public void setHz500(DecibelValue hz500) {
    this.hz500 = hz500;
  }

  public DecibelValue getHz1000() {
    return hz1000;
  }

  public void setHz1000(DecibelValue hz1000) {
    this.hz1000 = hz1000;
  }

  public DecibelValue getHz2000() {
    return hz2000;
  }

  public void setHz2000(DecibelValue hz2000) {
    this.hz2000 = hz2000;
  }

  public DecibelValue getHz4000() {
    return hz4000;
  }

  public void setHz4000(DecibelValue hz4000) {
    this.hz4000 = hz4000;
  }

  public DecibelValue getHz6000() {
    return hz6000;
  }

  public void setHz6000(DecibelValue hz6000) {
    this.hz6000 = hz6000;
  }

  public DecibelValue getHz8000() {
    return hz8000;
  }

  public void setHz8000(DecibelValue hz8000) {
    this.hz8000 = hz8000;
  }
}
