package com.rts.game.buildings;

import com.rts.game.base.Base;

import javax.persistence.Entity;

@Entity
public class StardustPit extends Building{
  public String info = "This mine increase stardust production";

  public StardustPit() {
  }

  public StardustPit(String type) {
    super(type);
  }

  public void topUpStardust(Base base) {
    base.setStardust(base.getStardust() + 10);
  }

  public int requiredResource(String resource) {
    switch (resource) {
      case "power":
      case "population":
        return 2 + this.getLevel();
      case "stardust":
      case "time":
        return 1 + this.getLevel();
      default:
        throw new IllegalStateException("Please specify resource");
    }
  }

}
