package handler

import (
	"gin-quickstart/internal/dto"
	"gin-quickstart/internal/response"
	"gin-quickstart/internal/service"
	"strconv"

	"github.com/gin-gonic/gin"
)

type ClubTeamHandler struct {
	svc service.ClubTeamService
}

func NewClubTeamHandler(svc service.ClubTeamService) *ClubTeamHandler {
	return &ClubTeamHandler{svc: svc}
}

func (h *ClubTeamHandler) CreateClubTeam(c *gin.Context) {
	var req dto.CreateClubTeamRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, err.Error())
		return
	}
	team := req.ToModel()
	if err := h.svc.Create(team); err != nil {
		response.InternalError(c)
		return
	}
	response.Created(c, dto.ToClubTeamResponse(team))
}

func (h *ClubTeamHandler) GetClubTeam(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		response.BadRequest(c, "Invalid ID")
		return
	}
	team, err := h.svc.GetByID(uint(id))
	if err != nil {
		response.InternalError(c)
		return
	}
	if team == nil {
		response.NotFound(c)
		return
	}
	response.OK(c, dto.ToClubTeamResponse(team))
}

func (h *ClubTeamHandler) UpdateClubTeam(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		response.BadRequest(c, "Invalid ID")
		return
	}
	var req dto.UpdateClubTeamRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, err.Error())
		return
	}
	team, err := h.svc.GetByID(uint(id))
	if err != nil {
		response.InternalError(c)
		return
	}
	if team == nil {
		response.NotFound(c)
		return
	}
	req.ToModel(team)
	if err := h.svc.Update(team); err != nil {
		response.InternalError(c)
		return
	}
	response.OK(c, dto.ToClubTeamResponse(team))
}

func (h *ClubTeamHandler) ListClubTeams(c *gin.Context) {
	teams, err := h.svc.List()
	if err != nil {
		response.InternalError(c)
		return
	}
	response.OK(c, dto.ToClubTeamResponses(teams))
}

func (h *ClubTeamHandler) DeleteClubTeam(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		response.BadRequest(c, "Invalid ID")
		return
	}
	if err := h.svc.Delete(uint(id)); err != nil {
		response.InternalError(c)
		return
	}
	response.NoContent(c)
}
