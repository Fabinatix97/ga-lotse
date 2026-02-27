/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.gdt.builder;

import de.eshg.lib.gdt.model.GdtElement;
import de.eshg.lib.gdt.model.GdtField;
import de.eshg.lib.gdt.model.GdtObject;
import de.eshg.lib.gdt.model.GdtRecord;
import java.util.List;
import java.util.Set;
import java.util.function.Consumer;

/**
 * Entry point for creating GDT 3.5 records.
 *
 * <p>This class provides a fluent API to compose GDT messages such as requesting patient data
 * (6300), transmitting examination results (6310), or ordering new examinations (6302).
 *
 * <p>It ensures the correct structure of the record, including the record type (8000) and the
 * hierarchical nesting of objects.
 */
public class GdtRecordBuilder extends BaseBuilder<GdtRecordBuilder> {

  private final String recordType;

  private GdtRecordBuilder(String recordType) {
    this.recordType = recordType;
  }

  private static final Set<String> VALID_RECORD_TYPES =
      Set.of(
          "6300", "6301", "6302", "6303", "6310", "6311", "6320", "6321", "6330", "6331"
          // Add all valid GDT 3.5 record types
          );

  /**
   * Creates a new GDT record builder for a specific record type.
   *
   * @param recordType The GDT record type (e.g., "6310").
   * @return A new builder instance.
   */
  public static GdtRecordBuilder create(String recordType) {
    if (!VALID_RECORD_TYPES.contains(recordType)) {
      throw new IllegalArgumentException(
          "Invalid GDT record type: " + recordType + ". Must be one of: " + VALID_RECORD_TYPES);
    }
    return new GdtRecordBuilder(recordType);
  }

  // Convenience Factories

  /**
   * Creates a builder for a "Request Master Data" (Stammdaten anfordern) record (Type 6300).
   *
   * <p><b>Usage:</b> A medical device (Client) requests patient data from the PVS/AIS (Server).
   * This is typically the first step when a patient is selected on the device manually.
   *
   * @return A builder for record type 6300.
   */
  public static GdtRecordBuilder requestMasterData() {
    return create("6300");
  }

  /**
   * Creates a builder for a "Transmit Master Data" (Stammdaten übermitteln) record (Type 6301).
   *
   * <p><b>Usage:</b> The PVS/AIS (Server) sends patient master data to the medical device (Client).
   * This is the response to a 6300 request or a push notification when opening a patient file in
   * the PVS.
   *
   * @return A builder for record type 6301.
   */
  public static GdtRecordBuilder transmitMasterData() {
    return create("6301");
  }

  /**
   * Creates a builder for a "Request New Examination" (Neue Untersuchung anfordern) record (Type
   * 6302).
   *
   * <p><b>Usage:</b> The PVS/AIS (Server) instructs the medical device (Client) to perform a
   * specific examination for a patient. Contains the Order/Request Object (8112).
   *
   * @return A builder for record type 6302.
   */
  public static GdtRecordBuilder requestNewExamination() {
    return create("6302");
  }

  /**
   * Creates a builder for a "Cancel Examination" (Angeforderte Untersuchung stornieren) record
   * (Type 6303).
   *
   * <p><b>Usage:</b> The PVS/AIS (Server) cancels a previously requested examination (Type 6302).
   *
   * @return A builder for record type 6303.
   */
  public static GdtRecordBuilder cancelExamination() {
    return create("6303");
  }

  /**
   * Creates a builder for a "Transmit Examination Data" (Daten einer Untersuchung übermitteln)
   * record (Type 6310).
   *
   * <p><b>Usage:</b> The medical device (Client) sends the results of an examination to the PVS/AIS
   * (Server). This is the primary message for transferring measurement values, reports (PDFs), or
   * images.
   *
   * @return A builder for record type 6310.
   */
  public static GdtRecordBuilder transmitExaminationData() {
    return create("6310");
  }

