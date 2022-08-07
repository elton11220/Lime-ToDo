type Filter = {
  [reducer: string]: string[];
};

interface Options {
  filter?: Filter;
}

const persistDataMiddleware = (
  options: Options = {
    filter: {},
  }
) => {
  const targetRegExp = new RegExp('[a-zA-z]+(?=/)|(?<=/)[a-zA-z]+', 'g');
  const filter = options.filter as Filter;
  const allowedReducers: string[] = Object.keys(filter);
  const allowedKeywords: Array<string[]> = Object.values(filter).map(
    (item: string[]) => item.map((value: string) => value.toLowerCase())
  );
  return (store: any) => (next: any) => (action: any) => {
    if (filter) {
      const targetMatch = action.type.match(targetRegExp);
      if (targetMatch !== null && targetMatch.length === 2) {
        const [targetReducer, targetAction] = targetMatch;
        const reducerIndex = allowedReducers.findIndex(
          (value: string) => value === targetReducer
        );
        if (
          reducerIndex !== -1 &&
          allowedKeywords[reducerIndex].some((value: string) =>
            targetAction.toLowerCase().includes(value)
          )
        ) {
          const previousState = store.getState();
          if (previousState[targetReducer]) {
            const previousReducer = previousState[targetReducer];
            const stateKeys: string[] = Object.keys(previousReducer);
            const lowerCaseKeys: string[] = stateKeys.map((value: string) =>
              value.toLowerCase()
            );
            console.log(previousReducer, stateKeys);
          }
        }
      } else {
        console.error(
          `persistDataMiddleware处理失败：\n传入的action pattern需要为 reducer/action\n此处使用正则表达式：/[a-zA-z]+(?=/)|(?<=/)[a-zA-z]+/g 匹配\n而你dispatch的action为 ${action.type}`
        );
      }
    }
    return next(action);
  };
};

export default persistDataMiddleware;
