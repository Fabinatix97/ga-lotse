/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.util;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Predicate;
import java.util.*;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.jpa.repository.query.EscapeCharacter;

public class SearchSpecificationUtil {

  private static final EscapeCharacter ESCAPING = EscapeCharacter.DEFAULT;

  private SearchSpecificationUtil() {}

  public static List<String> splitToWords(String queryParameter) {
    if (StringUtils.isBlank(queryParameter)) {
      return List.of();
    }
    return Arrays.asList(queryParameter.trim().split("[\\s,]+"));
  }

  public static Predicate containsNormalized(
      CriteriaBuilder builder, Expression<String> expression, List<String> queryWords) {
    List<Predicate> conjunctions = new ArrayList<>();
    for (String queryWord : queryWords) {
      conjunctions.add(containsNormalized(builder, expression, queryWord));
    }

    return builder.and(conjunctions.toArray(Predicate[]::new));
  }

  public static Predicate containsNormalized(
      CriteriaBuilder builder, Expression<String> expression, String queryWord) {
    Expression<String> nullSafeFieldExpression =
        builder.lower(emptyStringIfNull(builder, expression));

    return builder.like(
        normalizeText(builder, nullSafeFieldExpression),
        normalizeText(builder, builder.literal("%" + queryWord.toLowerCase() + "%")),
        ESCAPING.getEscapeCharacter());
  }

  private static Expression<String> emptyStringIfNull(
      CriteriaBuilder builder, Expression<?> expression) {
    return builder.coalesce(expression.as(String.class), builder.literal(""));
  }

  public static Expression<String> normalizeText(CriteriaBuilder cb, Expression<String> input) {
    return cb.function("normalize_text", String.class, input);
  }

  public static Expression<Double> similarity(
      CriteriaBuilder builder, String queryWord, Expression<String> expression) {
    return builder.function(
        "similarity",
        Double.class,
        normalizeText(builder, expression),
        normalizeText(builder, builder.literal(queryWord)));
  }

  public static Expression<Boolean> isSimilar(
      CriteriaBuilder cb, Expression<String> lhs, Expression<String> rhs) {
    return cb.function(
        "sql", Boolean.class, cb.literal("? % ?"), normalizeText(cb, lhs), normalizeText(cb, rhs));
  }

  @SafeVarargs
  @SuppressWarnings("varargs")
  public static Expression<String> concatWithSeparator(
      CriteriaBuilder cb, Expression<String>... expressions) {
    return cb.function("immutable_concat_strings_ws", String.class, expressions);
  }

  /**
   * The minimum thresholds are computed by taking the trigram similarities of changing a single
   * symbol in the middle of the word of that length.
   *
   * <p>The similarity is computed as:
   *
   * <pre>
   * sim(a, b) = intersect(trgm(a), trgm(b))
   *             ---------------------------
   *               union(trgm(a), trgm(b))
   * </pre>
   *
   * The trigram set contains all possible 3-length substrings of {@code " " + " " + s + " " + " "}
   * The number of trigrams for a word can be computed:
   *
   * <pre>
   * n = |trgm(s)| = |s| + 2
   * </pre>
   *
   * One character being wrong causes 3 trigrams to no longer match. This means the intersection
   * reduces by 3 and the union increases by 3.
   *
   * <pre>
   *  n - 3     |s| + 2 - 3     |s| - 1
   * ------- = ------------- = ---------
   *  n + 3     |s| + 2 + 3     |s| + 5
   * </pre>
   *
   * The actual threshold is slightly below this value, to smooth out any rounding errors.
   */
  public static double getSimilarityThreshold(String input) {
    int length = input.length();

    if (length < 4) {
      return 1;
    }
    return Math.min(0.8, (length - 1.0) / (length + 5.0) - 0.1);
  }
}
