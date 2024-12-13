package internal

import (
	"math"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Directions struct {
	Lat float64 `bson: "lat" json:"lat"`
	Lng float64 `bson: lng json:"lng"`
}

type Route struct {
	Id           string       `bson: "_id" json:"id"`
	Distance     int          `bson: "distance" json:"distance"`
	Directions   []Directions `bson: "directions" json:"directions"`
	FreightPrice float64      `bson: "freight_price" json:"freight_price"`
}

func NewRoute(id string, distance int, directions []Directions) *Route {
	return &Route{
		Id:         id,
		Distance:   distance,
		Directions: directions,
	}
}

type FreightService struct{}

func (fs *FreightService) CalculateFreight(distance int) float64 {
	return math.Floor((float64(distance)*0.15+0.3)*100) / 100
}

func NewFreightService() *FreightService {
	return &FreightService{}
}

type RoteService struct {
	mongo          *mongo.Client
	freightService *FreightService
}

func NewRoteService(mongo *mongo.Client, freightService *FreightService) *RoteService {
	return &RoteService{
		mongo:          mongo,
		freightService: freightService,
	}
}

func (rs *RoteService) CreateRoute(route *Route) (*Route, error) {
	route.FreightPrice = rs.freightService.CalculateFreight(route.Distance)
	update := bson.M{
		"$set": bson.M{
			"distance":     route.Distance,
			"directions":   route.Directions,
			"freightPrice": route.FreightPrice,
		},
	}
	filter := bson.M{"_id": route.Id}
	opts := options.Update().SetUpsert(true)
	_, err := rs.mongo.Database("routes").Collection("routes").UpdateOne(nil, filter, update, opts)
	if err != nil {
		return nil, err
	}
	return route, err
}

func (rs *RoteService) GetRoute(id string) (Route, error) {
	var route Route
	filter := bson.M{"_id": id}
	err := rs.mongo.Database("routes").Collection("routes").FindOne(nil, filter).Decode(&route)
	if err != nil {
		return Route{}, err
	}
	return route, err
}
