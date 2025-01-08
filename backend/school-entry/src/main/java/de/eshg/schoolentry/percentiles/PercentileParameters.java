/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.percentiles;

import static java.util.Map.entry;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.base.GenderDto;
import java.util.EnumSet;
import java.util.Map;
import java.util.Set;
import java.util.stream.IntStream;

public class PercentileParameters {

  static final Set<GenderDto> SUPPORTED_GENDERS = EnumSet.of(GenderDto.FEMALE, GenderDto.MALE);

  private static final int TWO_AND_A_HALF_YEARS_IN_MONTHS = 30;
  private static final int EIGHTEEN_YEARS_IN_MONTHS = 216;

  static final Set<Integer> SUPPORTED_AGE_GROUPS =
      IntStream.rangeClosed(TWO_AND_A_HALF_YEARS_IN_MONTHS, EIGHTEEN_YEARS_IN_MONTHS)
          .filter(i -> i % 6 == 0)
          .boxed()
          .collect(StreamUtil.toLinkedHashSet());

  private static final Map<Key, Map<Integer, LMSParameters>> PARAMETER_REGISTRY =
      Map.of(
          new Key(QuantityType.HEIGHT, GenderDto.FEMALE), femaleHeightMap(),
          new Key(QuantityType.HEIGHT, GenderDto.MALE), maleHeightMap(),
          new Key(QuantityType.WEIGHT, GenderDto.FEMALE), femaleWeightMap(),
          new Key(QuantityType.WEIGHT, GenderDto.MALE), maleWeightMap(),
          new Key(QuantityType.BMI, GenderDto.FEMALE), femaleBmiMap(),
          new Key(QuantityType.BMI, GenderDto.MALE), maleBmiMap());

  private PercentileParameters() {}

  public static LMSParameters getParameters(
      QuantityType quantity, GenderDto gender, Integer ageGroup) {
    return PARAMETER_REGISTRY.get(new Key(quantity, gender)).get(ageGroup);
  }

  private static Map<Integer, LMSParameters> femaleHeightMap() {
    return Map.ofEntries(
        entry(30, new LMSParameters(0.9134, 1, 0.0364)),
        entry(36, new LMSParameters(0.9575, 1, 0.0372)),
        entry(42, new LMSParameters(0.9979, 1, 0.0379)),
        entry(48, new LMSParameters(1.0351, 1, 0.0385)),
        entry(54, new LMSParameters(1.0715, 1, 0.0393)),
        entry(60, new LMSParameters(1.1082, 1, 0.0399)),
        entry(66, new LMSParameters(1.1431, 1, 0.0404)),
        entry(72, new LMSParameters(1.1759, 1, 0.0409)),
        entry(78, new LMSParameters(1.2069, 1, 0.0414)),
        entry(84, new LMSParameters(1.2365, 1, 0.042)),
        entry(90, new LMSParameters(1.2656, 1, 0.0427)),
        entry(96, new LMSParameters(1.2949, 1, 0.0434)),
        entry(102, new LMSParameters(1.324, 1, 0.0442)),
        entry(108, new LMSParameters(1.3528, 1, 0.045)),
        entry(114, new LMSParameters(1.3818, 1, 0.0457)),
        entry(120, new LMSParameters(1.4118, 1, 0.0462)),
        entry(126, new LMSParameters(1.4433, 1, 0.0463)),
        entry(132, new LMSParameters(1.4765, 1, 0.0461)),
        entry(138, new LMSParameters(1.5104, 1, 0.0454)),
        entry(144, new LMSParameters(1.5431, 1, 0.0443)),
        entry(150, new LMSParameters(1.5722, 1, 0.043)),
        entry(156, new LMSParameters(1.5953, 1, 0.0418)),
        entry(162, new LMSParameters(1.6133, 1, 0.0409)),
        entry(168, new LMSParameters(1.6274, 1, 0.0401)),
        entry(174, new LMSParameters(1.6381, 1, 0.0395)),
        entry(180, new LMSParameters(1.6458, 1, 0.0391)),
        entry(186, new LMSParameters(1.6509, 1, 0.0389)),
        entry(192, new LMSParameters(1.6539, 1, 0.0387)),
        entry(198, new LMSParameters(1.655, 1, 0.0387)),
        entry(204, new LMSParameters(1.6554, 1, 0.0386)),
        entry(210, new LMSParameters(1.6565, 1, 0.0386)),
        entry(216, new LMSParameters(1.6577, 1, 0.0385)));
  }

