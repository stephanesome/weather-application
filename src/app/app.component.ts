import {Component, inject, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Weather} from "./model/weather.model";
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {OpenWeatherService} from "./service/open-weather.service";
import {Country, MatSelectCountryModule} from "@angular-material-extensions/select-country";
import {DatePipe, DecimalPipe, NgIf} from "@angular/common";

function parseResponse(response: any): Weather {
  return new Weather({mainCondition: response.weather[0].main,
      temperature: response.main.temp - 273.15,
      pressure: response.main.pressure,
      humidity: response.main.humidity,
      windspeed: response.wind.speed,
      city: response.name,
      country: response.sys.country
    }
  );
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,
    ReactiveFormsModule,
    MatSelectCountryModule, NgIf, DatePipe, DecimalPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent  implements OnInit {
  title = 'weather-application';
  weatherForm!: FormGroup;
  condition: Weather | null = null;
  message: string | null = null;
  currentDate!: number;
  private formBuilder: FormBuilder = inject(FormBuilder);
  private weatherService: OpenWeatherService = inject(OpenWeatherService);

  ngOnInit(): void {

    this.weatherForm = this.formBuilder.group({
      country: [],
      city: []
    });
  }

  submit(): void {
    const selectedCountry: Country = this.weatherForm.get('country')!.value;
    const selectedCity: string = this.weatherForm.get('city')!.value;
    this.weatherService.getWeatherAtCity(selectedCity, selectedCountry.alpha2Code).subscribe({
      next: (response: any) => {
        this.message = null;
        this.currentDate = Date.now();
        this.condition = parseResponse(response);
      },
      error: (error: any) => {this.condition = null; this.message = error; }
    });
  }
}
