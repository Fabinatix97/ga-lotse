/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.gdt.v21.builder;

import de.eshg.lib.gdt.v21.model.Gdt21Field;
import de.eshg.lib.gdt.v21.model.Gdt21Record;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.function.Consumer;
import java.util.regex.Pattern;

/**
 * Fluent entry point for building GDT 2.10 records.
 *
 * <p>Use the static factory methods to create a builder for a specific record type, then chain
 * section builders ({@link #header}, {@link #patient}, etc.) before calling {@link #build()}.
 */
public class Gdt21RecordBuilder {

  private static final Set<String> VALID_RECORD_TYPES =
      Set.of("6300", "6301", "6302", "6303", "6310", "6311");

  // All supported record types require a header section.
  private static final Set<String> REQUIRES_HEADER =
      Set.of("6300", "6301", "6302", "6303", "6310", "6311");

  // Record types that require a patient section
  private static final Set<String> REQUIRES_PATIENT =
      Set.of("6300", "6301", "6302", "6310", "6311");

  // Record types that require an examination request section
  private static final Set<String> REQUIRES_EXAMINATION_REQUEST = Set.of("6302", "6303");

  // Record types that require an examination result section
  private static final Set<String> REQUIRES_EXAMINATION_RESULT = Set.of("6310");

  private static final Pattern TAG_PATTERN = Pattern.compile("\\d{4}");

  private final String recordType;
  private final List<Gdt21Field> fields = new ArrayList<>();

  private boolean headerAdded = false;
  private boolean patientAdded = false;
  private boolean examinationRequestAdded = false;
  private boolean examinationResultAdded = false;

  private Gdt21RecordBuilder(String recordType) {
    this.recordType = recordType;
  }

  // ---- Factory methods ----

  /** Creates a builder for record type 6300 (request master data). */
  public static Gdt21RecordBuilder requestMasterData() {
    return new Gdt21RecordBuilder("6300");
  }

  /** Creates a builder for record type 6301 (transmit master data). */
  public static Gdt21RecordBuilder transmitMasterData() {
    return new Gdt21RecordBuilder("6301");
  }

  /** Creates a builder for record type 6302 (request new examination). */
  public static Gdt21RecordBuilder requestNewExamination() {
    return new Gdt21RecordBuilder("6302");
  }

  /** Creates a builder for record type 6310 (transmit examination data). */
  public static Gdt21RecordBuilder transmitExaminationData() {
    return new Gdt21RecordBuilder("6310");
  }

  /** Creates a builder for record type 6311 (show examination data). */
  public static Gdt21RecordBuilder showExaminationData() {
    return new Gdt21RecordBuilder("6311");
  }

  /**
   * Creates a builder for an arbitrary record type.
   *
   * @param recordType a 4-digit GDT record type
   * @throws IllegalArgumentException if the record type is not in the supported set
   */
  public static Gdt21RecordBuilder create(String recordType) {
    if (!VALID_RECORD_TYPES.contains(recordType)) {
      throw new IllegalArgumentException(
          "Unsupported GDT 2.10 record type: " + recordType + ". Supported: " + VALID_RECORD_TYPES);
    }
    return new Gdt21RecordBuilder(recordType);
  }

  // ---- Section builders ----

  /**
   * Configures the header section (emits 9218 and optional 8315/8316/9206 fields). Mandatory for
   * all record types.
   */
  public Gdt21RecordBuilder header(Consumer<Gdt21HeaderBuilder> config) {
    Gdt21HeaderBuilder builder = new Gdt21HeaderBuilder();
    config.accept(builder);
    fields.addAll(builder.build());
    headerAdded = true;
    return this;
  }

  /**
   * Configures the patient section (flat patient fields 3000–3110). Mandatory for 6301, 6302, 6310,
   * 6311.
   */
  public Gdt21RecordBuilder patient(Consumer<Gdt21PatientBuilder> config) {
    Gdt21PatientBuilder builder = new Gdt21PatientBuilder();
    config.accept(builder);
    fields.addAll(builder.build());
    patientAdded = true;
    return this;
  }

  /** Configures the examination request section (field 8402). Mandatory for 6302, 6303. */
  public Gdt21RecordBuilder examinationRequest(Consumer<Gdt21ExaminationRequestBuilder> config) {
    Gdt21ExaminationRequestBuilder builder = new Gdt21ExaminationRequestBuilder();
    config.accept(builder);
    fields.addAll(builder.build());
    examinationRequestAdded = true;
    return this;
  }

  /**
   * Configures the examination result section (fields 6200, 6201, 8410, 8437, 8438, 6227).
   * Mandatory for 6310.
   */
  public Gdt21RecordBuilder examinationResult(Consumer<Gdt21ExaminationResultBuilder> config) {
    Gdt21ExaminationResultBuilder builder = new Gdt21ExaminationResultBuilder();
    config.accept(builder);
    fields.addAll(builder.build());
    examinationResultAdded = true;
    return this;
  }

  /**
   * Adds a raw field — escape hatch for tags not covered by section builders.
   *
   * @throws IllegalArgumentException if {@code tag} is not exactly 4 decimal digits
   */
  public Gdt21RecordBuilder addField(String tag, String value) {
    if (tag == null || !TAG_PATTERN.matcher(tag).matches()) {
      throw new IllegalArgumentException("Tag must be exactly 4 decimal digits, got: " + tag);
    }
    fields.add(new Gdt21Field(tag, value));
    return this;
  }

  // ---- Build ----

  /**
   * Validates mandatory sections and returns the completed record.
   *
   * @throws IllegalStateException if a required section is missing
   */
  public Gdt21Record build() {
    validateMandatoryFields();
    return new Gdt21Record(recordType, fields);
  }

  private void validateMandatoryFields() {
    if (REQUIRES_HEADER.contains(recordType) && !headerAdded) {
      throw new IllegalStateException("Header section is required for record type " + recordType);
    }
    if (REQUIRES_PATIENT.contains(recordType) && !patientAdded) {
      throw new IllegalStateException("Patient section is required for record type " + recordType);
    }
    if (REQUIRES_EXAMINATION_REQUEST.contains(recordType) && !examinationRequestAdded) {
      throw new IllegalStateException(
          "ExaminationRequest section is required for record type " + recordType);
    }
    if (REQUIRES_EXAMINATION_RESULT.contains(recordType) && !examinationResultAdded) {
      throw new IllegalStateException(
          "ExaminationResult section is required for record type " + recordType);
    }
  }
}
