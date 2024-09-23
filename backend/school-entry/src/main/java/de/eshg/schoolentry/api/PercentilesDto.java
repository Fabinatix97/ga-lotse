/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "Percentiles", description = "Percentiles for the body measurement results.")
public class PercentilesDto {

  @Schema(description = "Percentile to measured height.", example = "0.516235721530589")
  private Double heightPercentile;

  @Schema(description = "Percentile to measured weight.", example = "0.21338076008280304")
  private Double weightPercentile;

  @Schema(
      description =
          "Calculated body mass index. This value is only returned if the height and weight have been provided.",
      example = "13.79758136514893")
  private Double bmi;

  @Schema(
      description = "Percentile to the calculated body mass index.",
      example = "0.0837420790834949")
  private Double bmiPercentile;

  public PercentilesDto(
      Double heightPercentile, Double weightPercentile, Double bmi, Double bmiPercentile) {
    this.heightPercentile = heightPercentile;
    this.weightPercentile = weightPercentile;
    this.bmi = bmi;
    this.bmiPercentile = bmiPercentile;
  }

  public PercentilesDto() {}

  public Double getHeightPercentile() {
    return heightPercentile;
  }

  public void setHeightPercentile(Double heightPercentile) {
    this.heightPercentile = heightPercentile;
  }

  public Double getWeightPercentile() {
    return weightPercentile;
  }

  public void setWeightPercentile(Double weightPercentile) {
    this.weightPercentile = weightPercentile;
  }

  public Double getBmi() {
    return bmi;
  }

  public void setBmi(Double bmi) {
    this.bmi = bmi;
  }

  public Double getBmiPercentile() {
    return bmiPercentile;
  }

  public void setBmiPercentile(Double bmiPercentile) {
    this.bmiPercentile = bmiPercentile;
  }
}
