package model

import "gorm.io/gorm"

// gorm.Model を埋め込むと ID/CreatedAt/UpdatedAt/DeletedAt が自動付与される

type ClubTeam struct {
	gorm.Model
	Name    string `json:"name" gorm:"not null"`
	Country string `json:"country" gorm:"not null"`
	League  string `json:"league" gorm:"not null"`
	Rank    int    `json:"rank" gorm:"not null"`
}

//type Team struct {
//	ID         int    `json:"id"`          // 管理用ID（1, 2, 3...）
//	Country    string `json:"country"`     // 国名（例: "日本", "アルゼンチン"）
//	Group      string `json:"group"`       // W杯のグループ（例: "Group C"）
//	Rank       int    `json:"fifa_rank"`   // FIFAランキング（例: 15）
//	Manager    string `json:"manager"`     // 監督名
//	Points     int    `json:"points"`      // グループステージの勝ち点（初期値は0）
//}

//type ClubTeam struct {
//	ID        int    `json:"id"`         // 管理用ID
//	Name      string `json:"name"`       // チーム名（例: "FCバルセロナ", "レアル・マドリード"）
//	Country   string `json:"country"`    // 本拠地の国（例: "スペイン", "イングランド"）
//	League    string `json:"league"`     // 所属リーグ（例: "ラ・リーガ", "プレミアリーグ"）
//	Manager   string `json:"manager"`    // 監督名（例: "ハンジ・フリック"）
//	Stadium   string `json:"stadium"`    // ホームスタジアム（例: "カンプ・ノウ"）
//	Rank2026  int    `json:"rank_2026"`  // 現在（2026年シーズン）のリーグ順位
//}
