package com.rts.game.buildings;

import com.rts.game.base.Base;

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

  @ManyToOne
  @JoinColumn(name="base_id", nullable=false)
  private Base base;

  private String name;
  private int level;

  public Building() {
  }

  public Building(String name, int level) {
    this.name = name;
    this.level = level;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public int getLevel() {
    return level;
  }

  public void setLevel(int level) {
    this.level = level;
  }
}
