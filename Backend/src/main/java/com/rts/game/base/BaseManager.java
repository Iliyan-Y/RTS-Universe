package com.rts.game.base;

import com.rts.game.buildings.Dockyard;
import com.rts.game.buildings.SpaceHotel;
import com.rts.game.buildings.StardustPit;

public class BaseManager {

  public static void buildDockyard(Base base) {
    base.getBuildings().add(new Dockyard("Dockyard"));
  }

  public static Dockyard getDockyard(Base base) {
    return (Dockyard) base.getBuildings().stream()
        .filter(building -> building.getType().equals("Dockyard"))
        .findFirst().get();
  }

  public static void buildStardustMine(Base base) {
    base.getBuildings().add(new StardustPit("Stardust pit"));
  }

  public static StardustPit getStardustPit(Base base) {
      return (StardustPit) base.getBuildings().stream()
      .filter(building -> building.getType().equals("Stardust pit"))
      .findFirst().get();
  }

  public static void buildHotel(Base base) {
    SpaceHotel spaceHotel = new SpaceHotel("Space Hotel");
    base.getBuildings().add(spaceHotel);
    base.setCapacity(base.getCapacity() + spaceHotel.getCapacity());
  }

  public static SpaceHotel getHotel(Base base) {
    return (SpaceHotel) base.getBuildings().stream()
        .filter(building -> building.getType().equals("Space Hotel"))
        .findFirst().get();
  }

}
