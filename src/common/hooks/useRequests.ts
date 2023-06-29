import { useCallback } from "react";

import {
  RequestStatus,
  isFetchingSelector,
  messageSelector,
  itemSelector,
  itemsSelector,
  itemIdSelector,
  termialIdSelector,
  listIdSelector,
  RequestItemIdChanged,
  RequestListIdChange,
  RequestTermialIdChange,
  fetchByIdAction,
  fetchByTermialIdAction,
  addRequestAction,
  fetchRequestListIdAction,
  editRequestAction,
} from "../features/requests";
import { useAppSelector, useAppDispatch } from "./useApp";
import { IRequestListItem } from "../model";


type RequestsOperators = [
  isFetching: RequestStatus,
  errorMessage:string,
  request: IRequestListItem,
  requests: IRequestListItem[],
  requestItemId: string,
  requestTermialId: string,
  fetchRequestById: (Id: number) => void,
  fetchRequestsByTermialId: (TermialId: string) => void,
  addRequest: (arg: { request: IRequestListItem }) => Promise<number>,
  requestListId: string,
  fetchRequestListId: () => void,
  changeRequestId:(Id:string) => void,
  changeRequestListId: (Id: string) => void,
  editRequest: (arg: { request: IRequestListItem }) => Promise<number>,
];
export const useRequests = (): Readonly<RequestsOperators> => {
  const dispatch = useAppDispatch();
  const request = useAppSelector(itemSelector);
  const requests = useAppSelector(itemsSelector);
  const requestItemId = useAppSelector(itemIdSelector);
  const requestTermialId = useAppSelector(termialIdSelector);
  const requestListId = useAppSelector(listIdSelector);
  const isFetching = useAppSelector(isFetchingSelector);
  const errorMessage = useAppSelector(messageSelector);

  const fetchRequestById = useCallback(
    (Id: number) => {
      dispatch(RequestItemIdChanged(Id));
      return dispatch(fetchByIdAction({ Id }));
    },
    [dispatch]
  );
  const fetchRequestsByTermialId = useCallback(
    (TerminalId: string) => {
        dispatch(RequestTermialIdChange(TerminalId));
      return dispatch(fetchByTermialIdAction({ TerminalId }));
    },
    [dispatch]
  );
  const addRequest = useCallback(
    async (arg: { request: IRequestListItem }) => {
      try {
        await dispatch(addRequestAction(arg));
        return 0;
      } catch {
        return Promise.reject(1);
      }
    },
    [dispatch]
  );

  const editRequest = useCallback(
    async (arg: { request: IRequestListItem }) => {
      try {
        await dispatch(editRequestAction(arg));
        return 0;
      } catch {
        return Promise.reject(1);
      }
    },
    [dispatch]
  );

  const fetchRequestListId = useCallback(async () => {
    return dispatch(fetchRequestListIdAction());
  }, [dispatch]);

  const chnageRequestId = useCallback((Id:string)=>{
    return dispatch(RequestItemIdChanged(Id));
  },[dispatch])

  const changeRequestListId = useCallback(
    async (Id: string) => {
      return dispatch(RequestListIdChange(Id));
    },
    [dispatch]
  );

  return [
    isFetching,
    errorMessage,
    request,
    requests,
    requestItemId,
    requestTermialId,
    fetchRequestById,
    fetchRequestsByTermialId,
    addRequest,
    requestListId,
    fetchRequestListId,
    chnageRequestId,
    changeRequestListId,
    editRequest,
  ] as const;
};
