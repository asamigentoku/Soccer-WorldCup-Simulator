package dto

import "gin-quickstart/internal/model"

// リクエスト用（クライアントから受け取るデータ）
type CreateClubTeamRequest struct {
	Name    string `json:"name"    binding:"required"`
	Country string `json:"country" binding:"required"`
	League  string `json:"league"  binding:"required"`
	Rank    int    `json:"rank"    binding:"required"`
}

type UpdateClubTeamRequest struct {
	Name    string `json:"name"    binding:"required"`
	Country string `json:"country" binding:"required"`
	League  string `json:"league"  binding:"required"`
	Rank    int    `json:"rank"    binding:"required"`
}

// レスポンス用（クライアントへ返すデータ）
type ClubTeamResponse struct {
	ID      uint   `json:"id"`
	Name    string `json:"name"`
	Country string `json:"country"`
	League  string `json:"league"`
	Rank    int    `json:"rank"`
}

// CreateClubTeamRequest → model.ClubTeam
func (r *CreateClubTeamRequest) ToModel() *model.ClubTeam {
	return &model.ClubTeam{
		Name:    r.Name,
		Country: r.Country,
		League:  r.League,
		Rank:    r.Rank,
	}
}

// UpdateClubTeamRequest → model.ClubTeam（既存モデルに上書き）
func (r *UpdateClubTeamRequest) ToModel(existing *model.ClubTeam) *model.ClubTeam {
	existing.Name = r.Name
	existing.Country = r.Country
	existing.League = r.League
	existing.Rank = r.Rank
	return existing
}

// model.ClubTeam → ClubTeamResponse
func ToClubTeamResponse(m *model.ClubTeam) *ClubTeamResponse {
	return &ClubTeamResponse{
		ID:      m.ID,
		Name:    m.Name,
		Country: m.Country,
		League:  m.League,
		Rank:    m.Rank,
	}
}

// []*model.ClubTeam → []*ClubTeamResponse
func ToClubTeamResponses(teams []*model.ClubTeam) []*ClubTeamResponse {
	responses := make([]*ClubTeamResponse, len(teams))
	for i, t := range teams {
		responses[i] = ToClubTeamResponse(t)
	}
	return responses
}
