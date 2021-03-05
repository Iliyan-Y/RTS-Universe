package com.rts.game.buildings;

import javax.persistence.Entity;

@Entity
public class Dockyard extends Building {
  private int ships = 0;

  public Dockyard() {
  }

  public Dockyard(Enum<BuildingsType> type) {
    super(type);
  }

  public void buildBattleship() {
    System.out.println("Battleship on the way");
    this.ships += 1;
  }

  public int getShips() {
    return ships;
  }


}
