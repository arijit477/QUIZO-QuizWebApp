import { NgxUiLoaderHttpModule, NgxUiLoaderService } from 'ngx-ui-loader';
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { authInterceptorProviders } from './app/service/auth.interceptor';
import { NgxUiLoaderModule, NgxUiLoaderConfig,NgxUiLoaderRouterModule  } from 'ngx-ui-loader';
import { importProvidersFrom } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  // your configuration here
};

bootstrapApplication(AppComponent , {
  providers: [
    ...appConfig.providers,
        provideAnimations(),
    provideHttpClient( withInterceptorsFromDi()),
    authInterceptorProviders,
     importProvidersFrom(
      NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
         NgxUiLoaderHttpModule.forRoot(
          {showForeground: true}
         ),
          NgxUiLoaderRouterModule.forRoot({ showForeground: false })
    ),
  ]
});
