package repository

import (
	"errors"
	"gin-quickstart/internal/model"

	"gorm.io/gorm"
)

// uintは符号なし整数
// 関数名(引数)(出力)
type NationalTeamRepository interface {
	Create(nationalTeam *model.NationalTeam) error
	GetByID(id uint) (*model.NationalTeam, error)
	Update(nationalTeam *model.NationalTeam) error
	Delete(id uint) error
	List() ([]*model.NationalTeam, error)
}

type nationalTeamRepository struct {
	db *gorm.DB
}

func NewNationalTeamRepository(db *gorm.DB) NationalTeamRepository {
	return &nationalTeamRepository{db: db}
}

func (repo *nationalTeamRepository) Create(nationalTeam *model.NationalTeam) error {
	return repo.db.Create(nationalTeam).Error
}

func (repo *nationalTeamRepository) GetByID(id uint) (*model.NationalTeam, error) {
	// その型で受け取るDBだと定義してあげる
	var nationalTeam model.NationalTeam
	err := repo.db.First(&nationalTeam, id).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &nationalTeam, err
}

func (repo *nationalTeamRepository) Update(nationalTeam *model.NationalTeam) error {
	return repo.db.Save(nationalTeam).Error
}

func (repo *nationalTeamRepository) Delete(id uint) error {
	return repo.db.Delete(&model.NationalTeam{}, id).Error
}

// (関数内引数) 関数名(引数) (出力)
func (repo *nationalTeamRepository) List() ([]*model.NationalTeam, error) {
	var nationalTeams []*model.NationalTeam
	err := repo.db.Find(&nationalTeams).Error
	return nationalTeams, err
}
