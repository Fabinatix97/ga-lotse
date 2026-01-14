/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.testhelper;

import de.eshg.inspection.teis.CreateTeisDataTask;
import de.eshg.inspection.teis.persistence.TeisAnalyseverfahrenRepository;
import de.eshg.inspection.teis.persistence.TeisAufbereitungsverfahrenRepository;
import de.eshg.inspection.teis.persistence.TeisEinheitRepository;
import de.eshg.inspection.teis.persistence.TeisEuParameterRepository;
import de.eshg.inspection.teis.persistence.TeisGesundheitsamtRepository;
import de.eshg.inspection.teis.persistence.TeisLandRepository;
import de.eshg.inspection.teis.persistence.TeisListeRepository;
import de.eshg.inspection.teis.persistence.TeisMesswerttextRepository;
import de.eshg.inspection.teis.persistence.TeisParameterRepository;
import de.eshg.inspection.teis.persistence.TeisProbenahmehaeufigkeitRepository;
import de.eshg.inspection.teis.persistence.TeisUmrechnungRepository;
import de.eshg.inspection.teis.persistence.TeisUntersuchungsparameterRepository;
import de.eshg.inspection.teis.persistence.TeisUntersuchungsumfangRepository;
import de.eshg.inspection.teis.persistence.TeisVerwaltungsbezirkRepository;
import de.eshg.inspection.testhelper.api.TeisDataCreationModeDto;
import de.eshg.testhelper.population.PopulatorComponent;

@PopulatorComponent
public class TeisDataPopulator {

  private final TeisAnalyseverfahrenRepository teisAnalyseverfahrenRepository;
  private final TeisAufbereitungsverfahrenRepository teisAufbereitungsverfahrenRepository;
  private final TeisEinheitRepository teisEinheitRepository;
  private final TeisEuParameterRepository teisEuParameterRepository;
  private final TeisGesundheitsamtRepository teisGesundheitsamtRepository;
  private final TeisLandRepository teisLandRepository;
  private final TeisListeRepository teisListeRepository;
  private final TeisMesswerttextRepository teisMesswerttextRepository;
  private final TeisParameterRepository teisParameterRepository;
  private final TeisProbenahmehaeufigkeitRepository teisProbenahmehaeufigkeitRepository;
  private final TeisUmrechnungRepository teisUmrechnungRepository;
  private final TeisVerwaltungsbezirkRepository teisVerwaltungsbezirkRepository;
  private final TeisUntersuchungsparameterRepository teisUntersuchungsparameterRepository;
  private final TeisUntersuchungsumfangRepository teisUntersuchungsumfangRepository;
  private final CreateTeisDataTask createTeisDataTask;

  public TeisDataPopulator(
      TeisAnalyseverfahrenRepository teisAnalyseverfahrenRepository,
      TeisAufbereitungsverfahrenRepository teisAufbereitungsverfahrenRepository,
      TeisEinheitRepository teisEinheitRepository,
      TeisEuParameterRepository teisEuParameterRepository,
      TeisGesundheitsamtRepository teisGesundheitsamtRepository,
      TeisLandRepository teisLandRepository,
      TeisListeRepository teisListeRepository,
      TeisMesswerttextRepository teisMesswerttextRepository,
      TeisParameterRepository teisParameterRepository,
      TeisProbenahmehaeufigkeitRepository teisProbenahmehaeufigkeitRepository,
      TeisUmrechnungRepository teisUmrechnungRepository,
      TeisVerwaltungsbezirkRepository teisVerwaltungsbezirkRepository,
      TeisUntersuchungsparameterRepository teisUntersuchungsparameterRepository,
      TeisUntersuchungsumfangRepository teisUntersuchungsumfangRepository,
      CreateTeisDataTask createTeisDataTask) {
    this.teisAnalyseverfahrenRepository = teisAnalyseverfahrenRepository;
    this.teisAufbereitungsverfahrenRepository = teisAufbereitungsverfahrenRepository;
    this.teisEinheitRepository = teisEinheitRepository;
    this.teisEuParameterRepository = teisEuParameterRepository;
    this.teisGesundheitsamtRepository = teisGesundheitsamtRepository;
    this.teisLandRepository = teisLandRepository;
    this.teisListeRepository = teisListeRepository;
    this.teisMesswerttextRepository = teisMesswerttextRepository;
    this.teisParameterRepository = teisParameterRepository;
    this.teisProbenahmehaeufigkeitRepository = teisProbenahmehaeufigkeitRepository;
    this.teisUmrechnungRepository = teisUmrechnungRepository;
    this.teisVerwaltungsbezirkRepository = teisVerwaltungsbezirkRepository;
    this.teisUntersuchungsparameterRepository = teisUntersuchungsparameterRepository;
    this.teisUntersuchungsumfangRepository = teisUntersuchungsumfangRepository;
    this.createTeisDataTask = createTeisDataTask;
  }

  public void recreateTeisData(TeisDataCreationModeDto mode) {
    teisUntersuchungsparameterRepository.deleteAll();
    teisEuParameterRepository.deleteAll();
    teisUntersuchungsumfangRepository.deleteAll();
    teisVerwaltungsbezirkRepository.deleteAll();
    teisUmrechnungRepository.deleteAll();
    teisProbenahmehaeufigkeitRepository.deleteAll();
    teisParameterRepository.deleteAll();
    teisMesswerttextRepository.deleteAll();
    teisListeRepository.deleteAll();
    teisLandRepository.deleteAll();
    teisGesundheitsamtRepository.deleteAll();
    teisEinheitRepository.deleteAll();
    teisAufbereitungsverfahrenRepository.deleteAll();
    teisAnalyseverfahrenRepository.deleteAll();
    switch (mode) {
      case REAL_DATA -> createTeisDataTask.parseXml();
      case TEST_DATA -> createTeisDataTask.parseXmlForTest();
      default -> throw new RuntimeException("Unknown teis data creation mode: " + mode);
    }
  }
}
