package com.rts.game.buildings;

import com.rts.game.base.Base;

public class StardustMine extends Building{
  public String info = "This mine increase stardust production";

  public StardustMine(String type) {
    super(type);
  }

  public void topUpStardust(Base base) {
    base.setStardust(base.getStardust() + 10);
  }


}
