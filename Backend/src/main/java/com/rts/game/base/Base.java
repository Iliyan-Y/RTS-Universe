package com.rts.game.base;

import com.rts.game.buildings.Building;
import com.rts.game.buildings.BuildingsType;
import com.rts.game.player.Player;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Set;
import java.util.stream.Stream;

@Entity
@Table(name = "base")
public class Base {
  @Id
  @SequenceGenerator(
      name = "base_sequence",
      sequenceName = "base_sequence",
      allocationSize = 1
  )
  @GeneratedValue(
      strategy = GenerationType.SEQUENCE,
      generator = "base_sequence"
  )
  @Column(name = "id")
  private Long id;

  @OneToOne(mappedBy = "base")
  private Player player;

  @OneToMany(cascade = CascadeType.ALL)
  private Set<Building> buildings;

  private String name;
  private int power = 10;
  private int population = 1;
  private int capacity = 10;
  private int stardust = 10;
  private int powerPerTime = 1;
  private int stardustPerTime = 1;
  private int level = 1;
  private boolean upgrading = false;
  private LocalDateTime completeTime;
  public String info = "Upgrading the base will increase the power production";

  public Base() {
  }

  public Base(String name) {
    this.name = name;
  }

  public Long getId() {
    return id;
  }

  public int getLevel() {
    return level;
  }

  public void setLevel(int level) {
    this.level = level;
  }

  public boolean isUpgrading() {
    return upgrading;
  }

  public void setUpgrading(boolean upgrading) {
    this.upgrading = upgrading;
  }

  public LocalDateTime getCompleteTime() {
    return completeTime;
  }

  public void setCompleteTime(int minutes) {
    this.completeTime = LocalDateTime.now().plusMinutes(minutes);
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public int getPower() {
    return power;
  }

  public void setPower(int power) {
    this.power = power;
  }

  public int getPopulation() {
    return population;
  }

  public void setPopulation(int population) {
    this.population = population;
  }

  public int getCapacity() {
    return capacity;
  }

  public void setCapacity(int capacity) {
    this.capacity = capacity;
  }

  public int getStardust() {
    return stardust;
  }

  public void setStardust(int stardust) {
    this.stardust = stardust;
  }

  public Set<Building> getBuildings() {
    return buildings;
  }

  public int getPowerPerTime() {
    return powerPerTime;
  }

  public void setPowerPerTime(int powerPerTime) {
    this.powerPerTime = powerPerTime;
  }

  public int getStardustPerTime() {
    return stardustPerTime;
  }

  public void setStardustPerTime(int stardustPerTime) {
    this.stardustPerTime = stardustPerTime;
  }

  public void timeResourceUpdate() {
    setPower(this.power + this.powerPerTime);
    setStardust(this.stardust + this.stardustPerTime);
  }

  public Building construct(Building building) {
    if (checkForBuilding(building.getType())) {
      throw new IllegalStateException(building.getType() + " is already build");
    }
    checkResource(building.getCost(building.getType()));
    updateResourceAfterBuild(building.getCost(building.getType()));
    building.setCompleteTime(building.getCost(building.getType()).get(Resources.TIME));
    this.getBuildings().add(building);
    return building;
  }

  public LocalDateTime upgradeBuilding(Building building) {
    if (!building.isBuild()) {
      throw new IllegalStateException(building.getType() + " isn't build yet");
    }
    if (building.isUpgrade()) {
      throw new IllegalStateException(building.getType() + " is upgrading");
    }
    checkResource(building.getCost(building.getType()));
    updateResourceAfterBuild(building.getCost(building.getType()));
    building.setCompleteTime(building.getCost(building.getType()).get(Resources.TIME));
    building.setUpgrade(true);

    return building.getCompleteTime();
  }

  public void upgrade() {
    if (this.upgrading) {
      throw new IllegalStateException("Base " + this.name + " is upgrading");
    }
    checkResource(upgradeCost());
    updateResourceAfterBuild(upgradeCost());
    this.setUpgrading(true);
    this.setCompleteTime(upgradeCost().get(Resources.TIME));
  }

  public Map<Enum<Resources>, Integer> upgradeCost() {
    return Map.of(
        Resources.STARDUST, 2 + this.level,
        Resources.POWER, 2 + this.level,
        Resources.POPULATION, 2 + this.level,
        Resources.TIME, 0 + this.level);
  }

  private Boolean checkForBuilding(Enum<BuildingsType> buildingType) {
    if (this.getBuildings().isEmpty()) {
      return false;
    }
    Stream<Building> buildings = this.getBuildings().stream()
        .filter(building -> building.getType().equals(buildingType));
    return buildings.count() != 0;
  }

  private void checkResource(Map<Enum<Resources>, Integer> cost) {
    if (this.getCapacity() - this.getPopulation() < cost.get(Resources.POPULATION)) {
      throw new IllegalStateException("Not enough capacity");
    }
    if (cost.get(Resources.POWER) > this.getPower()) {
      throw new IllegalStateException("Not enough power");
    }
    if (cost.get(Resources.STARDUST) > this.getStardust()) {
      throw new IllegalStateException(
          "Not enough stardust");
    }
  }

  private void updateResourceAfterBuild(Map<Enum<Resources>, Integer> cost) {
    this.setPower(this.getPower() - cost.get(Resources.POWER));
    this.setStardust(this.getStardust() - cost.get(Resources.STARDUST));
    this.setPopulation(this.getPopulation() + cost.get(Resources.POPULATION));
  }
}
