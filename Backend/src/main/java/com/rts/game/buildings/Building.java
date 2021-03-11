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
  private boolean upgrade = false;
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

  public boolean isUpgrade() {
    return upgrade;
  }

  public void setUpgrade(boolean upgrade) {
    this.upgrade = upgrade;
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
    int level = this.level;

    if (BuildingsType.DOCKYARD.equals(type)) {
      return Map.of(
          stardust, 2 + level,
          power, 1 + level,
          population, 1 + level,
          time, 1 + level);
    } else if (BuildingsType.SPACE_HOTEL.equals(type)) {
      return Map.of(
          stardust, 1 + level,
          power, 2 + level,
          population, 0,
          time, 1 + level);
    } else if (BuildingsType.STARDUST_PIT.equals(type)) {
      return Map.of(
          stardust, 1 + level,
          power, 2 + level,
          population, 2 + level,
          time, 1 + level);
    }
    throw new IllegalStateException("Please specify building type");
  }
}
