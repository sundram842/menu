import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { VersionCheckService } from './global/services/version-check/version-check.service';
import { environment } from '../environments/environment';
import { themes } from '../app-theme-manager/themes';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'zpos-smb-admin-fe';

  themeName: string;

  constructor(
    private translate: TranslateService,
    private versionCheckService: VersionCheckService,
  ) {
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('en');
    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use('en');

    // this.versionCheckService.initVersionCheck(environment.versionCheckURL);
    this.themeName = environment.appTheme;
    this.getTheme(this.themeName);
  }

  getTheme(themeName: string): void {
    const bodyElement = document.querySelector('html');
    if (bodyElement) {
      if (themes[themeName]) {
        Object.values(themes).map((theme) =>
          bodyElement.classList.remove(theme.class),
        );
        const selectedTheme = themes[themeName];
        bodyElement.classList.add(selectedTheme.class);
        document.documentElement.style.setProperty(
          '--primary-color',
          selectedTheme.primaryColor,
        );
        document.documentElement.style.setProperty(
          '--color15',
          selectedTheme.customHueColor,
        );
      } else {
        bodyElement.classList.add('cbp');
        document.documentElement.style.setProperty(
          '--primary-color',
          themes.cbp.primaryColor,
        );
        document.documentElement.style.setProperty(
          '--color15',
          themes.cbp.customHueColor,
        );
      }
    }
  }
}
