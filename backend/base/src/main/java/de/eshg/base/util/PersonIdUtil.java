/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.util;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import org.springframework.util.Assert;

public class PersonIdUtil {
  private static final char[] LONG_TO_STRING_ALPHABET =
      "0123456789abcdefghijklmnopqrstuvwxyz".toCharArray();
  private static final char[] PERSON_ID_ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ".toCharArray();
  private static final int PERSON_ID_LENGTH = 8;
  private static final long NUMBER_OF_POSSIBLE_PERSON_IDS =
      1L
          << (PERSON_ID_LENGTH
              * 5); // 5 because we have 32 characters, which conveniently makes 5 bits

  private static final Map<Character, Character> alphabetMap = new HashMap<>();
  private static final Map<Character, Character> reverseAlphabetMap = new HashMap<>();

  static {
    for (int i = 0; i < PERSON_ID_ALPHABET.length; i++) {
      alphabetMap.put(LONG_TO_STRING_ALPHABET[i], PERSON_ID_ALPHABET[i]);
      reverseAlphabetMap.put(PERSON_ID_ALPHABET[i], LONG_TO_STRING_ALPHABET[i]);
    }
  }

  private static final Random random = new Random();

  public static String longToPersonId(Long number) {
    if (number == null) {
      return null;
    }
    String base32String = Long.toString(number, PERSON_ID_ALPHABET.length);

    if (base32String.length() < PERSON_ID_LENGTH) {
      base32String = "0".repeat(PERSON_ID_LENGTH - base32String.length()) + base32String;
    }

    char[] personIdChars = new char[PERSON_ID_LENGTH];
    char[] base32Chars = base32String.toCharArray();
    for (int i = 0; i < PERSON_ID_LENGTH; i++) {
      personIdChars[i] = alphabetMap.get(base32Chars[i]);
    }
    Assert.isTrue(
        base32String.length() == PERSON_ID_LENGTH, "Unexpected personId number " + number);

    return new String(personIdChars);
  }

  public static Long personIdToLong(String personId) {
    if (personId == null) {
      return null;
    }
    Assert.isTrue(personId.length() == PERSON_ID_LENGTH, "Unexpected personId length " + personId);

    char[] personIdChars = personId.toCharArray();
    char[] base32Chars = new char[PERSON_ID_LENGTH];
    for (int i = 0; i < PERSON_ID_LENGTH; i++) {
      base32Chars[i] = reverseAlphabetMap.get(personIdChars[i]);
    }
    return Long.parseLong(new String(base32Chars), PERSON_ID_ALPHABET.length);
  }

  public static long getRandomPersonIdAsLong() {
    return random.nextLong(NUMBER_OF_POSSIBLE_PERSON_IDS);
  }

  public static String getRandomPersonId() {
    return longToPersonId(getRandomPersonIdAsLong());
  }

  public static boolean isValidPersonId(String personId) {
    if (personId == null) {
      return false;
    }
    char[] personIdChars = personId.toCharArray();
    if (personIdChars.length != PERSON_ID_LENGTH) {
      return false;
    } else {
      for (int i = 0; i < PERSON_ID_LENGTH; i++) {
        if (!reverseAlphabetMap.containsKey(personIdChars[i])) {
          return false;
        }
      }
      return true;
    }
  }
}
