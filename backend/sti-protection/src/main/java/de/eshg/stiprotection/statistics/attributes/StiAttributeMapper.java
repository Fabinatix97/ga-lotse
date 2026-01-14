/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.statistics.attributes;

import de.eshg.lib.statistics.api.ValueOptionInternal;
import de.eshg.stiprotection.persistence.db.Concern;
import de.eshg.stiprotection.persistence.db.Gender;
import de.eshg.stiprotection.persistence.db.StiProcedureOrigin;
import de.eshg.stiprotection.persistence.db.medicalhistory.SafeSexPractice;
import de.eshg.stiprotection.persistence.db.medicalhistory.SexualOrientation;
import java.util.Arrays;
import java.util.List;

public class StiAttributeMapper {

  private StiAttributeMapper() {}

  public static List<ValueOptionInternal> mapConcernToValueOptions() {
    return Arrays.stream(Concern.values())
        .map(
            c ->
                switch (c) {
                  case HIV_STI_CONSULTATION ->
                      new ValueOptionInternal(c.name(), "HIV-STI-Beratung", false);
                  case SEX_WORK -> new ValueOptionInternal(c.name(), "Sexarbeit", false);
                })
        .toList();
  }

  public static List<ValueOptionInternal> mapOriginToValueOptions() {
    return Arrays.stream(StiProcedureOrigin.values())
        .map(
            o ->
                switch (o) {
                  case EMPLOYEE_PORTAL -> new ValueOptionInternal(o.name(), "Mitarbeiter", false);
                  case CITIZEN_PORTAL -> new ValueOptionInternal(o.name(), "Bürger", false);
                })
        .toList();
  }

  public static List<ValueOptionInternal> mapGenderToValueOptions() {
    return Arrays.stream(Gender.values())
        .map(
            g ->
                switch (g) {
                  case NOT_SPECIFIED -> new ValueOptionInternal(g.name(), "Keine Angabe", false);
                  case DIVERSE -> new ValueOptionInternal(g.name(), "Divers", false);
                  case FEMALE -> new ValueOptionInternal(g.name(), "Weiblich", false);
                  case MALE -> new ValueOptionInternal(g.name(), "Männlich", false);
                })
        .toList();
  }

  public static List<ValueOptionInternal> mapSexualOrientationToValueOptions() {
    return Arrays.stream(SexualOrientation.values())
        .map(
            so ->
                switch (so) {
                  case HETEROSEXUAL -> new ValueOptionInternal(so.name(), "Heterosexuell", false);
                  case HOMOSEXUAL -> new ValueOptionInternal(so.name(), "Homosexuell", false);
                  case BISEXUAL -> new ValueOptionInternal(so.name(), "Bisexuell", false);
                  case NOT_SPECIFIED -> new ValueOptionInternal(so.name(), "Keine Angabe", false);
                })
        .toList();
  }

  public static List<ValueOptionInternal> mapSaferSexPracticeToValueOptions() {
    return Arrays.stream(SafeSexPractice.values())
        .map(
            ssp ->
                switch (ssp) {
                  case ALWAYS -> new ValueOptionInternal(ssp.name(), "Immer", false);
                  case FREQUENTLY -> new ValueOptionInternal(ssp.name(), "Häufig", false);
                  case OCCASIONALLY -> new ValueOptionInternal(ssp.name(), "Gelegentlich", false);
                  case NEVER -> new ValueOptionInternal(ssp.name(), "Nie", false);
                })
        .toList();
  }
}
