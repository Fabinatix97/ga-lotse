/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.statistics;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.schoolentry.api.CountryCodeDto;
import de.eshg.schoolentry.domain.model.Anamnesis;
import de.eshg.schoolentry.domain.model.SchoolEntryCountryCode;
import de.eshg.schoolentry.domain.model.SchoolEntryProcedure;
import de.eshg.schoolentry.statistics.attributes.EsuAnamnesisAttributes;
import de.eshg.schoolentry.statistics.options.BirthWeight;
import de.eshg.schoolentry.statistics.options.BooleanWithUnknown;
import de.eshg.schoolentry.statistics.options.Country;
import de.eshg.schoolentry.statistics.options.CountryName;
import de.eshg.schoolentry.statistics.options.Daycare;
import java.time.Clock;
import java.time.LocalDate;
import java.time.Period;
import java.util.Arrays;
import java.util.Map;
import java.util.function.Function;
import org.jetbrains.annotations.VisibleForTesting;
import org.springframework.stereotype.Component;

@Component
public class AnamnesisStatistics {

  private final Clock clock;

  public AnamnesisStatistics(Clock clock) {
    this.clock = clock;
  }

  Object mapAnamnesisAttribute(SchoolEntryProcedure procedure, EsuAnamnesisAttributes attribute) {
    return switch (attribute) {
      case KT -> getDaycareValue(procedure);
      case KISS -> getAnamnesisAttribute(procedure, Anamnesis::getChildLanguageScreening);
      case VLK -> getAnamnesisAttribute(procedure, Anamnesis::getPreliminaryCourse);
      case GG -> getBirthWeight(procedure);
      case SSW_DAUER -> getAnamnesisAttribute(procedure, Anamnesis::getGestationalAge);
      case U2E -> getAnamnesisCheckUpsAttribute(procedure, Anamnesis::getU2);
      case U3E -> getAnamnesisCheckUpsAttribute(procedure, Anamnesis::getU3);
      case U4E -> getAnamnesisCheckUpsAttribute(procedure, Anamnesis::getU4);
      case U5E -> getAnamnesisCheckUpsAttribute(procedure, Anamnesis::getU5);
      case U6E -> getAnamnesisCheckUpsAttribute(procedure, Anamnesis::getU6);
      case U7A -> getAnamnesisCheckUpsAttribute(procedure, Anamnesis::getU7a);
      case U7E -> getAnamnesisCheckUpsAttribute(procedure, Anamnesis::getU7);
      case U8E -> getAnamnesisCheckUpsAttribute(procedure, Anamnesis::getU8);
      case U9E -> getAnamnesisCheckUpsAttribute(procedure, Anamnesis::getU9);
      case FF -> getAnamnesisAttribute(procedure, Anamnesis::getEarlySupport);
      case IP -> getAnamnesisAttribute(procedure, Anamnesis::getIntegrationPlace);
      case ERGO -> getAnamnesisAttribute(procedure, Anamnesis::getErgotherapy);
      case LOGO -> getAnamnesisAttribute(procedure, Anamnesis::getSpeechTherapy);
      case KG -> getAnamnesisAttribute(procedure, Anamnesis::getPhysiotherapy);
      case STAKI_TEXT -> getCountryName(procedure, Anamnesis::getNationalityChild);
      case STAKI_FFM -> getAnamnesisAttribute(procedure, Anamnesis::getNationalityChild);
      case STAKI -> getCountryCode(procedure, Anamnesis::getNationalityChild);
      case GEBKI_LKZ -> getAnamnesisAttribute(procedure, Anamnesis::getCountryOfBirthChild);
      case GEBKI_TEXT -> getCountryName(procedure, Anamnesis::getCountryOfBirthChild);
      case GEBKI -> getCountryCode(procedure, Anamnesis::getCountryOfBirthChild);
      case STAET1_FFM -> getAnamnesisAttribute(procedure, Anamnesis::getNationalityFirstParent);
      case STAET1_TEXT -> getCountryName(procedure, Anamnesis::getNationalityFirstParent);
      case STAET1 -> getCountryCode(procedure, Anamnesis::getNationalityFirstParent);
      case GEBET1_FFM -> getAnamnesisAttribute(procedure, Anamnesis::getCountryOfBirthFirstParent);
      case GEBET1_TEXT -> getCountryName(procedure, Anamnesis::getCountryOfBirthFirstParent);
      case GEBET1 -> getCountryCode(procedure, Anamnesis::getCountryOfBirthFirstParent);
      case STAET2_FFM -> getAnamnesisAttribute(procedure, Anamnesis::getNationalitySecondParent);
      case STAET2_TEXT -> getCountryName(procedure, Anamnesis::getNationalitySecondParent);
      case STAET2 -> getCountryCode(procedure, Anamnesis::getNationalitySecondParent);
      case GEBET2_FFM -> getAnamnesisAttribute(procedure, Anamnesis::getCountryOfBirthSecondParent);
      case GEBET2_TEXT -> getCountryName(procedure, Anamnesis::getCountryOfBirthSecondParent);
      case GEBET2 -> getCountryCode(procedure, Anamnesis::getCountryOfBirthSecondParent);
      case MIG -> getAnamnesisAttribute(procedure, Anamnesis::getHasMigrationBackground);
    };
  }

