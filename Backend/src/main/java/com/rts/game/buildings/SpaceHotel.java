package com.rts.game.buildings;

import javax.persistence.Entity;

@Entity
public class SpaceHotel extends Building {
  private int capacity = 2;
  public String info = "This building increase the capacity of the base";

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

}
