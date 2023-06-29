import { EntitiesType } from "../features/entities";

export interface IEntitiesListItem {
  ID: string;
  Name?: string;
  Type?: EntitiesType;
  Address?: string;
  Country?: string;
  Title: string;
  Users?: string;
}