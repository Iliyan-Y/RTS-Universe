package com.rts.game.base;

import com.rts.game.buildings.Building;
import com.rts.game.buildings.Dockyard;
import com.rts.game.buildings.SpaceHotel;
import com.rts.game.buildings.StardustPit;
import com.rts.game.helpers.Validator;



public class BaseManager {

  public static Dockyard buildDockyard(Base base) {
    if (Validator.checkForBuilding(base, "Dockyard")) {
       throw new IllegalStateException("Dockyard is already build");
     }

    Dockyard dockyard = new Dockyard("Dockyard");
    int requiredPower = dockyard.requiredResource("power");
    int requiredStardust = dockyard.requiredResource("stardust");
    int requiredPopulation = dockyard.requiredResource("population");

    Validator.checkResource(base, requiredPower, requiredStardust, requiredPopulation);
    updateResourceAfterBuild(base, requiredPower, requiredStardust, requiredPopulation);
    dockyard.setBuildStatus(true);
    dockyard.setCompleteTime(dockyard.requiredResource("time"));
    return dockyard;
  }


  public static void buildStardustMine(Base base) {
    if (Validator.checkForBuilding(base, "Stardust pit")) {
      throw new IllegalStateException("Stardust pit");
    }
    base.getBuildings().add(new StardustPit("Stardust pit"));
  }

  public static void buildHotel(Base base) {
    SpaceHotel spaceHotel = new SpaceHotel("Space Hotel");
    base.getBuildings().add(spaceHotel);
    base.setCapacity(base.getCapacity() + spaceHotel.getCapacity());
  }

  public static void completeBuilding(Base base, Building building){
    base.getBuildings().add(building);
    building.setBuildStatus(false);
  }

  public static void updateResourceAfterBuild(Base base, int reqPower,
                                              int reqStardust, int reqPopulation) {
    base.setPower(base.getPower() - reqPower);
    base.setStardust(base.getStardust() - reqStardust);
    base.setPopulation(base.getPopulation() + reqPopulation);
  }

}
