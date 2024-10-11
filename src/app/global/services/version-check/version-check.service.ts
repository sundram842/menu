import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class VersionCheckService {
  // this will be replaced by actual hash post-build.js
  private currentHash = '{{POST_BUILD_ENTERS_HASH_HERE}}';

  private currentAppVersion = '{{POST_BUILD_ENTERS_VERSION_HERE}}';

  constructor(private http: HttpClient) {}

  /**
   * Checks in every set frequency the version of frontend application
   * @param url
   * @param {number} frequency - in milliseconds, defaults to 30 minutes
   */
  public initVersionCheck(url: any, frequency = 1000 * 60 * 1) {
    // * 30
    setInterval(() => {
      this.checkVersion(url);
    }, frequency);
  }

  public getCurrentAppVersion(): string {
    return this.currentAppVersion;
  }

  /**
   * Will do the call and check if the hash has changed or not
   * @param url
   */
  private checkVersion(url: any) {
    // timestamp these requests to invalidate caches
    this.http
      .get(url + '?t=' + new Date().getTime())
      .pipe(first())
      .subscribe(
        (response: any) => {
          const hash = response.hash;
          const appVersion = response.version;
          const hashChanged = this.hasHashChanged(
            this.currentHash,
            hash,
            this.currentAppVersion,
            appVersion,
          );

          // If new version, do something
          if (hashChanged) {
            // ENTER YOUR CODE TO DO SOMETHING UPON VERSION CHANGE
            // for an example: location.reload();
            window.location.href = location.href;
          }
          // store the new hash so we wouldn't trigger versionChange again
          // only necessary in case you did not force refresh
          this.currentHash = hash;
          this.currentAppVersion = appVersion;
        },
        (err) => {
          console.error(err, 'Could not get version');
        },
      );
  }

  /**
   * Checks if hash has changed.
   * This file has the JS hash, if it is a different one than in the version.json
   * we are dealing with version change
   * @param currentHash
   * @param newHash
   * @returns {boolean}
   */
  private hasHashChanged(
    currentHash: string,
    newHash: any,
    currentAppVersion: string,
    newVersion: any,
  ) {
    if (
      (!currentHash || currentHash === '{{POST_BUILD_ENTERS_HASH_HERE}}') &&
      (!currentAppVersion ||
        currentAppVersion === '{{POST_BUILD_ENTERS_VERSION_HERE}}')
    ) {
      return false;
    }

    return currentHash !== newHash || currentAppVersion !== newVersion;
  }
}
