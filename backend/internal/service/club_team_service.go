package service

import (
	"gin-quickstart/internal/model"
	"gin-quickstart/internal/repository"
)

type ClubTeamService interface {
	Create(clubteam *model.ClubTeam) error
	GetByID(id uint) (*model.ClubTeam, error)
	Update(clubteam *model.ClubTeam) error
	Delete(id uint) error
	List() ([]*model.ClubTeam, error)
}

type clubTeamService struct {
	repo repository.ClubTeamRepository
}

func NewClubTeamService(repo repository.ClubTeamRepository) ClubTeamService {
	return &clubTeamService{repo: repo}
}

func (svc *clubTeamService) Create(clubteam *model.ClubTeam) error {
	return svc.repo.Create(clubteam)
}
func (svc *clubTeamService) GetByID(id uint) (*model.ClubTeam, error) {
	return svc.repo.GetByID(id)
}
func (svc *clubTeamService) Update(clubteam *model.ClubTeam) error {
	return svc.repo.Update(clubteam)
}
func (svc *clubTeamService) Delete(id uint) error {
	return svc.repo.Delete(id)
}
func (svc *clubTeamService) List() ([]*model.ClubTeam, error) {
	return svc.repo.List()
}
