package main

import (
	"fmt"
	"io"
	"net/http"

	"github.com/spf13/viper"
)

func main() {
	viper.SetConfigFile("lambda/.env")
	viper.AutomaticEnv()

	if err := viper.ReadInConfig(); err != nil {
		panic(err)
	}

	apiKey := viper.GetString("API_FOOTBALL_KEY")

	req, err := http.NewRequest(
		"GET",
		"https://v3.football.api-sports.io/leagues",
		nil,
	)
	if err != nil {
		panic(err)
	}

	req.Header.Set("x-apisports-key", apiKey)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)

	fmt.Println(string(body))
}
