/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.servicedirectory.orgunit.persistence.entity;

public enum OrgUnitType {
  GA("health department", "Gesundheitsamt"),
  LA("land department", "Landesamt"),
  ZD("central services", "zentrale Dienste"),
  ;

  public final String descriptionEn;
  public final String descriptionDe;

  OrgUnitType(String descriptionEn, String descriptionDe) {
    this.descriptionEn = descriptionEn;
    this.descriptionDe = descriptionDe;
  }

  public static OrgUnitType from(Enum<?> e) {
    return e == null ? null : valueOf(e.name());
  }

  public static <E extends Enum<E>, R extends Enum<R>> R convert(E e, Class<R> toBeConverted) {
    if (e != null) {
      return Enum.valueOf(toBeConverted, e.name());
    } else {
      return null;
    }
  }
}