  private static Map<Integer, LMSParameters> maleHeightMap() {
    return Map.ofEntries(
        entry(30, new LMSParameters(0.9288, -0.0698, 0.0362)),
        entry(36, new LMSParameters(0.9714, -0.0713, 0.0375)),
        entry(42, new LMSParameters(1.01, -0.0646, 0.0385)),
        entry(48, new LMSParameters(1.0456, -0.0512, 0.0393)),
        entry(54, new LMSParameters(1.0794, -0.032, 0.04)),
        entry(60, new LMSParameters(1.1123, -0.0075, 0.0407)),
        entry(66, new LMSParameters(1.1451, 0.0219, 0.0412)),
        entry(72, new LMSParameters(1.1778, 0.0562, 0.0416)),
        entry(78, new LMSParameters(1.2113, 0.096, 0.0417)),
        entry(84, new LMSParameters(1.2451, 0.1413, 0.0419)),
        entry(90, new LMSParameters(1.2777, 0.1915, 0.042)),
        entry(96, new LMSParameters(1.3079, 0.2448, 0.0424)),
        entry(102, new LMSParameters(1.3362, 0.3008, 0.0428)),
        entry(108, new LMSParameters(1.3635, 0.3598, 0.0434)),
        entry(114, new LMSParameters(1.3898, 0.4219, 0.0442)),
        entry(120, new LMSParameters(1.4155, 0.4881, 0.0452)),
        entry(126, new LMSParameters(1.4409, 0.559, 0.0464)),
        entry(132, new LMSParameters(1.4668, 0.6371, 0.0478)),
        entry(138, new LMSParameters(1.4935, 0.7246, 0.0492)),
        entry(144, new LMSParameters(1.5222, 0.8249, 0.0505)),
        entry(150, new LMSParameters(1.5543, 0.9434, 0.0517)),
        entry(156, new LMSParameters(1.5913, 1.083, 0.0523)),
        entry(162, new LMSParameters(1.631, 1.2386, 0.052)),
        entry(168, new LMSParameters(1.6693, 1.3973, 0.0505)),
        entry(174, new LMSParameters(1.7035, 1.5454, 0.0481)),
        entry(180, new LMSParameters(1.7312, 1.6711, 0.0452)),
        entry(186, new LMSParameters(1.752, 1.7691, 0.0426)),
        entry(192, new LMSParameters(1.7666, 1.8391, 0.0405)),
        entry(198, new LMSParameters(1.7762, 1.8857, 0.0391)),
        entry(204, new LMSParameters(1.7824, 1.9158, 0.0382)),
        entry(210, new LMSParameters(1.7868, 1.9374, 0.0376)),
        entry(216, new LMSParameters(1.7904, 1.9551, 0.0371)));
  }

  private static Map<Integer, LMSParameters> femaleWeightMap() {
    return Map.ofEntries(
        entry(30, new LMSParameters(13.18, -0.6711, 0.1144)),
        entry(36, new LMSParameters(14.42, -0.7236, 0.1189)),
        entry(42, new LMSParameters(15.54, -0.7783, 0.1231)),
        entry(48, new LMSParameters(16.6, -0.8367, 0.1273)),
        entry(54, new LMSParameters(17.69, -0.8939, 0.1315)),
        entry(60, new LMSParameters(18.84, -0.9453, 0.1358)),
        entry(66, new LMSParameters(20.06, -0.9871, 0.1401)),
        entry(72, new LMSParameters(21.35, -1.0172, 0.1448)),
        entry(78, new LMSParameters(22.7, -1.034, 0.1503)),
        entry(84, new LMSParameters(24.06, -1.0369, 0.1566)),
        entry(90, new LMSParameters(25.48, -1.0259, 0.1639)),
        entry(96, new LMSParameters(27.01, -1.0011, 0.1723)),
        entry(102, new LMSParameters(28.69, -0.9637, 0.1817)),
        entry(108, new LMSParameters(30.55, -0.915, 0.1915)),
        entry(114, new LMSParameters(32.57, -0.8581, 0.2014)),
        entry(120, new LMSParameters(34.68, -0.7974, 0.2111)),
        entry(126, new LMSParameters(36.92, -0.7394, 0.2192)),
        entry(132, new LMSParameters(39.37, -0.6929, 0.2247)),
        entry(138, new LMSParameters(42.05, -0.6675, 0.2258)),
        entry(144, new LMSParameters(44.87, -0.6719, 0.2218)),
        entry(150, new LMSParameters(47.59, -0.7108, 0.2142)),
        entry(156, new LMSParameters(50.02, -0.7827, 0.2046)),
        entry(162, new LMSParameters(52.16, -0.8798, 0.1948)),
        entry(168, new LMSParameters(54.01, -0.9906, 0.1856)),
        entry(174, new LMSParameters(55.55, -1.1027, 0.1776)),
        entry(180, new LMSParameters(56.8, -1.2062, 0.1712)),
        entry(186, new LMSParameters(57.79, -1.2946, 0.166)),
        entry(192, new LMSParameters(58.53, -1.3656, 0.1622)),
        entry(198, new LMSParameters(59.07, -1.4208, 0.1595)),
        entry(204, new LMSParameters(59.47, -1.4641, 0.1575)),
        entry(210, new LMSParameters(59.78, -1.5008, 0.1559)),
        entry(216, new LMSParameters(60.08, -1.534, 0.1545)));
  }