  private String getBirthWeight(SchoolEntryProcedure procedure) {
    Anamnesis anamnesis = procedure.getAnamnesis();
    if (anamnesis == null) {
      return null;
    }
    Integer birthWeight = anamnesis.getBirthWeight();
    if (birthWeight == null || birthWeight == 9999) {
      return BirthWeight.UNKNOWN.getValue();
    } else if (birthWeight < 500) {
      return BirthWeight.CATEGORY_1.getValue();
    } else if (birthWeight < 1000) {
      return BirthWeight.CATEGORY_2.getValue();
    } else if (birthWeight < 1500) {
      return BirthWeight.CATEGORY_3.getValue();
    } else if (birthWeight < 2000) {
      return BirthWeight.CATEGORY_4.getValue();
    } else if (birthWeight < 2500) {
      return BirthWeight.CATEGORY_5.getValue();
    } else {
      return BirthWeight.CATEGORY_6.getValue();
    }
  }

  static <T> T getAnamnesisAttribute(
      SchoolEntryProcedure procedure, Function<Anamnesis, T> anamnesisGetter) {
    Anamnesis anamnesis = procedure.getAnamnesis();
    if (anamnesis == null) {
      return null;
    }
    return anamnesisGetter.apply(anamnesis);
  }

  static String getNumberOfSiblings(SchoolEntryProcedure procedure) {
    Anamnesis anamnesis = procedure.getAnamnesis();
    if (anamnesis == null || anamnesis.getNumberOfSiblings() == null) {
      return null;
    }
    return anamnesis.getNumberOfSiblings().toString();
  }

  private static String getAnamnesisCheckUpsAttribute(
      SchoolEntryProcedure procedure,
      Function<Anamnesis, de.eshg.schoolentry.domain.model.BooleanWithUnknown> anamnesisGetter) {
    Anamnesis anamnesis = procedure.getAnamnesis();
    if (anamnesis == null) {
      return null;
    }
    return BooleanWithUnknown.convertToValue(anamnesisGetter.apply(anamnesis));
  }

  private static String getCountryName(
      SchoolEntryProcedure procedure, Function<Anamnesis, SchoolEntryCountryCode> anamnesisGetter) {
    Anamnesis anamnesis = procedure.getAnamnesis();
    if (anamnesis == null || anamnesisGetter.apply(anamnesis) == null) {
      return null;
    }
    return CountryName.valueOf(anamnesisGetter.apply(anamnesis).name()).getName();
  }

  private static String getCountryCode(
      SchoolEntryProcedure procedure, Function<Anamnesis, SchoolEntryCountryCode> anamnesisGetter) {
    Anamnesis anamnesis = procedure.getAnamnesis();
    if (anamnesis == null || anamnesisGetter.apply(anamnesis) == null) {
      return null;
    }
    Map<String, Integer> countryCodes =
        Arrays.stream(CountryCodeDto.values())
            .collect(StreamUtil.toLinkedHashMap(Enum::name, CountryCodeDto::getCountryGroupCode));
    SchoolEntryCountryCode schoolEntryCountryCode = anamnesisGetter.apply(anamnesis);
    return Country.convertCountryCodeToValue(countryCodes.get(schoolEntryCountryCode.name()));
  }

  String getDaycareValue(SchoolEntryProcedure procedure) {
    if (procedure.getAppointment() == null
        || procedure.getAppointment().getAppointmentStart() == null
        || procedure.getAnamnesis() == null) {
      return null;
    }

    Boolean wasInDaycare = procedure.getAnamnesis().getWasInDaycare();
    if (Boolean.FALSE.equals(wasInDaycare)) {
      return Daycare.NO.getValue();
    }

    LocalDate inDaycareSince = procedure.getAnamnesis().getInDaycareSince();
    if (wasInDaycare == null || inDaycareSince == null) {
      return Daycare.UNKNOWN.getValue();
    }

    LocalDate appointmentDate =
        procedure.getAppointment().getAppointmentStart().atZone(clock.getZone()).toLocalDate();

    return mapDaycare(appointmentDate, inDaycareSince).getValue();
  }

  @VisibleForTesting
  static Daycare mapDaycare(LocalDate appointmentDate, LocalDate inDaycareSince) {
    Period dateDifference = Period.between(inDaycareSince, appointmentDate);
    long months = dateDifference.toTotalMonths();
    if (months < 18) {
      return Daycare.MONTH_18;
    } else if (months < 36) {
      return Daycare.MONTH_18_TO_YEARS_3;
    } else {
      return Daycare.YEARS_3;
    }
  }
}
