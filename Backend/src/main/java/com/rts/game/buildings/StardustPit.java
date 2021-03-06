package com.rts.game.buildings;

import javax.persistence.Entity;

@Entity
public class StardustPit extends Building {
  public String info = "This mine increase stardust production";
  private int productionPerTime = 1;

  public StardustPit() {
  }

  public StardustPit(Enum<BuildingsType> type) {
    super(type);
  }

  public int getProductionPerTime() {
    return productionPerTime;
  }

  public void setProductionPerTime(int productionPerTime) {
    this.productionPerTime = productionPerTime;
  }
}
