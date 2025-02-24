/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ExpectationResult, MatcherState } from "@vitest/expect";
import * as fs from "fs";
import * as path from "path";
import "vitest";

import { isObject } from "./guards";
import { normalize } from "./normalizer";

const TEST_PATH_SEPARATOR = " > ";
const MISSING_FILE_BANNER = "===== missing file =====";
const OUTPUT_FOLDER = "data/test/output";
const VALIDATION_FOLDER = "data/test/validation";

export interface MatchValidationFileOptions {
  suffix?: string;
  maskUndefinedObjectProperties?: boolean;
}

export function toMatchValidationFile(
  this: MatcherState,
  received: unknown,
  options: MatchValidationFileOptions = {},
): ExpectationResult {
  const { currentTestName, testPath, equals, isNot } = this;

  if (currentTestName === undefined) {
    throw new Error("Missing test name");
  }

  if (testPath === undefined) {
    throw new Error("Missing test path");
  }

  if (isNot) {
    throw new Error("Matcher negation is not supported");
  }

  const testNames = currentTestName
    .split(TEST_PATH_SEPARATOR)
    .map(normalizeTestName);
  const suffix = options.suffix !== undefined ? `_${options.suffix}` : "";
  const fileExtension = getFileExtension(received);

  const testName = testNames.pop();
  const absoluteTestNamePath = path.join(testPath, ...testNames);
  const relativeTestNamePath = path.relative("src", absoluteTestNamePath);
  const fileName = `${testName}${suffix}.${fileExtension}`;

  const outputFolder = `${OUTPUT_FOLDER}/${relativeTestNamePath}`;
  const actualFile = `${outputFolder}/${fileName}`;

  const validationFolder = `${VALIDATION_FOLDER}/${relativeTestNamePath}`;
  const validationFile = `${validationFolder}/${fileName}`;

  mkdir(outputFolder);
  mkdir(validationFolder);

  const normalizedReceived = normalize(received, {
    maskUndefinedObjectProperties:
      options.maskUndefinedObjectProperties ?? false,
  });
  const actual = `${normalizedReceived}\n`;

  if (!fs.existsSync(validationFile)) {
    writeFile(validationFile, `${MISSING_FILE_BANNER}\n${actual}`);
  }
  writeFile(actualFile, actual);

  const storedActual = readFile(actualFile);
  const storedValidation = readFile(validationFile);

  return {
    pass: equals(storedActual, storedValidation, [], true),
    message: () => "Actual value does not match validation file",
    actual: storedActual,
    expected: storedValidation,
  };
}

function normalizeTestName(name: string): string {
  return name
    .replaceAll(/[ .:]/g, "_")
    .replaceAll(/'(\w+)'/g, "$1")
    .replaceAll(/\+0/g, "0")
    .replaceAll(/'/g, "_")
    .replaceAll(/,/g, "");
}

function getFileExtension(value: unknown): string {
  if (isObject(value)) {
    return "json";
  }

  return "txt";
}

function mkdir(path: string): void {
  fs.mkdirSync(path, { recursive: true });
}

function readFile(path: string): string {
  return fs.readFileSync(path, { encoding: "utf8" });
}

function writeFile(file: string, data: string): void {
  fs.writeFileSync(file, data, { encoding: "utf8" });
}
