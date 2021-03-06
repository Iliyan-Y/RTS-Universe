package com.rts.game.buildings;

import com.rts.game.base.Resources;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.Map;

@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@Table(name = "buildings")
public class Building {
  @Id
  @SequenceGenerator(
      name = "buildings_sequence",
      sequenceName = "buildings_sequence",
      allocationSize = 1
  )
  @GeneratedValue(
      strategy = GenerationType.SEQUENCE,
      generator = "buildings_sequence"
  )
  @Column(name = "id")
  private Long id;

  private Enum<BuildingsType> type;
  private int level = 0;
  private boolean build = false;
  private boolean updating = false;
  private LocalDateTime completeTime;

  public Building() {
  }

  public Building(Enum<BuildingsType> type) {
    this.type = type;
  }

  public Long getId() {
    return id;
  }


  public Enum<BuildingsType> getType() {
    return type;
  }

  public void setType(Enum<BuildingsType> type) {
    this.type = type;
  }

  public int getLevel() {
    return level;
  }

  public void setLevel(int level) {
    this.level = level;
  }

  public boolean isBuild() {
    return build;
  }

  public void setBuild(boolean build) {
    this.build = build;
  }

  public boolean isUpdating() {
    return updating;
  }

  public void setUpdating(boolean updating) {
    this.updating = updating;
  }

  public LocalDateTime getCompleteTime() {
    return this.completeTime;
  }

  public void setCompleteTime(int minutes) {
    this.completeTime = LocalDateTime.now().plusMinutes(minutes);
  }


  public Map<Enum<Resources>, Integer> getCost(Enum<BuildingsType> type) {
    Enum<Resources> power = Resources.POWER;
    Enum<Resources> stardust = Resources.STARDUST;
    Enum<Resources> population = Resources.POPULATION;
    Enum<Resources> time = Resources.TIME;

    if (BuildingsType.DOCKYARD.equals(type)) {
      return Map.of(stardust, 2 + this.getLevel(), power, 1,
          population, 1, time, 1 + this.getLevel());
    } else if (BuildingsType.SPACE_HOTEL.equals(type)) {
      return Map.of(stardust, 1, power, 2 + this.getLevel(), population
          , 0, time, 1 + this.getLevel());
    } else if (BuildingsType.STARDUST_PIT.equals(type)) {
      return Map.of(stardust, 1, power, 2 + this.getLevel(), population
          , 2 + this.getLevel(), time, 1 + this.getLevel());
    }
    throw new IllegalStateException("Please specify building type");
  }
}
