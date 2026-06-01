package config

import (
	"github.com/joho/godotenv"
	"github.com/spf13/viper"
)

type Config struct {
	Env         string
	Port        string
	PostgresUrl string
}

func Load() (*Config, error) {
	_ = godotenv.Load()

	viper.SetDefault("ENV", "development")
	viper.SetDefault("PORT", "8080")
	viper.AutomaticEnv()

	return &Config{
		Env:         viper.GetString("ENV"),
		Port:        viper.GetString("PORT"),
		PostgresUrl: viper.GetString("POSTGRES_URL"),
	}, nil
}
