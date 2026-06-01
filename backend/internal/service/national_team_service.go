package service

import (
	"gin-quickstart/internal/model"
	"gin-quickstart/internal/repository"
)

// NationalTeamService インターフェースの定義
type NationalTeamService interface {
	Create(nationalTeam *model.NationalTeam) error
	GetByID(id uint) (*model.NationalTeam, error)
	Update(nationalTeam *model.NationalTeam) error
	Delete(id uint) error
	List() ([]*model.NationalTeam, error)
}

type nationalTeamService struct {
	repo repository.NationalTeamRepository // 依存するリポジトリを保持
}

func NewNationalTeamService(repo repository.NationalTeamRepository) NationalTeamService {
	return &nationalTeamService{repo: repo}
}

func (svc *nationalTeamService) Create(nationalTeam *model.NationalTeam) error {
	return svc.repo.Create(nationalTeam)
}

func (svc *nationalTeamService) GetByID(id uint) (*model.NationalTeam, error) {
	return svc.repo.GetByID(id)
}

func (svc *nationalTeamService) Update(nationalTeam *model.NationalTeam) error {
	return svc.repo.Update(nationalTeam)
}

func (svc *nationalTeamService) Delete(id uint) error {
	return svc.repo.Delete(id)
}

func (svc *nationalTeamService) List() ([]*model.NationalTeam, error) {
	return svc.repo.List()
}
