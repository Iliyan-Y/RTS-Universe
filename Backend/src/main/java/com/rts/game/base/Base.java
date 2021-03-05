package com.rts.game.base;

import com.rts.game.buildings.Building;
import com.rts.game.player.Player;

import javax.persistence.*;
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

  @OneToMany( cascade = CascadeType.ALL)
  private Set<Building> buildings;

  private String name;
  private int power = 10;
  private int population = 1;
  private int capacity = 10;
  private int stardust = 10;
  private int powerPerTime = 1;
  private int stardustPerTime = 1;

  public Base() {
  }

  public Base(Long id, String name) {
    this.id = id;
    this.name = name;
  }

  public Long getId() {
    return id;
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

  public void construct(Building building) {
    if(checkForBuilding(building.getType())) {
      throw new IllegalStateException(building.getType() + " is already build");
    }
    //checkResource();
    this.getBuildings().add(building);
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

  private Boolean checkForBuilding(String buildingType) {
    if (this.getBuildings().isEmpty()) {
      return false;
    }
    Stream buildings = this.getBuildings().stream()
        .filter(building -> building.getType().equals(buildingType));
    return buildings.count() != 0;
  }

  private void checkResource(int reqPower, int reqStardust, int reqPopulation) {
    if (this.getCapacity() - this.getPopulation() < reqPopulation ) {
      throw new IllegalStateException("Not enough capacity");
    }
    if (reqPower > this.getPower() ) {
      throw new IllegalStateException("Not enough power");
    }
    if (reqStardust > this.getStardust()){ throw new IllegalStateException(
        "Not enough stardust");}
  }

}
