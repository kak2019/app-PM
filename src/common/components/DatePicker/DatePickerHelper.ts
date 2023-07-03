export const formatDate = (date?: Date): string => {
    return !date
      ? ""
      : date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();
  };