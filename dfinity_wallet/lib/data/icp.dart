import 'package:flutter/services.dart';
import 'package:intl/intl.dart';

final _e8sPerICP = BigInt.from(100000000);

/// A class for representing units of ICP.
class ICP {
  final BigInt _e8s;

  /// Initialize ICP from the amount of e8s.
  static ICP fromE8s(BigInt e8s) {
    return new ICP._(e8s);
  }

  /// Returns an ICP instance with zero e8s.
  static ICP get zero {
    return new ICP._(BigInt.zero);
  }

  /// Initialize ICP from a string.
  static ICP fromString(String s) {
    // First try to parse the string as a double to ensure the input is sane.
    {
      final doubleValue = double.parse(s);
      if (doubleValue < 0) {
        throw new FormatException("ICP value cannot be negative: $s");
      }
    }

    final splits = s.split(".");
    if (splits.length > 2) {
      // This should never happen, since we already know the string parses as a double.
      throw new FormatException("Invalid format for ICP: $s");
    }

    final integral = splits[0];
    var fractional = (splits.length > 1) ? splits[1] : "";
    if (fractional.length > 8) {
      throw new FormatException("Fractional can have at most 8 decimal places");
    }

    // Pad the fractional to be 8 digits for easier conversion to BigInt.
    fractional = fractional.padRight(8, '0');

    BigInt value =
        (BigInt.parse(integral) * _e8sPerICP) + BigInt.parse(fractional);
    return new ICP._(value);
  }

  /// Private constructor.
  ICP._(this._e8s);

  BigInt asE8s() {
    return this._e8s;
  }

  String asString(String locale, [int minDecimals = 2, int maxDecimals = 8]) {
    if (minDecimals < 0 || minDecimals > 8) {
      throw new ArgumentError.value(minDecimals, "minDecimals");
    }
    if (maxDecimals < 0 || maxDecimals > 8 || maxDecimals < minDecimals) {
      throw new ArgumentError.value(maxDecimals, "maxDecimals");
    }

    final integral = (this._e8s / _e8sPerICP).floor();
    final integralString = NumberFormat("###,##0", locale).format(integral);

    final fractional = (this._e8s % _e8sPerICP).toInt();
    var fractionalString = NumberFormat("#######0", locale).format(fractional);

    if (fractionalString.length < 8) {
      fractionalString = fractionalString.padLeft(8, "0");
    }
    fractionalString = fractionalString.substring(0, maxDecimals);

    late int trimCount = 0;
    for (var i = fractionalString.length - 1; i >= minDecimals; i--) {
      if (fractionalString[i] != "0") {
        break;
      }
      trimCount++;
    }
    if (trimCount > 0) {
      fractionalString = fractionalString.substring(0, fractionalString.length - trimCount);
    }

    return fractionalString.length > 0
      ? integralString + "." + fractionalString
      : integralString;
  }

  /// Returns the number of ICP as a double. Warning - this can result in loss
  /// of precision!
  double asDouble() {
    return this._e8s / _e8sPerICP;
  }

  ICP operator +(ICP other) {
    return ICP.fromE8s(_e8s + other._e8s);
  }

  ICP operator -(ICP other) {
    return ICP.fromE8s(_e8s - other._e8s);
  }
}

class ICPTextInputFormatter extends TextInputFormatter {
  final RegExp pattern = RegExp(r'^[\d]*(\.[\d]{0,8})?$');

  ICPTextInputFormatter();

  @override
  TextEditingValue formatEditUpdate(
      TextEditingValue oldValue,
      TextEditingValue newValue) {
    return this.pattern.hasMatch(newValue.text)
        ? newValue
        : oldValue;
  }
}
