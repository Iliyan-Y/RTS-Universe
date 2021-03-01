package com.rts.game.buildings;

import javax.persistence.*;

@Entity
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

  private String type;
  private int level = 0;

  public Building() {
  }

  public Building(String type) {
    this.type = type;
  }

  public String getType() {
    return type;
  }

  public void setType(String type) {
    this.type = type;
  }

  public int getLevel() {
    return level;
  }

  public void setLevel(int level) {
    this.level = level;
  }
}
