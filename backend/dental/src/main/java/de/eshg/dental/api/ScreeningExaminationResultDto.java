/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

@Schema(name = ScreeningExaminationResultDto.SCHEMA_NAME, allOf = ExaminationResultDto.class)
public record ScreeningExaminationResultDto(
    Boolean fluorideVarnishApplied,
    OralHygieneStatusDto oralHygieneStatus,
    MihStatusDto mihStatus,
    @NotNull List<OrthodonticFindingDto> orthodonticFindings,
    OrthodonticStatusDto orthodonticStatus,
    @NotNull DentitionTypeDto dentitionType,
    @NotNull boolean plaque,
    @NotNull boolean calculus,
    @NotNull boolean gingivitis,
    @NotNull boolean parodontitis,
    @NotNull boolean blackStain,
    @NotNull @Valid List<ToothDiagnosisDto> toothDiagnoses,
    @NotNull boolean individualProphylaxis,
    @NotNull boolean fissureSealing,
    @NotNull boolean tartarRemoval,
    @NotNull boolean gingivitisTreatment,
    @NotNull boolean orthodonticTreatment,
    @NotNull boolean plaqueTreatment,
    @NotNull boolean inspectionAppointment)
    implements ExaminationResultDto, IsFluorideVarnishApplicable {

  static final String SCHEMA_NAME = "ScreeningExaminationResult";

  public ScreeningExaminationResultDto(DentitionTypeDto dentitionType) {
    this(
        null,
        null,
        null,
        List.of(),
        null,
        dentitionType,
        false,
        false,
        false,
        false,
        false,
        List.of(),
        false,
        false,
        false,
        false,
        false,
        false,
        false);
  }

  public ScreeningExaminationResultDto(
      Boolean fluorideVarnishApplied,
      OralHygieneStatusDto oralHygieneStatus,
      MihStatusDto mihStatus,
      DentitionTypeDto dentitionType) {
    this(fluorideVarnishApplied, oralHygieneStatus, mihStatus, List.of(), null, dentitionType);
  }

  public ScreeningExaminationResultDto(
      Boolean fluorideVarnishApplied,
      OralHygieneStatusDto oralHygieneStatus,
      MihStatusDto mihStatus,
      List<OrthodonticFindingDto> orthodonticFindings,
      OrthodonticStatusDto orthodonticStatus,
      DentitionTypeDto dentitionType) {
    this(
        fluorideVarnishApplied,
        oralHygieneStatus,
        mihStatus,
        orthodonticFindings,
        orthodonticStatus,
        dentitionType,
        false,
        false,
        false,
        false,
        false);
  }

  public ScreeningExaminationResultDto(
      Boolean fluorideVarnishApplied,
      OralHygieneStatusDto oralHygieneStatus,
      MihStatusDto mihStatus,
      List<OrthodonticFindingDto> orthodonticFindings,
      OrthodonticStatusDto orthodonticStatus,
      DentitionTypeDto dentitionType,
      boolean plaque,
      boolean calculus,
      boolean gingivitis,
      boolean parodontitis,
      boolean blackStain) {
    this(
        fluorideVarnishApplied,
        oralHygieneStatus,
        mihStatus,
        orthodonticFindings,
        orthodonticStatus,
        dentitionType,
        plaque,
        calculus,
        gingivitis,
        parodontitis,
        blackStain,
        List.of(),
        false,
        false,
        false,
        false,
        false,
        false,
        false);
  }

  @Override
  public String type() {
    return SCHEMA_NAME;
  }
}