  private static Map<Integer, LMSParameters> maleWeightMap() {
    return Map.ofEntries(
        entry(30, new LMSParameters(13.87, -0.5809, 0.1132)),
        entry(36, new LMSParameters(15.03, -0.7111, 0.1152)),
        entry(42, new LMSParameters(16.14, -0.8285, 0.1177)),
        entry(48, new LMSParameters(17.15, -0.9304, 0.1206)),
        entry(54, new LMSParameters(18.07, -1.0182, 0.1239)),
        entry(60, new LMSParameters(19.05, -1.1032, 0.1279)),
        entry(66, new LMSParameters(20.19, -1.1897, 0.133)),
        entry(72, new LMSParameters(21.5, -1.2711, 0.1392)),
        entry(78, new LMSParameters(22.98, -1.3401, 0.1463)),
        entry(84, new LMSParameters(24.58, -1.3868, 0.1537)),
        entry(90, new LMSParameters(26.17, -1.4057, 0.161)),
        entry(96, new LMSParameters(27.66, -1.4002, 0.1676)),
        entry(102, new LMSParameters(29.25, -1.3757, 0.1738)),
        entry(108, new LMSParameters(31, -1.334, 0.1797)),
        entry(114, new LMSParameters(32.84, -1.277, 0.1855)),
        entry(120, new LMSParameters(34.79, -1.2054, 0.1915)),
        entry(126, new LMSParameters(36.81, -1.1198, 0.198)),
        entry(132, new LMSParameters(38.88, -1.0215, 0.2047)),
        entry(138, new LMSParameters(41, -0.9131, 0.2111)),
        entry(144, new LMSParameters(43.25, -0.8021, 0.2166)),
        entry(150, new LMSParameters(45.82, -0.698, 0.2209)),
        entry(156, new LMSParameters(48.81, -0.6193, 0.2231)),
        entry(162, new LMSParameters(52.14, -0.5799, 0.2222)),
        entry(168, new LMSParameters(55.51, -0.5842, 0.217)),
        entry(174, new LMSParameters(58.75, -0.6427, 0.2074)),
        entry(180, new LMSParameters(61.69, -0.7319, 0.1953)),
        entry(186, new LMSParameters(64.26, -0.8264, 0.1832)),
        entry(192, new LMSParameters(66.3, -0.9088, 0.174)),
        entry(198, new LMSParameters(67.87, -0.9795, 0.168)),
        entry(204, new LMSParameters(69.15, -1.0401, 0.1641)),
        entry(210, new LMSParameters(70.3, -1.0959, 0.1613)),
        entry(216, new LMSParameters(71.39, -1.1482, 0.1591)));
  }

