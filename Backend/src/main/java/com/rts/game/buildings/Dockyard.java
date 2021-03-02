package com.rts.game.buildings;

import javax.persistence.Entity;

@Entity
public class Dockyard extends Building{
  private int ships = 0;

  public Dockyard() {
  }

  public Dockyard(String type) {
    super(type);
  }

  public void buildBattleship() {
    System.out.println("Battleship on the way");
    this.ships += 1;
  }

  public int getShips() {
    return ships;
  }

  public int requiredResource(String resource) {
    switch(resource) {
      case "power":
        return 2 + this.getLevel();
      case "stardust":
      case "population":
      case "time":
        return 1 + this.getLevel();
      default:
        throw new IllegalStateException("Please specify resource");
    }
  }
}
