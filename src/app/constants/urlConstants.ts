import { InjectionToken } from '@angular/core';

export interface UrlConstants {
  getMenuItems: string;
  getEmployees: string;
  authLogin: string;
  getPrimaryIngredients: string;
  getCategory: string;
  subCategory: string;
  scheduleMenu: string;
  getMenuItemsByKeyWord: string;
  getScheduleMenuDetails: string;
  updateScheduleMenu: string;
}

export const urlConstants: UrlConstants = {
  getMenuItems: 'menu-items',
  getEmployees: 'employees',
  authLogin: 'auth/login',
  getPrimaryIngredients: 'primary-ingredients',
  getCategory: 'categories',
  subCategory: 'sub-categories',
  scheduleMenu: 'schedule-menu',
  getMenuItemsByKeyWord: 'menu-items/search',
  getScheduleMenuDetails: 'schedule-menu',
  updateScheduleMenu: 'schedule-menu',
};

// Create an InjectionToken for the config
export const URL_CONSTANTS_TOKEN = new InjectionToken<UrlConstants>(
  'URL_CONSTANTS_TOKEN',
);
