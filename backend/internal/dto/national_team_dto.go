package dto

import "gin-quickstart/internal/model"

type CreateNationalTeamRequest struct {
	Country string `json:"country" binding:"required"`
	Group   string `json:"group"   binding:"required"`
	Rank    int    `json:"rank"    binding:"required"`
}

type UpdateNationalTeamRequest struct {
	Country string `json:"country" binding:"required"`
	Group   string `json:"group"   binding:"required"`
	Rank    int    `json:"rank"    binding:"required"`
}

// レスポンス用（クライアントへ返すデータ）
type NationalTeamResponse struct {
	ID      uint   `json:"id"`
	Country string `json:"country"`
	Group   string `json:"group"`
	Rank    int    `json:"rank"`
}

// CreateNationalTeamRequest → model.NationalTeam
func (r *CreateNationalTeamRequest) ToModel() *model.NationalTeam {
	return &model.NationalTeam{
		Country: r.Country,
		Group:   r.Group,
		Rank:    r.Rank,
	}
}

// UpdateNationalTeamRequest → model.NationalTeam（既存モデルに上書き）
func (r *UpdateNationalTeamRequest) ToModel(existing *model.NationalTeam) *model.NationalTeam {
	existing.Country = r.Country
	existing.Group = r.Group
	existing.Rank = r.Rank
	return existing
}

// model.NationalTeam → NationalTeamResponse
func ToNationalTeamResponse(m *model.NationalTeam) *NationalTeamResponse {
	return &NationalTeamResponse{
		ID:      m.ID,
		Country: m.Country,
		Group:   m.Group,
		Rank:    m.Rank,
	}
}

// []*model.NationalTeam → []*NationalTeamResponse
func ToNationalTeamResponses(teams []*model.NationalTeam) []*NationalTeamResponse {
	responses := make([]*NationalTeamResponse, len(teams))
	for i, t := range teams {
		responses[i] = ToNationalTeamResponse(t)
	}
	return responses
}
