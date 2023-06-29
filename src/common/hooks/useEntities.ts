import { useCallback } from "react";

import {
    EntitiesStatus,
    isFetchingSelector,
    messageSelector,
    myEntitySelector,
    allEntitiesByTypeSelector,
    fetchMyEntityAction,
    fetchEntitiesByTypeAction,
    EntitiesTypeChanged,
    typeSelector,
    EntitiesType,
} from '../features/entities';
import { IEntitiesListItem } from '../model';
import { useAppSelector, useAppDispatch } from './useApp';

type EntitiesOperators = [
    isFetching: EntitiesStatus,
    type: EntitiesType,
    fetchMyEntity: ()=>void,
    fetchEntitiesByType:(arg: {type:EntitiesType})=>void,
    myEntity:IEntitiesListItem,
    entities:IEntitiesListItem[],
    errorMessage:string
];
export const useEntities = ():Readonly<EntitiesOperators> => {
    const dispatch = useAppDispatch();
    const myEntity = useAppSelector(myEntitySelector);
    const isFetching = useAppSelector(isFetchingSelector);
    const type = useAppSelector(typeSelector);
    const errorMessage = useAppSelector(messageSelector);
    const entities = useAppSelector(allEntitiesByTypeSelector);

    const fetchMyEntity = useCallback(()=> {
        return dispatch(fetchMyEntityAction());
    },[dispatch]);

    const fetchEntitiesByType = useCallback((arg:{type:EntitiesType})=>{
        dispatch(EntitiesTypeChanged(arg.type));
        return dispatch(fetchEntitiesByTypeAction(arg));
    },
    [dispatch]);

    return [
        isFetching,
        type,
        fetchMyEntity,
        fetchEntitiesByType,
        myEntity,
        entities,
        errorMessage,
    ] as const;
}