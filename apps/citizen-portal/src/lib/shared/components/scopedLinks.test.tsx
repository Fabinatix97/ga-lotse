/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, expect, test } from "vitest";

import { isCompatibleScope } from "@/lib/shared/components/scopedLinks";

describe("compatible scopes", () => {
  test("target path outside any login scope is compatible", () => {
    expect(isCompatibleScope("/", "/mein-bereich")).toBe(true);
    expect(
      isCompatibleScope("/einschulungsuntersuchung", "/mein-bereich"),
    ).toBe(true);
  });

  test("target path inside current login scope is compatible", () => {
    expect(isCompatibleScope("/mein-bereich/profil", "/mein-bereich")).toBe(
      true,
    );
  });

  test("target path outside current login scope is not compatible", () => {
    expect(
      isCompatibleScope(
        "/mein-bereich/profil",
        "/einschulungsuntersuchung/termin",
      ),
    ).toBe(false);
  });

  test("i18n path inside current login scope is compatible", () => {
    expect(isCompatibleScope("/en/mein-bereich/profil", "/mein-bereich")).toBe(
      true,
    );
    expect(
      isCompatibleScope("/en/mein-bereich/profil", "/en/mein-bereich"),
    ).toBe(true);
    expect(
      isCompatibleScope("/en/mein-bereich/profil", "/de/mein-bereich"),
    ).toBe(true);
    expect(isCompatibleScope("/mein-bereich/profil", "/en/mein-bereich")).toBe(
      true,
    );
  });

  test("i18n target path outside current login scope is not compatible", () => {
    expect(
      isCompatibleScope(
        "/en/mein-bereich/profil",
        "/einschulungsuntersuchung/termin",
      ),
    ).toBe(false);
    expect(
      isCompatibleScope(
        "/en/mein-bereich/profil",
        "/en/einschulungsuntersuchung/termin",
      ),
    ).toBe(false);
    expect(
      isCompatibleScope(
        "/en/mein-bereich/profil",
        "/de/einschulungsuntersuchung/termin",
      ),
    ).toBe(false);
    expect(
      isCompatibleScope(
        "/mein-bereich/profil",
        "/en/einschulungsuntersuchung/termin",
      ),
    ).toBe(false);
  });
});
