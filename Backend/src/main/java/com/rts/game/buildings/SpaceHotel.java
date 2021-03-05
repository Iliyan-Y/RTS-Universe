package com.rts.game.buildings;

import javax.persistence.Entity;

@Entity
public class SpaceHotel extends Building {
  private int capacity = 2;

  public SpaceHotel() {
  }

  public SpaceHotel(Enum<BuildingsType> type) {
    super(type);
  }

  public int getCapacity() {
    return capacity;
  }

  public void setCapacity(int capacity) {
    this.capacity = capacity;
  }


  public int requiredResource(String resource) {
    switch(resource) {
      case "power":
        return 2 + this.getLevel();
      case "stardust":
      case "time":
        return 1 + this.getLevel();
      case "population":
        return 0;
      default:
        throw new IllegalStateException("Please specify resource");
    }
  }
}
