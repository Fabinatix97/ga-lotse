/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.percentiles;

import static de.eshg.schoolentry.percentiles.PercentileParameters.*;

import de.eshg.base.GenderDto;
import de.eshg.schoolentry.api.PercentilesDto;
import de.eshg.schoolentry.business.model.ChildData;
import de.eshg.schoolentry.client.PersonClient;
import de.eshg.schoolentry.domain.model.SchoolEntryProcedure;
import java.time.Clock;
import java.time.LocalDate;
import java.time.Period;
import org.apache.commons.math3.distribution.NormalDistribution;
import org.springframework.stereotype.Component;

@Component
public class PercentileCalculationService {

  private final PersonClient personClient;
  private final Clock clock;

  public PercentileCalculationService(PersonClient personClient, Clock clock) {
    this.personClient = personClient;
    this.clock = clock;
  }

  public PercentilesDto getPercentiles(
      SchoolEntryProcedure procedure, Double height, Double weight) {
    PercentilesDto response = new PercentilesDto();

    ChildData childData = personClient.fetchChildData(procedure);
    GenderDto gender = childData.gender();
    Integer ageGroup = calculateAgeGroup(childData);
    if (!SUPPORTED_GENDERS.contains(gender) || !SUPPORTED_AGE_GROUPS.contains(ageGroup)) {
      if (weight != null && height != null) {
        response.setBmi(calculateBmi(weight, height));
      }
      return response;
    }

    if (height != null) {

      LMSParameters parameters = getParameters(QuantityType.HEIGHT, gender, ageGroup);
      response.setHeightPercentile(calculatePercentile(height, parameters));

      if (weight != null) {
        double bmi = calculateBmi(weight, height);
        response.setBmi(bmi);

        LMSParameters bmiParameters = getParameters(QuantityType.BMI, gender, ageGroup);
        response.setBmiPercentile(calculatePercentile(bmi, bmiParameters));
      }
    }

    if (weight != null) {
      LMSParameters parameters = getParameters(QuantityType.WEIGHT, gender, ageGroup);
      response.setWeightPercentile(calculatePercentile(weight, parameters));
    }

    return response;
  }

  private Integer calculateAgeGroup(ChildData childData) {
    Period age = Period.between(childData.dateOfBirth(), LocalDate.now(clock));
    long ageInMonths = age.toTotalMonths();
    return Math.toIntExact(roundToNearestMultipleOfSix(ageInMonths));
  }

  static long roundToNearestMultipleOfSix(long months) {
    return ((months + 3) / 6) * 6;
  }

  private static double calculateBmi(Double weight, Double height) {
    return weight / Math.pow(height, 2);
  }

  static Double calculatePercentile(double measuredValue, LMSParameters params) {
    if (params == null) {
      return null;
    }
    double z;
    if (params.l() != 0) {
      z = (Math.pow(measuredValue / params.m(), params.l()) - 1) / (params.s() * params.l());
    } else {
      z = 1 / params.s() * Math.log(measuredValue / params.m());
    }
    return new NormalDistribution().cumulativeProbability(z);
  }
}