  private static Map<Integer, LMSParameters> femaleBmiMap() {
    return Map.ofEntries(
        entry(30, new LMSParameters(15.83, -1.485, 0.0805)),
        entry(36, new LMSParameters(15.71, -1.7197, 0.0813)),
        entry(42, new LMSParameters(15.6, -1.8974, 0.083)),
        entry(48, new LMSParameters(15.51, -2.0239, 0.0851)),
        entry(54, new LMSParameters(15.44, -2.1066, 0.0876)),
        entry(60, new LMSParameters(15.41, -2.1531, 0.0904)),
        entry(66, new LMSParameters(15.42, -2.1703, 0.0937)),
        entry(72, new LMSParameters(15.49, -2.1641, 0.0976)),
        entry(78, new LMSParameters(15.6, -2.1391, 0.1025)),
        entry(84, new LMSParameters(15.75, -2.0995, 0.1083)),
        entry(90, new LMSParameters(15.94, -2.0487, 0.115)),
        entry(96, new LMSParameters(16.15, -1.9898, 0.1225)),
        entry(102, new LMSParameters(16.41, -1.9259, 0.1304)),
        entry(108, new LMSParameters(16.69, -1.8601, 0.1383)),
        entry(114, new LMSParameters(16.99, -1.7953, 0.1457)),
        entry(120, new LMSParameters(17.31, -1.7345, 0.1523)),
        entry(126, new LMSParameters(17.64, -1.6803, 0.1578)),
        entry(132, new LMSParameters(18, -1.6351, 0.1617)),
        entry(138, new LMSParameters(18.37, -1.6009, 0.164)),
        entry(144, new LMSParameters(18.77, -1.5791, 0.1647)),
        entry(150, new LMSParameters(19.17, -1.5706, 0.1641)),
        entry(156, new LMSParameters(19.57, -1.5758, 0.1623)),
        entry(162, new LMSParameters(19.94, -1.5943, 0.1598)),
        entry(168, new LMSParameters(20.3, -1.6252, 0.1568)),
        entry(174, new LMSParameters(20.62, -1.6672, 0.1536)),
        entry(180, new LMSParameters(20.91, -1.7187, 0.1503)),
        entry(186, new LMSParameters(21.16, -1.7778, 0.1471)),
        entry(192, new LMSParameters(21.37, -1.8427, 0.1442)),
        entry(198, new LMSParameters(21.55, -1.9117, 0.1414)),
        entry(204, new LMSParameters(21.7, -1.983, 0.1389)),
        entry(210, new LMSParameters(21.83, -2.0556, 0.1366)),
        entry(216, new LMSParameters(21.95, -2.1259, 0.1345)));
  }

  private static Map<Integer, LMSParameters> maleBmiMap() {
    return Map.ofEntries(
        entry(30, new LMSParameters(16.12, -1.0418, 0.0784)),
        entry(36, new LMSParameters(15.94, -1.3293, 0.0768)),
        entry(42, new LMSParameters(15.79, -1.609, 0.0761)),
        entry(48, new LMSParameters(15.64, -1.865, 0.0767)),
        entry(54, new LMSParameters(15.52, -2.0866, 0.0786)),
        entry(60, new LMSParameters(15.44, -2.2676, 0.0819)),
        entry(66, new LMSParameters(15.45, -2.4052, 0.0864)),
        entry(72, new LMSParameters(15.53, -2.4979, 0.0919)),
        entry(78, new LMSParameters(15.65, -2.5461, 0.0981)),
        entry(84, new LMSParameters(15.81, -2.5517, 0.1048)),
        entry(90, new LMSParameters(16, -2.5191, 0.1116)),
        entry(96, new LMSParameters(16.21, -2.455, 0.1183)),
        entry(102, new LMSParameters(16.46, -2.3674, 0.1247)),
        entry(108, new LMSParameters(16.74, -2.2651, 0.1307)),
        entry(114, new LMSParameters(17.04, -2.1564, 0.1361)),
        entry(120, new LMSParameters(17.36, -2.0488, 0.141)),
        entry(126, new LMSParameters(17.68, -1.9481, 0.1454)),
        entry(132, new LMSParameters(17.99, -1.8589, 0.1491)),
        entry(138, new LMSParameters(18.3, -1.7843, 0.1522)),
        entry(144, new LMSParameters(18.6, -1.726, 0.1546)),
        entry(150, new LMSParameters(18.9, -1.6839, 0.1562)),
        entry(156, new LMSParameters(19.21, -1.6563, 0.1571)),
        entry(162, new LMSParameters(19.52, -1.6402, 0.1572)),
        entry(168, new LMSParameters(19.83, -1.6319, 0.1567)),
        entry(174, new LMSParameters(20.15, -1.6279, 0.1557)),
        entry(180, new LMSParameters(20.47, -1.6259, 0.1542)),
        entry(186, new LMSParameters(20.79, -1.6246, 0.1525)),
        entry(192, new LMSParameters(21.1, -1.6239, 0.1505)),
        entry(198, new LMSParameters(21.42, -1.6242, 0.1484)),
        entry(204, new LMSParameters(21.72, -1.6257, 0.1464)),
        entry(210, new LMSParameters(22.03, -1.6281, 0.1443)),
        entry(216, new LMSParameters(22.31, -1.6308, 0.1424)));
  }

  record Key(QuantityType quantity, GenderDto gender) {}
}
