package model

import "gorm.io/gorm"

// gorm.Model を埋め込むと ID/CreatedAt/UpdatedAt/DeletedAt が自動付与される

type NationalTeam struct {
	gorm.Model
	Country string `json:"country" gorm:"not null"`
	Group   string `json:"group"   gorm:"not null"`
	Rank    int    `json:"rank"    gorm:"not null"`
}
