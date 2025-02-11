import { useForecastQuery, useReverseGeocodeQuery, useWeatherQuery } from "@/hooks/use-weather";
import { useParams, useSearchParams } from "react-router-dom"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import WeatherSkeleton from "@/components/loading-skeleton";
import CurrentWeather from "@/components/current-weather";
import HourleyTemperature from "@/components/hourly-temperature";
import WeatherDetails from "@/components/weather-details";
import WeatherForecast from "@/components/weather-forecast";
import FavoriteButton from "@/components/favorite-button";

const CityPage = () => {

  const [searchParams] = useSearchParams();
  const params = useParams();

  const lat = parseFloat(searchParams.get("lat") || "0");
  const lon = parseFloat(searchParams.get("lon") || "0");

  const coordinates = { lat, lon };
  
  const weatherQuery = useWeatherQuery(coordinates);
  const forecastQuery = useForecastQuery(coordinates);
  const locationQuery = useReverseGeocodeQuery(coordinates);




  if (weatherQuery.error || forecastQuery.error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          Failed to load weather data. Please try again.
        </AlertDescription>
      </Alert>
    )
  }

  if (!weatherQuery.data || !forecastQuery.data || !locationQuery || !params.cityName) {
    return <WeatherSkeleton />
  }

  const country = weatherQuery.data.sys.country;
  const state = locationQuery.data?.[0]?.state ?? null;

  return (
    <div className="space-y-4">
      {/* {Favorite Cities} */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">{params.cityName}, {!state ? country : `${state}, ${country}`}</h1>
      </div>
      <div>
        {/* favorite button */}
        <FavoriteButton data={{...weatherQuery.data, name:params.cityName}} />
      </div>

      <div className="grid gap-6"> 
        <div className="flex flex-col gap-4">
          <CurrentWeather data = {weatherQuery.data} />
          <HourleyTemperature data={forecastQuery.data} />
          {/* hourly temperature */}
        </div>

        <div className="grid gap-6 md:grid-cols-2 items-start">
            {/* details */}
            <WeatherDetails data={weatherQuery.data} />
            
            {/* forecast */}
            <WeatherForecast data={forecastQuery.data} />
        </div>
      </div>
    </div>
  );
};

export default CityPage