package com.rts.game.buildings;

import com.rts.game.base.Base;

import javax.persistence.Entity;

@Entity
public class StardustPit extends Building {
  public String info = "This mine increase stardust production";

  public StardustPit() {
  }

  public StardustPit(Enum<BuildingsType> type) {
    super(type);
  }

  public void topUpStardust(Base base) {
    base.setStardust(base.getStardust() + 10);
  }


}
