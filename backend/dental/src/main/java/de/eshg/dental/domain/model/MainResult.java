/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.domain.model;

public enum MainResult {
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
  /** Keine Diganose */
  N,
  /** Fehlend */
  U,
  /** Überkront */
  K,
  /** Trepaniert */
  E,
  /** Wurzelrest */
  W,
  /** Platzhalter */
  P,
  /** Nichtanlage */
  A
}
