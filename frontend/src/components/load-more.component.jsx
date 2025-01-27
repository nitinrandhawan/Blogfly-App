export const LoadMoreComponent =  ({ state, fectchDataFunc }) => {

  if (state && state.totalDocs > state.results.length) {
  return  <button
      className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2"
      onClick={() => {
        fectchDataFunc({ page: state.page + 1 });
      }}
    >
      Load More
    </button>;
  }
};
