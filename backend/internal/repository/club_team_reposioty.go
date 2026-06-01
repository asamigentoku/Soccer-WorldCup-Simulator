package repository

import (
	"errors"
	"gin-quickstart/internal/model"

	"gorm.io/gorm"
)

// uintは符号なし整数
// 関数名(引数)(出力)
type ClubTeamRepository interface {
	Create(clubTeam *model.ClubTeam) error
	GetByID(id uint) (*model.ClubTeam, error)
	Update(clubTeam *model.ClubTeam) error
	Delete(id uint) error
	List() ([]*model.ClubTeam, error)
}

type clubTeamRepository struct {
	db *gorm.DB
}

func NewClubTeamRepository(db *gorm.DB) ClubTeamRepository {
	return &clubTeamRepository{db: db}
}

func (repo *clubTeamRepository) Create(clubTeam *model.ClubTeam) error {
	return repo.db.Create(clubTeam).Error
}

func (repo *clubTeamRepository) GetByID(id uint) (*model.ClubTeam, error) {
	//その型で受け取るDBだと定義してあげる
	var clubTeam model.ClubTeam
	err := repo.db.First(&clubTeam, id).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &clubTeam, err
}

func (repo *clubTeamRepository) Update(clubTeam *model.ClubTeam) error {
	return repo.db.Save(clubTeam).Error
}

func (repo *clubTeamRepository) Delete(id uint) error {
	return repo.db.Delete(&model.ClubTeam{}, id).Error
}

// (関数内引数) 関数名(引数) (出力)
func (repo *clubTeamRepository) List() ([]*model.ClubTeam, error) {
	var clubTeams []*model.ClubTeam
	err := repo.db.Find(&clubTeams).Error
	return clubTeams, err
}
