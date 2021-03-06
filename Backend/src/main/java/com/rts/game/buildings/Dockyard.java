package com.rts.game.buildings;

import com.rts.game.base.Resources;

import javax.persistence.Entity;
import java.util.Map;

@Entity
public class Dockyard extends Building {
  private int ships = 0;
  private final Map<Enum<Resources>, Integer> battleshipCost =
      Map.of(
          Resources.POWER, 3,
          Resources.STARDUST, 5,
          Resources.POPULATION, 2,
          Resources.TIME, 5,
          Resources.LEVEL, 2
      );


  public Dockyard() {
  }

  public Dockyard(Enum<BuildingsType> type) {
    super(type);
  }

  //this is just a test fn
  public void buildBattleship() {

    if (getLevel() < getBattleshipCost().get(Resources.LEVEL)) {
      throw new IllegalStateException("Dockyard level"  + getBattleshipCost().get(Resources.LEVEL) + " required to build battleship");
    }
    System.out.println("Battleship on the way");
    // refactor in the future - ships belong to class units
    this.ships += 1;
  }

  public int getShips() {
    return ships;
  }


  public Map<Enum<Resources>, Integer> getBattleshipCost() {
    return battleshipCost;
  }
}
