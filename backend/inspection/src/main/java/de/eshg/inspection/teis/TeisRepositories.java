/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.teis;

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

public record TeisRepositories(
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
    TeisUntersuchungsumfangRepository teisUntersuchungsumfangRepository) {}