  /**
   * Creates a builder for a "Show Examination Data" (Daten einer Untersuchung zeigen) record (Type
   * 6311).
   *
   * <p><b>Usage:</b> The PVS/AIS (Server) requests the medical device to display the details of a
   * specific examination (e.g., open the proprietary viewer).
   *
   * @return A builder for record type 6311.
   */
  public static GdtRecordBuilder showExaminationData() {
    return create("6311");
  }

  @Override
  protected GdtRecordBuilder self() {
    return this;
  }

  /**
   * Finalizes the construction and returns the immutable {@link GdtRecord}.
   *
   * @return The constructed GDT record.
   */
  public GdtRecord build() {
    validateMandatoryFields(recordType, elements);
    return new GdtRecord(recordType, elements);
  }

  private void validateMandatoryFields(String recordType, List<GdtElement> elements) {
    requireHeader(elements);
    switch (recordType) {
      case "6300": // Request Master Data
      case "6301": // Transmit Master Data
        requirePatient(elements);
        break;
      case "6302": // Request New Examination
        requirePatient(elements);
        requireExaminationRequest(elements);
        requireRequestUid(elements);
        break;
      case "6303": // Cancel Examination
        requirePatient(elements);
        requireExaminationRequest(elements);
        requireRequestUid(elements);
        break;
      case "6310": // Transmit Examination Data
        requirePatient(elements);
        requireExaminationRequest(elements);
        requireRequestUid(elements);
        requireExaminationResult(elements);
        break;
      case "6311": // Show Examination Data
        requirePatient(elements);
        requireExaminationRequest(elements);
        requireRequestUid(elements);
        requireAttachmentIfPresent(elements);
        break;
    }
  }

  private void requireExaminationResult(List<GdtElement> elements) {
    requireObject(elements, "Obj_0057", "Examination Result");
  }

  private void requireHeader(List<GdtElement> elements) {
    requireObject(elements, "Obj_0033", "Header");
  }

  private void requireExaminationRequest(List<GdtElement> elements) {
    requireObject(elements, "Obj_0012", "Examination Request");
  }

  private void requirePatient(List<GdtElement> elements) {
    requireObject(elements, "Obj_0045", "Patient");
  }

  private void requireRequestUid(List<GdtElement> elements) {
    requireFieldInObject(elements, "Obj_0012", "Examination Request", "8314", "Request-UID");
  }

  /**
   * Validates that if an attachment attribute (8110) is present, the corresponding Attachment
   * object (Obj_0010) must also be present.
   *
   * @param elements The list of GDT elements to validate.
   * @throws IllegalStateException If the attribute is present but the object is missing.
   */
  private void requireAttachmentIfPresent(List<GdtElement> elements) {
    requireObjectIfAttributePresent(elements, "8110", "Obj_0010", "Attachment");
  }

  /**
   * Generic validation helper that ensures a specific GDT object is present if its corresponding
   * attribute tag is found in the element list.
   *
   * <p>In GDT 3.5, objects are often announced by an attribute tag (e.g., 8110 for Attachment)
   * before the actual object structure (Obj_0010). This method enforces this relationship.
   *
   * @param elements The list of GDT elements to validate.
   * @param attributeTag The GDT tag representing the object's attribute (e.g., "8110").
   * @param objectId The internal GDT object ID (e.g., "Obj_0010").
   * @param name A human-readable name for the object to be used in error messages.
   * @throws IllegalStateException If the attribute is present but the corresponding object is
   *     missing.
   */
  private void requireObjectIfAttributePresent(
      List<GdtElement> elements, String attributeTag, String objectId, String name) {
    boolean attributePresent = elements.stream().anyMatch(e -> attributeTag.equals(e.getTag()));
    if (attributePresent) {
      elements.stream()
          .filter(GdtObject.isInstance())
          .map(GdtObject.cast())
          .filter(o -> attributeTag.equals(o.attributeTag()))
          .filter(o -> objectId.equals(o.objectId()))
          .findFirst()
          .orElseThrow(
              () ->
                  new IllegalStateException(
                      "If attribute "
                          + attributeTag
                          + " is present, mandatory object "
                          + name
                          + " ("
                          + objectId
                          + ") must be present."));
    }
  }

