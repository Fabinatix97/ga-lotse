/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, expect, test } from "vitest";

import {
  mapDateTimeToInput,
  mapEndWholeDayRequest,
  mapStartWholeDayRequest,
  validateEndAfterStart,
} from "./dateOrDateTimeFieldHelper";

describe("mapDateTimeToInput", () => {
  const TEST_DATE = new Date("2023-11-20T13:04:17.587Z");
  test("should return date in date format when wholeDay is true", () => {
    expect(mapDateTimeToInput(TEST_DATE, true)).toBe("2023-11-20");
  });
  test("should return date in datetime format when wholeDay is false", () => {
    expect(mapDateTimeToInput(TEST_DATE, false)).toBe("2023-11-20T13:04");
  });
});

describe("validateEndAfterStart", () => {
  const TEST_START_DATETIME = "2023-11-20T13:00";
  const TEST_END_DATETIME = "2023-11-20T14:00";
  const TEST_START_DATE = "2023-11-20";
  const TEST_END_DATE = "2023-11-21";

  const goodCaseNonWholeDay = {
    start: TEST_START_DATETIME,
    end: TEST_END_DATETIME,
    wholeDay: false,
  };
  const goodCaseWholeDay = {
    start: TEST_START_DATE,
    end: TEST_END_DATE,
    wholeDay: true,
  };
  const goodCaseNonWholeDaySameValues = {
    start: TEST_START_DATETIME,
    end: TEST_START_DATETIME,
    wholeDay: false,
  };
  const goodCaseWholeDaySameValues = {
    start: TEST_START_DATE,
    end: TEST_START_DATE,
    wholeDay: true,
  };
  const errorCaseNonWholeDay = {
    start: TEST_END_DATETIME,
    end: TEST_START_DATETIME,
    wholeDay: false,
  };
  const errorCaseWholeDay = {
    start: TEST_END_DATE,
    end: TEST_START_DATE,
    wholeDay: true,
  };
  test.each([
    ["non whole day", goodCaseNonWholeDay],
    ["whole day", goodCaseWholeDay],
    ["non whole day, same values", goodCaseNonWholeDaySameValues],
    ["whole day, same values", goodCaseWholeDaySameValues],
  ])("good case: %s", (name, values) => {
    expect(validateEndAfterStart(values)).toBeUndefined();
  });
  test.each([
    ["non whole day", errorCaseNonWholeDay],
    ["whole day", errorCaseWholeDay],
  ])("error case: %s", (name, values) => {
    expect(validateEndAfterStart(values)!.end).toEqual(
      "Enddatum muss nach dem Startdatum liegen.",
    );
  });
});

describe("mapStartWholeDayRequest, mapEndWholeDayRequest", () => {
  const TEST_START = "2023-11-20T13:04:17.587Z";
  const TEST_START_DATE = new Date(TEST_START);
  const TEST_START_START_OF_DAY = new Date("2023-11-20T00:00:00.000Z");
  const TEST_END = "2024-10-20T11:03:16.423Z";
  const TEST_END_DATE = new Date(TEST_END);
  const TEST_END_END_OF_DAY = new Date("2024-10-20T23:59:59.999Z");

  test("should return the input when wholeDay is false", () => {
    expect(mapStartWholeDayRequest(TEST_START, false)).toEqual(TEST_START_DATE);
  });
  test("should return start of day / end of day when wholeDay is true", () => {
    expect(mapStartWholeDayRequest(TEST_START, true)).toEqual(
      TEST_START_START_OF_DAY,
    );
  });

  test("should return the input when wholeDay is false", () => {
    expect(mapEndWholeDayRequest(TEST_END, false)).toEqual(TEST_END_DATE);
  });
  test("should return start of day / end of day when wholeDay is true", () => {
    expect(mapEndWholeDayRequest(TEST_END, true)).toEqual(TEST_END_END_OF_DAY);
  });
});
