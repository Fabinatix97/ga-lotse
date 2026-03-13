/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.gdt.v21.model;

/** A single GDT 2.10 field consisting of a 4-digit tag and its string value. */
public record Gdt21Field(String tag, String value) {}
