/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.report.pdf;

import static org.apache.commons.lang3.StringUtils.isBlank;
import static org.apache.commons.lang3.StringUtils.isNotBlank;

import java.util.List;
import java.util.Locale;

/**
 * Data for the inspection report "inspection-report.ftlx".
 *
 * <p>To keep things simple we don't create another type hierarchy for the checklist elements for
 * the PDF report data. Instead, we put all attributes into the same class, so that some attributes
 * are nullable. For the simple case of creating reports on-the-fly it's ok. This data does not get
 * persisted.
 */
public record RepChecklistElement(
    Type type,

    /* used for most types except TEXT and SEPARATOR */
    String title,

    /* used for types TEXT and TEXT_BLOCK; null for others */
    String value,

    /* used for type=CHOICE and YES_NO; null for others */
    List<Choice> choices,

    /* automatically determined; if true then the layout for the choices changes */
    boolean simpleYesNo,

    /* automatically determined; if true then the layout for the choices changes */
    boolean choiceWithExtraText) {

  public enum Type {
    TOP_LEVEL_TITLE,
    CHAPTER,
    SECTION,
    CHOICE,
    TEXT,
    TEXT_BLOCK,
    FULL_TEXT_BLOCK,
    SEPARATOR
  }

  public record Choice(String text, boolean selected, String extraText) {}

  public RepChecklistElement(String title, Type type, String value, List<Choice> choices) {
    this(
        type,
        title,
        value,
        choices,
        determineIfElementIsSimpleYesNo(type, choices),
        determineIfChoicesHaveExtraText(type, choices));
  }

  public static RepChecklistElement createToplevelTitle(String title) {
    return new RepChecklistElement(title, Type.TOP_LEVEL_TITLE, null, null);
  }

  public static RepChecklistElement createChapter(String title) {
    return new RepChecklistElement(title, Type.CHAPTER, null, null);
  }

  public static RepChecklistElement createSection(String title) {
    return new RepChecklistElement(title, Type.SECTION, null, null);
  }

  public static RepChecklistElement createText(String text) {
    return new RepChecklistElement(null, Type.TEXT, text, null);
  }

  public static RepChecklistElement createTextBlock(String title, String value) {
    return new RepChecklistElement(title, Type.TEXT_BLOCK, value, null);
  }

  public static RepChecklistElement createFullTextBlock(String title, String value) {
    return new RepChecklistElement(title, Type.FULL_TEXT_BLOCK, value, null);
  }

  public static RepChecklistElement createYesNo(String title, boolean isYes) {
    return createYesNo(title, isYes, null, null);
  }

  public static RepChecklistElement createYesNo(
      String title, boolean isYes, String extraTextYes, String extraTextNo) {
    return new RepChecklistElement(
        title,
        Type.CHOICE,
        null,
        List.of(new Choice("ja", isYes, extraTextYes), new Choice("nein", !isYes, extraTextNo)));
  }

  public static RepChecklistElement createChoice(String title, List<Choice> choices) {
    return new RepChecklistElement(title, Type.CHOICE, null, choices);
  }

  public static RepChecklistElement createSeparator() {
    return new RepChecklistElement(null, Type.SEPARATOR, null, null);
  }

  public String getTitle() {
    return title;
  }

  public Type getType() {
    return type;
  }

  public String getValue() {
    return value;
  }

  public List<Choice> getChoices() {
    return choices;
  }

  public boolean isSimpleYesNo() {
    return simpleYesNo;
  }

  public boolean isChoiceWithExtraText() {
    return choiceWithExtraText;
  }

  private static boolean determineIfElementIsSimpleYesNo(Type type, List<Choice> choices) {
    return type == Type.CHOICE
        && choices != null
        && choices.size() == 2
        && choices.get(0).text().toLowerCase(Locale.GERMAN).equals("ja")
        && choices.get(1).text().toLowerCase(Locale.GERMAN).equals("nein")
        && isBlank(choices.get(0).extraText())
        && isBlank(choices.get(1).extraText());
  }

  private static boolean determineIfChoicesHaveExtraText(Type type, List<Choice> choices) {
    if (type != Type.CHOICE || choices == null || choices.isEmpty()) return false;
    return choices.stream().anyMatch(choice -> isNotBlank(choice.extraText()));
  }
}
