/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.dental.domain.model;

public enum SecondaryResult {
  /** Naturgesund */
  S,
  /** Initialkaries */
  I,
  /** Kariös */
  D,
  /** Gefüllt */
  F,
  /** Extrahiert wegen Karies */
  M,
  /** Sonstige Extraktion */
  X,
  /** Zerstört */
  Z,
  /** Trauma */
  T,
  /** Hypoplasie */
  H,
  /** Fistel */
  O,
  /** Versiegelt */
  V,
  /** Keine Diagnose */
  N,
  /** Fehlend */
  U,
  /** Überkront */
  K,
  /** Trepaniert */
  E,
  /** Wurzelrest */
  W,
  /** Nichtanlage */
  A,
  /** Platzhalter */
  P,

  /** Doppelte Anlage */
  DA,
  /** Formanomalie */
  FA,
  /** Im Durchbruch */
  ID,
  /** Insuffizient */
  INS,
  /** Lückenschluss */
  LUE,
  /** Retinierter Zahn */
  RET,
  /** Zapfenzahn */
  ZA
}
