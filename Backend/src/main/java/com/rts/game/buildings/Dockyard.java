package com.rts.game.buildings;

import javax.persistence.Entity;
import java.util.Map;

@Entity
public class Dockyard extends Building {
  private int ships = 0;


  public Dockyard() {
  }

  public Dockyard(Enum<BuildingsType> type) {
    super(type);
  }

  public int buildBattleship() {
    int requiredPopulation = 2;
    System.out.println("Battleship on the way");
    this.ships += 1;
    return requiredPopulation;
  }

  public int getShips() {
    return ships;
  }


}
