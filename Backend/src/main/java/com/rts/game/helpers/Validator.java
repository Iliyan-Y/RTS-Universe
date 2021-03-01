package com.rts.game.helpers;

import com.rts.game.base.Base;
import com.rts.game.buildings.Building;

public class Validator {
  public static void validateInputString(String field, String value){
    if (value == null || value.isEmpty()) {
      throw new IllegalStateException(field + ": is required");
    }
  }

  public static void checkResource(Base base, int reqPower, int reqStardust, int reqPopulation) {
    if (base.getCapacity() - base.getPopulation() < reqPopulation ) {
      throw new IllegalStateException("Not enough capacity");
    }
    if (reqPower > base.getPower() ) {
      throw new IllegalStateException("Not enough power");
    }
    if (reqStardust > base.getStardust()){ throw new IllegalStateException(
        "Not enough stardust");}
  }

  public static Boolean checkForBuilding(Base base, String buildingType) {
    if (base.getBuildings().isEmpty()) {
      return false;
    }
    Building dock = base.getBuildings().stream()
        .filter(building -> building.getType().equals(buildingType))
        .findFirst().get();
    return dock.getType().equals(buildingType);
  }

}
