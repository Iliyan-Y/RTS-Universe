package com.rts.game.helpers;

public class Validator {
  public static void validateInputString(String field, String value){
    if (value == null || value.isEmpty()) {
      throw new IllegalStateException(field + ": is required");
    }
  }
}
