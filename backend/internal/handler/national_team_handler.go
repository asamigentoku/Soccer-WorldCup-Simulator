package handler

import (
	"gin-quickstart/internal/dto"
	"gin-quickstart/internal/response"
	"gin-quickstart/internal/service"
	"strconv"

	"github.com/gin-gonic/gin"
)

type NationalTeamHandler struct {
	svc service.NationalTeamService
}

func NewNationalTeamHandler(svc service.NationalTeamService) *NationalTeamHandler {
	return &NationalTeamHandler{svc: svc}
}

func (h *NationalTeamHandler) CreateNationalTeam(c *gin.Context) {
	var req dto.CreateNationalTeamRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, err.Error())
		return
	}
	team := req.ToModel()
	err := h.svc.Create(team)
	if err != nil {
		response.InternalError(c)
		return
	}
	response.Created(c, dto.ToNationalTeamResponse(team))
}

func (h *NationalTeamHandler) GetNationalTeam(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
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
	response.OK(c, dto.ToNationalTeamResponse(team))
}

func (h *NationalTeamHandler) UpdateNationalTeam(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		response.BadRequest(c, "Invalid ID")
		return
	}
	var req dto.UpdateNationalTeamRequest
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
	err = h.svc.Update(team)
	if err != nil {
		response.InternalError(c)
		return
	}
	response.OK(c, dto.ToNationalTeamResponse(team))
}

func (h *NationalTeamHandler) ListNationalTeams(c *gin.Context) {
	teams, err := h.svc.List()
	if err != nil {
		response.InternalError(c)
		return
	}
	response.OK(c, dto.ToNationalTeamResponses(teams))
}

func (h *NationalTeamHandler) DeleteNationalTeam(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		response.BadRequest(c, "Invalid ID")
		return
	}
	err = h.svc.Delete(uint(id))
	if err != nil {
		response.InternalError(c)
		return
	}
	response.NoContent(c)
}
