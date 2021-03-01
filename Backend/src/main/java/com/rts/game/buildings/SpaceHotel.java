package com.rts.game.buildings;

import javax.persistence.Entity;

@Entity
public class SpaceHotel extends Building {
  private int capacity = 2;

  public SpaceHotel() {
  }

  public SpaceHotel(String type) {
    super(type);
  }

  public int getCapacity() {
    return capacity;
  }

  public void setCapacity(int capacity) {
    this.capacity = capacity;
  }
}
