/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lsd.register.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "ActorType")
public enum ActorTypeDto {
  EXT("external module", "Externes Modul"),
  GM("base module", "Grundmodul"),
  FM("business module", "Fachmodul"),
  LSD("local service directory", "lokales Dienstverzeichnis"),
  MISC("Miscellaneous", "Sonstige"),
  WEB("webserver", "Webserver"),
  ZA("central application", "zentrale Anwendung"),
  ZR("central repository", "zentrale Ablage"),
  ;

  public final String descriptionEn;
  public final String descriptionDe;

  ActorTypeDto(String descriptionEn, String descriptionDe) {
    this.descriptionEn = descriptionEn;
    this.descriptionDe = descriptionDe;
  }

  public static ActorTypeDto from(Enum<?> e) {
    return e == null ? null : valueOf(e.name());
  }

  public static <E extends Enum<E>, R extends Enum<R>> R convert(E e, Class<R> toBeConverted) {
    return Enum.valueOf(toBeConverted, e.name());
  }
}
