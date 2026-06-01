package router

import (
	"gin-quickstart/internal/config"
	"gin-quickstart/internal/handler"
	"gin-quickstart/internal/repository"
	"gin-quickstart/internal/service"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func NewRouter(cfg *config.Config, db *gorm.DB) *gin.Engine {
	r := gin.New()
	r.Use(gin.Logger())
	r.Use(gin.Recovery())

	nationalRepo := repository.NewNationalTeamRepository(db)
	nationalSvc := service.NewNationalTeamService(nationalRepo)
	nationalH := handler.NewNationalTeamHandler(nationalSvc)

	clubRepo := repository.NewClubTeamRepository(db)
	clubSvc := service.NewClubTeamService(clubRepo)
	clubH := handler.NewClubTeamHandler(clubSvc)

	api := r.Group("/api/v1")
	{
		national := api.Group("/national-teams")
		{
			national.POST("", nationalH.CreateNationalTeam)
			national.GET("", nationalH.ListNationalTeams)
			national.GET("/:id", nationalH.GetNationalTeam)
			national.PUT("/:id", nationalH.UpdateNationalTeam)
			national.DELETE("/:id", nationalH.DeleteNationalTeam)
		}

		club := api.Group("/club-teams")
		{
			club.POST("", clubH.CreateClubTeam)
			club.GET("", clubH.ListClubTeams)
			club.GET("/:id", clubH.GetClubTeam)
			club.PUT("/:id", clubH.UpdateClubTeam)
			club.DELETE("/:id", clubH.DeleteClubTeam)
		}
	}

	return r
}
