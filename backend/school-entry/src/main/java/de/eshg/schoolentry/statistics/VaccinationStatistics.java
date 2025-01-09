/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.statistics;

import de.eshg.schoolentry.domain.model.SchoolEntryProcedure;
import de.eshg.schoolentry.domain.model.VaccinationStatus;
import de.eshg.schoolentry.statistics.attributes.EsuVaccinationAttribute;
import de.eshg.schoolentry.statistics.options.BooleanWithUnknown;
import de.eshg.schoolentry.statistics.options.VaccinationScheme;
import java.util.function.Function;

public class VaccinationStatistics {

  private VaccinationStatistics() {}

  static Object mapAttribute(SchoolEntryProcedure procedure, EsuVaccinationAttribute attribute) {
    return switch (attribute) {
      case IMPFSCHEMA -> getVaccinationScheme(procedure.getVaccinationStatus());
      case DIP -> getVaccinationAttribute(procedure, VaccinationStatus::getDiphtheria);
      case TET -> getVaccinationAttribute(procedure, VaccinationStatus::getTetanus);
      case PER -> getVaccinationAttribute(procedure, VaccinationStatus::getPertussis);
      case HIB -> getVaccinationAttribute(procedure, VaccinationStatus::getHib);
      case POL -> getVaccinationAttribute(procedure, VaccinationStatus::getPolio);
      case HBV -> getVaccinationAttribute(procedure, VaccinationStatus::getHepatitisB);
      case PNEUMO -> getVaccinationAttribute(procedure, VaccinationStatus::getPneumococcus);
      case MMR -> getVaccinationAttribute(procedure, VaccinationStatus::getMmr);
      case VARI -> getVaccinationAttribute(procedure, VaccinationStatus::getVaricella);
      case MENB -> getVaccinationAttribute(procedure, VaccinationStatus::getMeningococcusB);
      case MENC -> getVaccinationAttribute(procedure, VaccinationStatus::getMeningococcusC);
      case ROTA -> getVaccinationAttribute(procedure, VaccinationStatus::getRota);
      case FSME -> getVaccinationAttribute(procedure, VaccinationStatus::getTbe);
      case HAV -> getVaccinationAttribute(procedure, VaccinationStatus::getHepatitisA);
      case IMPFBUCH -> getVaccinationPassPresented(procedure.getVaccinationStatus());
      case PERKOMBIHBV -> getPerkombiHbv(procedure.getVaccinationStatus());
    };
  }

  private static String getVaccinationAttribute(
      SchoolEntryProcedure procedure, Function<VaccinationStatus, Integer> vaccinationGetter) {
    VaccinationStatus vaccinationStatus = procedure.getVaccinationStatus();
    if (vaccinationStatus == null) {
      return null;
    }

    Integer vaccinations = vaccinationGetter.apply(vaccinationStatus);
    return vaccinations == null ? null : String.format("%d", vaccinations);
  }

  private static Boolean getVaccinationPassPresented(VaccinationStatus vaccinationStatus) {
    if (vaccinationStatus == null) {
      return null;
    }

    return vaccinationStatus.getVaccinationPassPresented();
  }

  private static String getVaccinationScheme(VaccinationStatus vaccinationStatus) {
    if (vaccinationStatus == null || vaccinationStatus.getVaccinationScheme() == null) {
      return null;
    }

    return VaccinationScheme.convertVaccinationSchemeToValue(
        vaccinationStatus.getVaccinationScheme());
  }

  private static String getPerkombiHbv(VaccinationStatus vaccinationStatus) {
    if (vaccinationStatus == null) {
      return null;
    }

    return BooleanWithUnknown.convertToValue(vaccinationStatus.getPerkombiHbv());
  }
}
