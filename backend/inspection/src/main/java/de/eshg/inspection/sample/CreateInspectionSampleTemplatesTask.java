/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.sample;

import de.eshg.inspection.feature.InspectionFeature;
import de.eshg.inspection.feature.InspectionFeatureToggle;
import de.eshg.inspection.sample.persistence.InspectionSampleEvaluationType;
import de.eshg.inspection.sample.persistence.InspectionSampleMeasurementParameterTemplate;
import de.eshg.inspection.sample.persistence.InspectionSampleTemplate;
import de.eshg.inspection.sample.persistence.InspectionSampleTemplateRepository;
import de.eshg.inspection.sample.persistence.InspectionSampleType;
import de.eshg.inspection.teis.persistence.TeisParameterRepository;
import de.eshg.inspection.teis.persistence.TeisUntersuchungsparameterRepository;
import de.eshg.persistence.TransactionHelper;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class CreateInspectionSampleTemplatesTask {
  private final InspectionFeatureToggle inspectionFeatureToggle;
  private final TransactionHelper transactionHelper;
  private final TeisUntersuchungsparameterRepository teisUntersuchungsparameterRepository;
  private final InspectionSampleTemplateRepository inspectionSampleTemplateRepository;

  private static final String ZID_P_CHLOR_FREI = "229999999000000000043";
  private static final String ZID_P_CHLOR_GEBUNDEN = "229999999000000000044";
  private static final String ZID_P_CHLOR_GESAMT = "229999999000000000042";
  private static final String ZID_P_PH_WERT = "229999999000000000382";
  private static final String ZID_P_SUMME_TRIHALOGENMETHANE = "229999999000000000801";
  private static final String ZID_P_1_2_DICHLORETHAN = "229999999000000000147";
  private static final String ZID_P_ACRYLAMID = "229999999000000000824";
  private static final String ZID_P_ALUMINIUM_GESAMT = "229999999000000000006";
  private static final String ZID_P_AMMONIUM = "229999999000000000247";

  private static final String ZID_U_CHLOR_FREI = "299999999000000001421"; // only upper limit: 0,3
  private static final String ZID_U_CHLOR_GEBUNDEN =
      "299999999000000000808"; // only upper limit: 0,2
  private static final String ZID_U_PH_WERT = "299999999000000001546"; // 6,5-9,5
  private static final String ZID_U_1_2_DICHLORETHAN = "299999999000000001910";
  private static final String ZID_U_ACRYLAMID = "299999999000000001903";
  private static final String ZID_U_ALUMINIUM_GESAMT = "299999999000000001944";
  private static final String ZID_U_AMMONIUM = "299999999000000001945";

  private final TeisParameterRepository teisParameterRepository;

  public CreateInspectionSampleTemplatesTask(
      InspectionFeatureToggle inspectionFeatureToggle,
      TransactionHelper transactionHelper,
      TeisUntersuchungsparameterRepository teisUntersuchungsparameterRepository,
      InspectionSampleTemplateRepository inspectionSampleTemplateRepository,
      TeisParameterRepository teisParameterRepository) {
    this.inspectionFeatureToggle = inspectionFeatureToggle;
    this.transactionHelper = transactionHelper;
    this.teisUntersuchungsparameterRepository = teisUntersuchungsparameterRepository;
    this.inspectionSampleTemplateRepository = inspectionSampleTemplateRepository;
    this.teisParameterRepository = teisParameterRepository;
  }

  public void createTemplates() {
    if (inspectionFeatureToggle.isNewFeatureEnabled(InspectionFeature.SAMPLES))
      transactionHelper.executeInTransaction(
          () -> {
            createSampleTemplate(
                "Trinkwasser",
                "Bad Herren links",
                InspectionSampleType.DRINKING_WATER,
                "Linkes Waschbecken",
                InspectionSampleEvaluationType.ON_SITE,
                List.of(
                    createMeasurementParameterTemplate(
                        ZID_P_1_2_DICHLORETHAN, ZID_U_1_2_DICHLORETHAN),
                    createMeasurementParameterTemplate(ZID_P_ACRYLAMID, ZID_U_ACRYLAMID),
                    createMeasurementParameterTemplate(
                        ZID_P_ALUMINIUM_GESAMT, ZID_U_ALUMINIUM_GESAMT),
                    createMeasurementParameterTemplate(ZID_P_AMMONIUM, ZID_U_AMMONIUM)));

            createSampleTemplate(
                "Badewasser",
                "Schwimmerbecken",
                InspectionSampleType.DRINKING_WATER,
                "Tiefes Ende",
                InspectionSampleEvaluationType.ON_SITE,
                List.of(
                    createMeasurementParameterTemplate(ZID_P_PH_WERT, ZID_U_PH_WERT),
                    createMeasurementParameterTemplate(ZID_P_CHLOR_FREI, ZID_U_CHLOR_FREI),
                    createMeasurementParameterTemplate(ZID_P_CHLOR_GEBUNDEN, ZID_U_CHLOR_GEBUNDEN),
                    createMeasurementParameterTemplate(ZID_P_CHLOR_GESAMT, null),
                    createMeasurementParameterTemplate(ZID_P_SUMME_TRIHALOGENMETHANE, null)));
          });
  }

  private void createSampleTemplate(
      String name,
      String pointOfWithdrawal,
      InspectionSampleType typeOfSample,
      String nameOfSamplingPoint,
      InspectionSampleEvaluationType evaluationType,
      List<InspectionSampleMeasurementParameterTemplate> measurementParameters) {
    InspectionSampleTemplate template = new InspectionSampleTemplate();
    template.setName(name);
    template.setPointOfWithdrawal(pointOfWithdrawal);
    template.setTypeOfSample(typeOfSample);
    template.setNameOfSamplingPoint(nameOfSamplingPoint);
    template.setEvaluationType(evaluationType);

    template.getMeasurementParameters().addAll(measurementParameters);

    inspectionSampleTemplateRepository.save(template);
  }

  private InspectionSampleMeasurementParameterTemplate createMeasurementParameterTemplate(
      String parameterZid, String untersuchungsparameterZid) {

    return transactionHelper.executeInTransaction(
        () -> {
          InspectionSampleMeasurementParameterTemplate measurementParameterTemplate =
              new InspectionSampleMeasurementParameterTemplate();

          measurementParameterTemplate.setParameterGroup("Template parameter group");
          measurementParameterTemplate.setTeisParameter(
              teisParameterRepository.findTeisParameterByZid(parameterZid).orElseThrow());
          if (untersuchungsparameterZid != null) {
            measurementParameterTemplate.setTeisUntersuchungsparameter(
                teisUntersuchungsparameterRepository
                    .findTeisUntersuchungsparameterByZid(untersuchungsparameterZid)
                    .orElseThrow());
          }

          return measurementParameterTemplate;
        });
  }

  public void deleteTemplates() {
    inspectionSampleTemplateRepository.deleteAll();
  }
}