  private void requireObject(List<GdtElement> elements, String objectId, String name) {
    findObject(elements, objectId, name);
  }

  private GdtObject findObject(List<GdtElement> elements, String objectId, String name) {
    return elements.stream()
        .filter(GdtObject.isInstance())
        .map(GdtObject.cast())
        .filter(o -> objectId.equals(o.objectId()))
        .findFirst()
        .orElseThrow(
            () ->
                new IllegalStateException(
                    "Mandatory object missing: " + name + " (" + objectId + ")"));
  }

  private void requireFieldInObject(
      List<GdtElement> elements, String objectId, String objectName, String tag, String fieldName) {

    GdtObject targetObject = findObject(elements, objectId, objectName);

    boolean fieldExists =
        targetObject.elements().stream()
            .filter(GdtField.isInstance())
            .map(GdtField.cast())
            .anyMatch(f -> tag.equals(f.tag()));

    if (!fieldExists) {
      throw new IllegalStateException(
          "Mandatory field " + fieldName + " (" + tag + ") missing in object " + objectId);
    }
  }

  // --- Top Level Objects ---

  /**
   * Adds the mandatory GDT Header (Obj_0033 / Obj_Kopfdaten_GDT).
   *
   * <p>Identified by attribute tag 8133. Contains sender/receiver IDs, software version, and
   * encoding info.
   *
   * @param config A configuration consumer for the {@link HeaderBuilder}.
   * @return This builder instance.
   */
  public GdtRecordBuilder header(Consumer<HeaderBuilder> config) {
    return addObject("8133", "Kopfdaten_GDT", "Obj_0033", new HeaderBuilder(), config);
  }

  /**
   * Adds the Patient Master Data (Obj_0045 / Obj_Patient).
   *
   * <p>Identified by attribute tag 8145. Contains patient ID, name, birthdate, etc.
   *
   * @param config A configuration consumer for the {@link PatientBuilder}.
   * @return This builder instance.
   */
  public GdtRecordBuilder patient(Consumer<PatientBuilder> config) {
    return addObject("8145", "Patient", "Obj_0045", new PatientBuilder(), config);
  }

  /**
   * Adds an Examination Request (Obj_0012 / Obj_Anforderung).
   *
   * <p>Identified by attribute tag 8112. Mandatory for record type 6302. Defines what kind of test
   * is being requested (Test Ident 8410, Characteristic Map 8402).
   *
   * @param config A configuration consumer for the {@link ExaminationRequestBuilder}.
   * @return This builder instance.
   */
  public GdtRecordBuilder examinationRequest(Consumer<ExaminationRequestBuilder> config) {
    return addObject("8112", "Anforderung", "Obj_0012", new ExaminationRequestBuilder(), config);
  }

  /**
   * Adds an Examination Result (Obj_0057 / Obj_Untersuchungsergebnis_GDT).
   *
   * <p>Identified by attribute tag 8157. Mandatory for record type 6310. Contains the actual
   * measurement values, units, and result status.
   *
   * @param config A configuration consumer for the {@link ExaminationResultBuilder}.
   * @return This builder instance.
   */
  public GdtRecordBuilder examinationResult(Consumer<ExaminationResultBuilder> config) {
    return addObject(
        "8157", "Untersuchungsergebnis_GDT", "Obj_0057", new ExaminationResultBuilder(), config);
  }

  /**
   * Adds a File Attachment (Obj_0010 / Obj_Anhang).
   *
   * <p>Identified by attribute tag 8110. Used to transfer binary data like PDFs, Images, or
   * proprietary files referenced by a file path.
   *
   * @param config A configuration consumer for the {@link AttachmentBuilder}.
   * @return This builder instance.
   */
  public GdtRecordBuilder attachment(Consumer<AttachmentBuilder> config) {
    return addObject("8110", "Anhang", "Obj_0010", new AttachmentBuilder(), config);
  }
}
