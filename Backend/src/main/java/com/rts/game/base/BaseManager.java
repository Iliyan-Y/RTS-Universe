package com.rts.game.base;

import com.rts.game.buildings.Dockyard;

public class BaseManager {

  public static void buildDockyard(Base base) {
    base.getBuildings().add(new Dockyard("doker one"));
  }
}
